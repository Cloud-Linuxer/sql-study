import { useState, useEffect, useCallback } from 'react';
import { loadCSV, analyzeColumnTypes, escapeIdentifier, escapeValue } from '../utils/csvLoader';

export default function useDatabase() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    async function initDatabase() {
      try {
        setLoading(true);
        setError(null);

        // Dynamic import sql.js to avoid module resolution issues
        const sqlModule = await import('sql.js');
        // sql.js exports as both module.exports and module.exports.default
        const initSqlJs = sqlModule.default || sqlModule;

        // Initialize sql.js
        const SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });

        const database = new SQL.Database();

        // Load CSV data
        console.log('Loading CSV data...');
        const data = await loadCSV('/data/store_data.csv');
        console.log(`Loaded ${data.length} rows`);

        if (data.length === 0) {
          throw new Error('CSV 파일에 데이터가 없습니다.');
        }

        // Analyze column types
        const columnTypes = analyzeColumnTypes(data);
        const columns = Object.keys(data[0]);

        // Create table
        const createTableSQL = `
          CREATE TABLE stores (
            ${columns.map(col => `${escapeIdentifier(col)} ${columnTypes[col] || 'TEXT'}`).join(',\n            ')}
          );
        `;

        console.log('Creating table...');
        database.run(createTableSQL);

        // Insert data in batches
        const batchSize = 1000;
        const totalBatches = Math.ceil(data.length / batchSize);

        console.log(`Inserting data in ${totalBatches} batches...`);

        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          const batchNum = Math.floor(i / batchSize) + 1;

          const insertSQL = `
            INSERT INTO stores (${columns.map(escapeIdentifier).join(', ')})
            VALUES ${batch.map(row =>
              `(${columns.map(col => escapeValue(row[col])).join(', ')})`
            ).join(',\n            ')};
          `;

          database.run(insertSQL);

          if (batchNum % 10 === 0) {
            console.log(`Batch ${batchNum}/${totalBatches} completed`);
          }
        }

        // Create indexes for common columns
        console.log('Creating indexes...');
        const indexColumns = ['시도명', '시군구명', '상권업종대분류명', '상권업종중분류명'];

        indexColumns.forEach(col => {
          try {
            database.run(`CREATE INDEX IF NOT EXISTS idx_${col.replace(/[^\w]/g, '_')} ON stores(${escapeIdentifier(col)})`);
          } catch (err) {
            console.warn(`Failed to create index on ${col}:`, err.message);
          }
        });

        // Get schema information
        const schemaResult = database.exec(`
          SELECT name, type FROM pragma_table_info('stores')
        `);

        const schemaInfo = {
          tableName: 'stores',
          columns: schemaResult[0]?.values.map(row => ({
            name: row[0],
            type: row[1]
          })) || [],
          rowCount: data.length
        };

        setSchema(schemaInfo);
        setDb(database);
        setLoading(false);

        console.log('Database initialized successfully!');
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    initDatabase();
  }, []);

  const executeQuery = useCallback(async (query) => {
    if (!db) {
      throw new Error('데이터베이스가 초기화되지 않았습니다.');
    }

    const startTime = performance.now();

    try {
      const results = db.exec(query);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      if (results.length === 0) {
        return {
          columns: [],
          rows: [],
          rowCount: 0,
          executionTime
        };
      }

      const result = results[0];

      return {
        columns: result.columns,
        rows: result.values.map(row => {
          const obj = {};
          result.columns.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          return obj;
        }),
        rowCount: result.values.length,
        executionTime
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }, [db]);

  const getTableInfo = useCallback(() => {
    if (!db) return null;

    try {
      const result = db.exec(`
        SELECT
          name,
          type
        FROM pragma_table_info('stores')
        ORDER BY cid
      `);

      if (result.length === 0) return null;

      return result[0].values.map(row => ({
        name: row[0],
        type: row[1]
      }));
    } catch (err) {
      console.error('Failed to get table info:', err);
      return null;
    }
  }, [db]);

  const getSampleData = useCallback((columnName, limit = 5) => {
    if (!db) return [];

    try {
      const result = db.exec(`
        SELECT DISTINCT ${escapeIdentifier(columnName)}
        FROM stores
        WHERE ${escapeIdentifier(columnName)} IS NOT NULL
        LIMIT ${limit}
      `);

      if (result.length === 0) return [];

      return result[0].values.map(row => row[0]);
    } catch (err) {
      console.error('Failed to get sample data:', err);
      return [];
    }
  }, [db]);

  return {
    db,
    loading,
    error,
    schema,
    executeQuery,
    getTableInfo,
    getSampleData
  };
}
