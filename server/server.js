import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'https://*.trycloudflare.com'],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false // Set to true in production with HTTPS
  }
}));
app.use(passport.initialize());
app.use(passport.session());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'practice123',
  database: 'naver_financial',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000
});

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE google_id = ?',
        [profile.id]
      );

      let user;
      if (rows.length === 0) {
        // Create new user
        const [result] = await pool.query(
          'INSERT INTO users (google_id, email, name, profile_picture) VALUES (?, ?, ?, ?)',
          [profile.id, profile.emails[0].value, profile.displayName, profile.photos[0]?.value]
        );
        user = {
          id: result.insertId,
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName
        };
      } else {
        user = rows[0];
        // Update last login
        await pool.query(
          'UPDATE users SET last_login = NOW() WHERE id = ?',
          [user.id]
        );
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err);
  });

// Column mapping
const COLUMN_MAP = {
  '상가업소번호': 'col1',
  '상호명': 'col2',
  '지점명': 'col3',
  '상권업종대분류코드': 'col4',
  '상권업종대분류명': 'col5',
  '상권업종중분류코드': 'col6',
  '상권업종중분류명': 'col7',
  '상권업종소분류코드': 'col8',
  '상권업종소분류명': 'col9',
  '표준산업분류코드': 'col10',
  '표준산업분류명': 'col11',
  '시도코드': 'col12',
  '시도명': 'col13',
  '시군구코드': 'col14',
  '시군구명': 'col15',
  '행정동코드': 'col16',
  '행정동명': 'col17',
  '법정동코드': 'col18',
  '법정동명': 'col19',
  '지번코드': 'col20',
  '대지구분코드': 'col21',
  '대지구분명': 'col22',
  '지번본번지': 'col23',
  '지번부번지': 'col24',
  '지번주소': 'col25',
  '도로명코드': 'col26',
  '도로명': 'col27',
  '건물본번지': 'col28',
  '건물부번지': 'col29',
  '건물관리번호': 'col30',
  '건물명': 'col31',
  '도로명주소': 'col32',
  '구우편번호': 'col33',
  '신우편번호': 'col34',
  '동정보': 'col35',
  '층정보': 'col36',
  '호정보': 'col37',
  '경도': 'col38',
  '위도': 'col39'
};

const REVERSE_MAP = Object.fromEntries(
  Object.entries(COLUMN_MAP).map(([k, v]) => [v, k])
);

// Translate Korean column names to col1, col2, etc.
function translateQuery(query) {
  let translated = query;

  // Sort by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(COLUMN_MAP).sort((a, b) => b.length - a.length);

  for (const korean of sortedKeys) {
    const pattern = new RegExp(`["'\`]?${korean}["'\`]?`, 'g');
    translated = translated.replace(pattern, COLUMN_MAP[korean]);
  }

  return translated;
}

// Translate results back to Korean column names
function translateResults(rows) {
  if (!rows || rows.length === 0) return [];

  return rows.map(row => {
    const translatedRow = {};
    for (const [colName, value] of Object.entries(row)) {
      const koreanName = REVERSE_MAP[colName] || colName;
      translatedRow[koreanName] = value;
    }
    return translatedRow;
  });
}

// Authentication routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173');
  });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// Log query to database
async function logQuery(userId, queryText, executionTime, rowCount, success, errorMessage = null) {
  try {
    await pool.query(
      'INSERT INTO query_logs (user_id, query_text, execution_time, row_count, success, error_message) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, queryText, executionTime, rowCount, success, errorMessage]
    );
  } catch (err) {
    console.error('Failed to log query:', err);
  }
}

// Execute SQL query
app.post('/api/query', async (req, res) => {
  const { query } = req.body;
  const userId = req.user?.id || null;

  if (!query) {
    return res.status(400).json({ error: '쿼리가 필요합니다.' });
  }

  // Security: Only allow SELECT, DESC, SHOW queries
  const trimmedQuery = query.trim().toUpperCase();
  const allowedStarts = ['SELECT', 'WITH', 'DESC', 'DESCRIBE', 'SHOW', 'EXPLAIN'];
  const isAllowed = allowedStarts.some(cmd => trimmedQuery.startsWith(cmd));

  if (!isAllowed) {
    return res.status(403).json({
      success: false,
      error: '보안상 SELECT, DESC, SHOW 쿼리만 실행 가능합니다. INSERT, UPDATE, DELETE, DROP 등은 사용할 수 없습니다.'
    });
  }

  // Block access to system tables and databases
  const blockedSchemas = ['INFORMATION_SCHEMA', 'MYSQL', 'PERFORMANCE_SCHEMA', 'SYS'];
  for (const schema of blockedSchemas) {
    if (trimmedQuery.includes(schema)) {
      return res.status(403).json({
        success: false,
        error: `보안상 시스템 테이블 (${schema})에 접근할 수 없습니다. stores 테이블만 사용하세요.`
      });
    }
  }

  // Block dangerous keywords (except in allowed contexts)
  const dangerousKeywords = ['DROP TABLE', 'DROP DATABASE', 'DELETE FROM', 'TRUNCATE', 'INSERT INTO', 'UPDATE ', 'ALTER TABLE', 'CREATE TABLE'];
  for (const keyword of dangerousKeywords) {
    if (trimmedQuery.includes(keyword)) {
      return res.status(403).json({
        success: false,
        error: `보안상 ${keyword} 명령어는 사용할 수 없습니다.`
      });
    }
  }

  // Only allow queries on stores table
  if (!trimmedQuery.includes('STORES') &&
      !trimmedQuery.startsWith('DESC') &&
      !trimmedQuery.startsWith('DESCRIBE') &&
      !trimmedQuery.startsWith('SHOW COLUMNS')) {
    return res.status(403).json({
      success: false,
      error: 'stores 테이블만 조회할 수 있습니다.'
    });
  }

  const startTime = Date.now();

  try {
    // Translate Korean column names to col1, col2, etc.
    let translatedQuery = translateQuery(query);

    // Auto-add LIMIT 100 if no LIMIT specified (safety measure)
    if (!trimmedQuery.includes('LIMIT')) {
      translatedQuery = translatedQuery.trim();
      if (translatedQuery.endsWith(';')) {
        translatedQuery = translatedQuery.slice(0, -1) + ' LIMIT 100;';
      } else {
        translatedQuery += ' LIMIT 100';
      }
    }

    const [rows] = await pool.query(translatedQuery);
    const executionTime = Date.now() - startTime;

    // Translate results back to Korean
    const translatedRows = translateResults(rows);

    // Log successful query
    await logQuery(userId, query, executionTime, translatedRows.length, true);

    res.json({
      success: true,
      data: translatedRows,
      rowCount: translatedRows.length,
      executionTime
    });
  } catch (error) {
    const executionTime = Date.now() - startTime;

    // Log failed query
    await logQuery(userId, query, executionTime, 0, false, error.message);

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get table schema
app.get('/api/schema', async (req, res) => {
  try {
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'naver_financial'
        AND TABLE_NAME = 'stores'
      ORDER BY ORDINAL_POSITION
    `);

    const schema = columns.map(col => ({
      name: REVERSE_MAP[col.COLUMN_NAME] || col.COLUMN_NAME,
      type: col.DATA_TYPE.toUpperCase()
    }));

    const [countResult] = await pool.query('SELECT COUNT(*) as count FROM stores');

    res.json({
      tableName: 'stores',
      columns: schema,
      rowCount: countResult[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sample data
app.get('/api/sample/:column', async (req, res) => {
  try {
    const koreanColumn = req.params.column;
    const dbColumn = COLUMN_MAP[koreanColumn] || koreanColumn;

    const [rows] = await pool.query(`
      SELECT DISTINCT ${dbColumn}
      FROM stores
      WHERE ${dbColumn} IS NOT NULL
      LIMIT 5
    `);

    res.json(rows.map(r => r[dbColumn]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's query history
app.get('/api/logs', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    const limit = parseInt(req.query.limit) || 50;
    const [logs] = await pool.query(
      `SELECT id, query_text, execution_time, row_count, success, error_message, created_at
       FROM query_logs
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [req.user.id, limit]
    );

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get query statistics
app.get('/api/stats', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    const [stats] = await pool.query(
      `SELECT
        COUNT(*) as total_queries,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_queries,
        AVG(execution_time) as avg_execution_time,
        SUM(row_count) as total_rows_returned
       FROM query_logs
       WHERE user_id = ?`,
      [req.user.id]
    );

    res.json({ stats: stats[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
