# SQL 쿼리 학습 플랫폼

<p align="center">
  <img src="docs/screenshot-learning.png" alt="학습 모드" width="100%">
</p>

**인터랙티브 SQL 학습 웹 애플리케이션**입니다.

53만 건 이상의 실제 상가(상권) 데이터를 활용하여 실무와 유사한 환경에서 SQL 쿼리 작성 능력을 향상시킬 수 있습니다.

---

## 주요 특징

| 특징 | 설명 |
|------|------|
| **완전한 브라우저 실행** | 서버 없이 브라우저에서 모든 SQL 쿼리 실행 (sql.js WebAssembly) |
| **실제 데이터** | 소상공인시장진흥공단 상가정보 536,115건 |
| **단계별 학습** | 16개의 실무 중심 문제를 6단계 난이도로 제공 |
| **즉각적인 피드백** | 쿼리 실행 결과와 정답 비교를 통한 학습 |
| **VS Code 에디터** | Monaco Editor 기반의 강력한 SQL 편집 환경 |

---

## 스크린샷

### 학습 모드 (단계별 문제풀이)

<p align="center">
  <img src="docs/screenshot-learning.png" alt="학습 모드" width="100%">
</p>

- **왼쪽 패널**: 단계별 학습 진행률과 현재 문제
- **오른쪽 패널**: SQL Editor와 실행 결과
- **힌트 시스템**: 각 문제별 SQL 문법 힌트 제공
- **정답 확인**: 내 쿼리 결과와 정답 비교

### 연습 모드 (자유 쿼리)

<p align="center">
  <img src="docs/screenshot-practice.png" alt="연습 모드" width="100%">
</p>

- **스키마 뷰어**: 테이블 구조와 샘플 데이터 확인
- **예제 쿼리**: 6단계 난이도별 예제 쿼리 라이브러리
- **쿼리 히스토리**: 실행한 쿼리 자동 저장 (LocalStorage)

---

## 🚀 빠른 시작 가이드 (다른 사람을 위한 상세 설치 방법)

### 사전 요구사항

이 프로젝트를 실행하기 위해 필요한 것들:

| 요구사항 | 버전 | 확인 방법 |
|---------|------|----------|
| **Node.js** | 18.0.0 이상 | `node --version` |
| **npm** | 9.0.0 이상 | `npm --version` |
| **Git** | 최신 버전 | `git --version` |

#### Node.js 설치 (미설치 시)

**Windows:**
```powershell
# winget 사용
winget install OpenJS.NodeJS.LTS

# 또는 공식 사이트에서 다운로드
# https://nodejs.org/ko/download/
```

**macOS:**
```bash
# Homebrew 사용
brew install node

# 또는 공식 사이트에서 다운로드
# https://nodejs.org/ko/download/
```

**Linux (Ubuntu/Debian):**
```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

### 방법 1: 브라우저 DB 모드 (권장 - 가장 간단)

서버 없이 브라우저에서 모든 것이 실행됩니다. **PostgreSQL 설치 불필요!**

#### Step 1: 저장소 클론

```bash
git clone https://github.com/Cloud-Linuxer/sql-study.git
cd sql-study
```

#### Step 2: 의존성 설치

```bash
npm install
```

설치되는 주요 패키지:
- `react`, `react-dom` - UI 라이브러리
- `@monaco-editor/react` - SQL 에디터
- `sql.js` - 브라우저용 SQLite
- `papaparse` - CSV 파싱

#### Step 3: 데이터 파일 준비

**중요**: 대용량 데이터 파일은 GitHub에 포함되어 있지 않습니다.

```bash
# public/data 디렉토리 생성 (없는 경우)
mkdir -p public/data

# 데이터 다운로드 (공공데이터포털에서)
# https://www.data.go.kr/data/15083033/fileData.do
# 다운로드 후 public/data/store_data.csv로 저장
```

**또는 샘플 데이터로 테스트:**

```bash
# 샘플 데이터 생성 (테스트용)
cat > public/data/store_data.csv << 'EOF'
상가업소번호,상호명,지점명,상권업종대분류코드,상권업종대분류명,상권업종중분류코드,상권업종중분류명,상권업종소분류코드,상권업종소분류명,표준산업분류코드,표준산업분류명,시도코드,시도명,시군구코드,시군구명,행정동코드,행정동명,법정동코드,법정동명,지번코드,대지구분코드,대지구분명,지번본번지,지번부번지,지번주소,도로명코드,도로명,건물본번지,건물부번지,건물관리번호,건물명,도로명주소,구우편번호,신우편번호,동정보,층정보,호정보,경도,위도
MA0101202208003882516,스타벅스,강남역점,Q,음식,Q01,커피점/카페,Q01A01,커피전문점/카페/다방,I56220,커피 전문점,11,서울특별시,11680,강남구,1168053000,역삼1동,1168010100,역삼동,116801010,1,대지,736,5,서울특별시 강남구 역삼동 736-5,116804163203,테헤란로,142,,1168010100107360005000001,강남빌딩,서울특별시 강남구 테헤란로 142,135080,06236,1층,1층,,127.0366,37.5001
MA0101202208003882799,이디야커피,선릉역점,Q,음식,Q01,커피점/카페,Q01A01,커피전문점/카페/다방,I56220,커피 전문점,11,서울특별시,11680,강남구,1168054000,삼성1동,1168010600,삼성동,116801060,1,대지,159,3,서울특별시 강남구 삼성동 159-3,116804166019,선릉로,525,,1168010600101590003000001,선릉빌딩,서울특별시 강남구 선릉로 525,135090,06159,1층,1층,,127.0486,37.5047
EOF
```

#### Step 4: 개발 서버 실행

```bash
npm run dev
```

출력 예시:
```
  VITE v5.4.21  ready in 105 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

#### Step 5: 브라우저에서 접속

브라우저를 열고 `http://localhost:5173` 접속

**초기 로딩 시간**: 데이터 크기에 따라 5-30초 소요 (브라우저에서 SQLite DB 생성)

---

### 방법 2: PostgreSQL API 모드 (대용량 데이터용)

53만 건 전체 데이터를 빠르게 처리하려면 PostgreSQL 사용을 권장합니다.

#### Step 1: PostgreSQL 설치

**Windows:**
```powershell
# Chocolatey 사용
choco install postgresql

# 또는 공식 설치 프로그램
# https://www.postgresql.org/download/windows/
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Step 2: 데이터베이스 생성

```bash
# PostgreSQL 접속
sudo -u postgres psql

# 데이터베이스 및 사용자 생성
CREATE DATABASE sql_study;
CREATE USER sql_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sql_study TO sql_user;
\q
```

#### Step 3: 저장소 클론 및 설정

```bash
git clone https://github.com/Cloud-Linuxer/sql-study.git
cd sql-study

# 서버 환경 설정
cd server
cp .env.example .env
```

#### Step 4: 환경 변수 설정

`server/.env` 파일 편집:

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sql_study
DB_USER=sql_user
DB_PASSWORD=your_password

# 서버 설정
PORT=3001

# Google OAuth (선택사항 - 인증 기능 사용 시)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=random_session_secret_string
```

#### Step 5: 데이터 임포트

```bash
# CSV 데이터를 PostgreSQL로 임포트
psql -U sql_user -d sql_study -c "
CREATE TABLE stores (
    상가업소번호 VARCHAR(50) PRIMARY KEY,
    상호명 VARCHAR(200),
    지점명 VARCHAR(100),
    상권업종대분류코드 VARCHAR(10),
    상권업종대분류명 VARCHAR(50),
    상권업종중분류코드 VARCHAR(10),
    상권업종중분류명 VARCHAR(50),
    상권업종소분류코드 VARCHAR(10),
    상권업종소분류명 VARCHAR(100),
    시도명 VARCHAR(20),
    시군구명 VARCHAR(20),
    행정동명 VARCHAR(50),
    법정동명 VARCHAR(50),
    도로명주소 VARCHAR(200),
    경도 DECIMAL(10, 6),
    위도 DECIMAL(10, 6)
);
"

# CSV 임포트 (COPY 명령 사용)
psql -U sql_user -d sql_study -c "\COPY stores FROM 'public/data/store_data.csv' WITH CSV HEADER"
```

#### Step 6: 서버 실행

```bash
# 터미널 1: 백엔드 서버
cd server
npm install
npm start

# 터미널 2: 프론트엔드
cd ..
npm install
npm run dev
```

#### Step 7: 접속

- 프론트엔드: `http://localhost:5173`
- API 서버: `http://localhost:3001`

---

### 방법 3: Docker Compose로 실행 (권장 - 가장 편리)

Docker가 설치되어 있다면 한 번에 모든 환경(MySQL + API + Frontend)을 구성할 수 있습니다.

#### Step 1: Docker 설치 확인

```bash
docker --version        # Docker 20.10 이상
docker-compose --version # Docker Compose 2.0 이상
```

**Docker 미설치 시:**
- Windows/macOS: [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치
- Linux: `curl -fsSL https://get.docker.com | sh`

#### Step 2: 저장소 클론

```bash
git clone https://github.com/Cloud-Linuxer/sql-study.git
cd sql-study
```

#### Step 3: Docker Compose 실행

```bash
# 전체 서비스 빌드 및 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

#### Step 4: 접속

- **프론트엔드**: http://localhost:5173
- **API 서버**: http://localhost:3001
- **MySQL**: localhost:3306 (user: root, password: practice123)

#### Step 5: 대용량 데이터 임포트 (선택)

기본으로 15건의 샘플 데이터가 포함되어 있습니다. 53만 건 전체 데이터를 사용하려면:

```bash
# 1. 공공데이터포털에서 CSV 다운로드
# https://www.data.go.kr/data/15083033/fileData.do

# 2. 데이터 임포트 스크립트 실행
docker exec -it sql-study-db mysql -uroot -ppractice123 naver_financial

# MySQL 프롬프트에서:
mysql> LOAD DATA LOCAL INFILE '/path/to/store_data.csv'
       INTO TABLE stores
       CHARACTER SET utf8mb4
       FIELDS TERMINATED BY ','
       OPTIONALLY ENCLOSED BY '"'
       LINES TERMINATED BY '\n'
       IGNORE 1 ROWS;
```

#### Docker 명령어 모음

```bash
# 서비스 시작
docker-compose up -d

# 서비스 중지
docker-compose down

# 서비스 재시작
docker-compose restart

# 로그 확인
docker-compose logs -f [service_name]

# 데이터 포함 완전 삭제
docker-compose down -v

# 컨테이너 접속
docker exec -it sql-study-db bash      # MySQL 컨테이너
docker exec -it sql-study-api sh       # API 컨테이너
docker exec -it sql-study-frontend sh  # Frontend 컨테이너
```

#### docker-compose.yml 구조

```yaml
services:
  db:        # MySQL 8.0 데이터베이스
  api:       # Express.js API 서버
  frontend:  # React + Vite 프론트엔드
```

---

### 배포 방법

#### Vercel 배포 (프론트엔드 - 브라우저 DB 모드)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 환경 변수 설정 (Vercel 대시보드에서)
# - 없음 (브라우저 DB 모드는 환경 변수 불필요)
```

#### Netlify 배포

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 빌드
npm run build

# 배포
netlify deploy --prod --dir=dist
```

#### 자체 서버 배포 (Nginx + PM2)

```bash
# 빌드
npm run build

# Nginx 설정 (/etc/nginx/sites-available/sql-study)
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/sql-study/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API 서버 (PM2로 실행)
cd server
pm2 start server.js --name sql-study-api
pm2 save
```

---

## 문제 해결 (Troubleshooting)

### 자주 발생하는 문제

#### 1. `npm install` 실패

```bash
# Node.js 버전 확인
node --version  # 18.0.0 이상이어야 함

# npm 캐시 정리 후 재시도
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. 데이터 로딩 실패

```bash
# CSV 파일 존재 확인
ls -la public/data/

# 파일 인코딩 확인 (UTF-8이어야 함)
file public/data/store_data.csv
```

#### 3. 브라우저에서 느린 로딩

- 대용량 CSV 파일 사용 시 브라우저 DB 모드는 초기 로딩이 오래 걸림
- **해결**: PostgreSQL API 모드 사용 권장

#### 4. Monaco Editor 로딩 안됨

```bash
# Monaco Editor 재설치
npm uninstall @monaco-editor/react monaco-editor
npm install @monaco-editor/react monaco-editor
```

#### 5. CORS 에러 (API 모드)

```javascript
// server/server.js에서 CORS 설정 확인
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 커스터마이징 가이드

### 자신만의 데이터 사용하기

1. **CSV 파일 준비**
   - UTF-8 인코딩
   - 첫 번째 행은 컬럼명
   - `public/data/your_data.csv`로 저장

2. **훅 수정** (`src/hooks/useDatabaseAPI.js`)
   ```javascript
   const CSV_PATH = '/data/your_data.csv';
   const TABLE_NAME = 'your_table';
   ```

3. **예제 쿼리 수정** (`src/data/exampleQueries.js`)
   - 테이블명과 컬럼명을 자신의 데이터에 맞게 수정

4. **퀴즈 문제 수정** (`src/data/quizProblems.js`)
   - 새로운 문제와 정답 쿼리 추가

### 새로운 학습 레벨 추가

`src/data/quizProblems.js`:

```javascript
export const quizProblems = [
  // 기존 레벨들...

  // 새 레벨 추가
  {
    level: 7,
    title: "고급 JOIN",
    problems: [
      {
        id: "7-1",
        title: "다중 테이블 조인",
        description: "여러 테이블을 조인하여 데이터를 결합하세요.",
        difficulty: "hard",
        hint: "LEFT JOIN과 INNER JOIN의 차이를 이해하세요.",
        answerQuery: "SELECT ... FROM ... JOIN ..."
      }
    ]
  }
];
```

---

## 학습 커리큘럼

### Level 1: SQL 기초 (3문제)
| 문제 | 학습 내용 |
|------|----------|
| 데이터 조회 | `SELECT`, `FROM`, `LIMIT` |
| 업종별 Top 10 | `GROUP BY`, `COUNT(*)`, `ORDER BY` |
| 특정 지역 필터링 | `WHERE`, 조건절 |

### Level 2: 집계 함수 (4문제)
| 문제 | 학습 내용 |
|------|----------|
| 구별 상가 수 | `GROUP BY`, `COUNT`, 지역 분석 |
| 업종 다양성 | `COUNT(DISTINCT)` |
| 다중 조건 필터링 | `AND`, `OR` 조건 조합 |
| 정렬 응용 | 다중 컬럼 정렬 |

### Level 3: 고급 필터링 (4문제)
| 문제 | 학습 내용 |
|------|----------|
| 패턴 검색 | `LIKE`, 와일드카드 (`%`, `_`) |
| 범위 필터링 | `BETWEEN`, `IN` |
| 집계 조건 | `HAVING` |
| NULL 처리 | `IS NULL`, `COALESCE` |

### Level 4: 분석 함수 (3문제)
| 문제 | 학습 내용 |
|------|----------|
| 순위 함수 | `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()` |
| 파티션 분석 | `PARTITION BY` |
| 윈도우 집계 | `SUM() OVER()`, `AVG() OVER()` |

### Level 5: 서브쿼리 (2문제)
| 문제 | 학습 내용 |
|------|----------|
| 스칼라 서브쿼리 | `SELECT` 절 서브쿼리 |
| 인라인 뷰 | `FROM` 절 서브쿼리 |

### Level 6: CTE & 고급 (추가 예정)
| 문제 | 학습 내용 |
|------|----------|
| CTE 활용 | `WITH` 절, 재귀 CTE |
| 복합 분석 | 다중 CTE 조합 |

---

## 데이터 소개

### 출처
- **제공**: 소상공인시장진흥공단
- **데이터셋**: 상가(상권)정보
- **출처**: [공공데이터포털](https://www.data.go.kr/data/15083033/fileData.do)

### 데이터 규모
| 항목 | 값 |
|------|-----|
| 총 레코드 수 | 536,115건 |
| 컬럼 수 | 40개 |
| 지역 | 서울특별시 전체 |
| 데이터 기준 | 2024년 |

### 주요 컬럼
```
상호명          - 상가 이름
상권업종대분류명  - 대분류 업종 (음식, 소매, 서비스 등)
상권업종중분류명  - 중분류 업종
상권업종소분류명  - 소분류 업종
시도명          - 시/도
시군구명        - 시/군/구
행정동명        - 행정동
법정동명        - 법정동
도로명주소      - 도로명 주소
경도           - GPS 경도 좌표
위도           - GPS 위도 좌표
```

---

## 기술 스택

### Frontend
| 기술 | 용도 |
|------|------|
| React 18 | UI 라이브러리 |
| Vite | 빌드 도구 |
| Tailwind CSS | 스타일링 |
| Monaco Editor | SQL 에디터 |

### Backend (API 모드)
| 기술 | 용도 |
|------|------|
| Express.js | API 서버 |
| PostgreSQL | 데이터베이스 |
| Google OAuth | 인증 |

### 브라우저 DB 모드
| 기술 | 용도 |
|------|------|
| sql.js | WebAssembly SQLite |
| PapaParse | CSV 파싱 |

---

## 사용 방법

### 1. 학습 모드

1. **문제 선택**: 왼쪽 패널에서 레벨과 문제 선택
2. **힌트 확인**: "SQL 문법 힌트" 섹션 참고
3. **쿼리 작성**: SQL Editor에서 쿼리 작성
4. **실행**: `Ctrl+Enter` 또는 "실행" 버튼 클릭
5. **정답 확인**: "정답 확인하기" 버튼으로 결과 비교

### 2. 연습 모드

1. **스키마 확인**: 왼쪽 상단의 스키마 뷰어에서 테이블 구조 확인
2. **예제 선택**: 레벨별 예제 쿼리 클릭하여 에디터에 로드
3. **자유 쿼리**: 원하는 SQL 쿼리 작성 및 실행
4. **히스토리 활용**: 오른쪽 패널에서 이전 쿼리 재실행

### 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl + Enter` | 쿼리 실행 |
| `Ctrl + /` | 주석 토글 |
| `Ctrl + Space` | 자동완성 |

---

## 예제 쿼리

### 기본 집계
```sql
-- 업종별 상가 수 Top 10
SELECT
  "상권업종대분류명",
  COUNT(*) as 상가수
FROM stores
GROUP BY "상권업종대분류명"
ORDER BY 상가수 DESC
LIMIT 10;
```

### 지역 분석
```sql
-- 강남구 음식점 현황
SELECT
  "상권업종중분류명",
  COUNT(*) as 상가수
FROM stores
WHERE "시군구명" = '강남구'
  AND "상권업종대분류명" = '음식'
GROUP BY "상권업종중분류명"
ORDER BY 상가수 DESC;
```

### 윈도우 함수
```sql
-- 구별 업종 순위
WITH RankedIndustries AS (
  SELECT
    "시군구명",
    "상권업종대분류명",
    COUNT(*) as 상가수,
    ROW_NUMBER() OVER (
      PARTITION BY "시군구명"
      ORDER BY COUNT(*) DESC
    ) as 순위
  FROM stores
  GROUP BY "시군구명", "상권업종대분류명"
)
SELECT * FROM RankedIndustries
WHERE 순위 <= 3
ORDER BY "시군구명", 순위;
```

### CTE 활용
```sql
-- 평균 이상 상가 보유 구
WITH district_stats AS (
  SELECT
    "시군구명",
    COUNT(*) as 상가수
  FROM stores
  GROUP BY "시군구명"
),
avg_stats AS (
  SELECT AVG(상가수) as 평균
  FROM district_stats
)
SELECT
  d."시군구명",
  d.상가수,
  ROUND(d.상가수 - a.평균, 0) as 평균대비
FROM district_stats d, avg_stats a
WHERE d.상가수 > a.평균
ORDER BY d.상가수 DESC;
```

---

## SQL 역량 체크리스트

- [ ] `SELECT`, `WHERE`, `GROUP BY`, `ORDER BY` 기본 문법
- [ ] `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` 집계 함수
- [ ] `JOIN` (INNER, LEFT, RIGHT)
- [ ] `ROW_NUMBER`, `RANK`, `DENSE_RANK` 윈도우 함수
- [ ] `PARTITION BY` 파티션 분석
- [ ] `WITH` CTE 활용
- [ ] 서브쿼리 (스칼라, 인라인 뷰, 상관)

---

## 프로젝트 구조

```
sql-study/
├── docs/                          # 문서 및 스크린샷
│   ├── screenshot-learning.png    # 학습 모드 스크린샷
│   └── screenshot-practice.png    # 연습 모드 스크린샷
├── public/
│   └── data/
│       └── store_data.csv         # 상가정보 CSV (별도 다운로드 필요)
├── server/                        # API 서버 (PostgreSQL 모드)
│   ├── server.js                  # Express 서버
│   ├── package.json               # 서버 의존성
│   └── .env.example               # 환경 변수 템플릿
├── src/
│   ├── components/
│   │   ├── Header.jsx             # 앱 헤더
│   │   ├── SQLEditor.jsx          # Monaco 에디터
│   │   ├── ResultTable.jsx        # 결과 테이블
│   │   ├── SchemaViewer.jsx       # 스키마 뷰어 (브라우저 DB)
│   │   ├── SchemaViewerAPI.jsx    # 스키마 뷰어 (API)
│   │   ├── ExampleQueries.jsx     # 예제 쿼리 목록
│   │   ├── QueryHistory.jsx       # 쿼리 히스토리
│   │   ├── QuizMode.jsx           # 학습 모드 컴포넌트
│   │   ├── QuickReference.jsx     # SQL 빠른 참조
│   │   └── TutorialContent.jsx    # 튜토리얼 컨텐츠
│   ├── hooks/
│   │   ├── useDatabase.js         # 브라우저 DB 훅
│   │   ├── useDatabaseAPI.js      # API DB 훅
│   │   └── useQueryHistory.js     # 히스토리 관리
│   ├── data/
│   │   ├── exampleQueries.js      # 예제 쿼리 데이터
│   │   └── quizProblems.js        # 학습 문제 데이터
│   ├── utils/
│   │   ├── csvLoader.js           # CSV 로딩
│   │   ├── sqlHelpers.js          # SQL 유틸리티
│   │   └── quizValidator.js       # 정답 검증
│   ├── App.jsx                    # 메인 앱
│   ├── main.jsx                   # 엔트리 포인트
│   └── index.css                  # 글로벌 스타일
├── backup/                        # DB 백업 스크립트
├── package.json                   # 프론트엔드 의존성
├── vite.config.js                 # Vite 설정
├── tailwind.config.js             # Tailwind 설정
├── CLAUDE.md                      # 프로젝트 설계 문서
└── README.md                      # 이 문서
```

---

## 개발 로드맵

- [x] 기본 SQL 에디터 및 실행 환경
- [x] 브라우저 기반 SQLite (sql.js)
- [x] 학습 모드 (단계별 문제풀이)
- [x] 연습 모드 (자유 쿼리)
- [x] 예제 쿼리 라이브러리
- [x] 쿼리 히스토리
- [x] 다크 모드
- [x] MySQL API 모드
- [x] Docker Compose 지원
- [ ] 추가 학습 문제 (Level 6)
- [ ] 쿼리 결과 시각화 (차트)
- [ ] 쿼리 공유 기능
- [ ] 모바일 반응형 개선

---

## 라이선스

MIT License

---

## 기여

버그 리포트, 기능 제안, PR 모두 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 문의

프로젝트 관련 문의사항은 [GitHub Issues](https://github.com/Cloud-Linuxer/sql-study/issues)를 활용해주세요.
