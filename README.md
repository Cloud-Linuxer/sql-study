# 라니를 위한 쿼리테스트 플랫폼

네이버파이낸셜 데이터 분석가 포지션의 쿼리 테스트를 준비하기 위한 인터랙티브 SQL 학습 웹 애플리케이션입니다.

## 기능

### 📊 핵심 기능
- **브라우저 SQL 실행**: sql.js를 활용한 완전한 클라이언트 사이드 SQLite 데이터베이스
- **Monaco Editor**: VS Code 기반의 강력한 SQL 에디터 (문법 하이라이팅, 자동완성)
- **실시간 결과**: 쿼리 실행 결과를 즉시 테이블 형태로 표시
- **예제 쿼리 라이브러리**: 6단계 난이도의 실무 중심 예제 쿼리 (12개)
- **쿼리 히스토리**: 실행한 쿼리 자동 저장 (LocalStorage)
- **스키마 뷰어**: 테이블 구조 및 샘플 데이터 표시
- **다크모드**: 개발자 친화적 UI 테마

### 📚 예제 쿼리 카테고리
1. **Level 1: 기본 집계** - COUNT, GROUP BY, ORDER BY
2. **Level 2: 상권 분석** - DISTINCT, 서브쿼리
3. **Level 3: 사업자 인사이트** - LIKE, HAVING
4. **Level 4: 고객 타겟팅** - 복합 WHERE 조건, IN
5. **Level 5: 윈도우 함수** - ROW_NUMBER, PARTITION BY
6. **Level 6: 고급 분석** - CTE (WITH), 다중 조인

## 데이터

- **출처**: 소상공인시장진흥공단 상가(상권)정보 (공공데이터포털)
- **지역**: 서울특별시
- **데이터 크기**: 536,115건
- **컬럼**: 39개 (상호명, 업종, 주소, 좌표 등)

## 기술 스택

### Frontend
- React 18
- Vite (빌드 도구)
- Tailwind CSS (스타일링)

### 데이터베이스
- sql.js (WebAssembly SQLite)
- PapaParse (CSV 파싱)

### 에디터
- Monaco Editor (VS Code 엔진)
- @monaco-editor/react

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 프로덕션 빌드
```bash
npm run build
npm run preview
```

## 사용법

### 1. 데이터베이스 초기화
- 앱 실행 시 자동으로 CSV 데이터를 로드하고 SQLite 데이터베이스를 초기화합니다
- 약 20-30초 소요 (536,115 rows)

### 2. 쿼리 작성 및 실행
- 중앙 패널의 SQL Editor에 쿼리 작성
- `Ctrl+Enter` 또는 '실행' 버튼 클릭
- 결과가 하단 테이블에 표시됩니다

### 3. 예제 쿼리 활용
- 왼쪽 패널의 '예제 쿼리'에서 레벨별 쿼리 선택
- 클릭하면 에디터에 자동으로 로드됩니다
- 예제를 참고하여 자신만의 쿼리 작성 연습

### 4. 쿼리 히스토리
- 실행한 모든 쿼리가 오른쪽 패널에 자동 저장
- 히스토리 클릭으로 쿼리 재실행
- LocalStorage에 저장되어 브라우저를 닫아도 유지

### 5. 결과 다운로드
- 쿼리 결과를 CSV 파일로 다운로드 가능
- 추가 분석이나 보고서 작성에 활용

## 학습 가이드

### 네이버파이낸셜 맥락 쿼리 패턴

1. **사업자 리포트 기획**
   - 업종별/지역별 집계 분석
   - 시계열 트렌드 분석
   - 세그먼트별 특성 파악

2. **고객 타겟 마케팅**
   - 특정 조건 사업자 추출
   - 상권 특성 기반 타겟팅
   - 프랜차이즈 vs 개인 사업자 구분

3. **데이터 기반 의사결정**
   - 시장 기회 분석
   - 경쟁 밀집도 파악
   - 진입 가능 상권 탐색

### 쿼리 작성 팁

1. **명확한 컬럼명**: `AS`로 결과 컬럼 의미 명시
2. **주석 활용**: 복잡한 로직은 `--` 주석 추가
3. **단계적 접근**: 간단한 쿼리부터 시작해 점진적으로 확장
4. **성능 고려**: LIMIT으로 결과 제한, 인덱스 활용
5. **NULL 처리**: `IS NULL`, `COALESCE` 활용

## 프로젝트 구조

```
sql/
├── public/
│   └── data/
│       └── store_data.csv          # 상가정보 CSV (279MB)
├── src/
│   ├── components/
│   │   ├── Header.jsx              # 앱 헤더
│   │   ├── SQLEditor.jsx           # Monaco 에디터
│   │   ├── ResultTable.jsx         # 결과 테이블
│   │   ├── SchemaViewer.jsx        # 스키마 뷰어
│   │   ├── ExampleQueries.jsx      # 예제 쿼리 목록
│   │   └── QueryHistory.jsx        # 쿼리 히스토리
│   ├── hooks/
│   │   ├── useDatabase.js          # DB 초기화 및 쿼리 실행
│   │   └── useQueryHistory.js      # 히스토리 관리
│   ├── utils/
│   │   ├── csvLoader.js            # CSV 로딩 및 파싱
│   │   └── sqlHelpers.js           # SQL 유틸리티
│   ├── data/
│   │   └── exampleQueries.js       # 예제 쿼리 데이터
│   ├── App.jsx                     # 메인 앱
│   ├── main.jsx                    # 엔트리 포인트
│   └── index.css                   # 글로벌 스타일
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 주요 쿼리 예제

### 기본 집계
```sql
SELECT
  "상권업종대분류명",
  COUNT(*) as 상가수
FROM stores
GROUP BY "상권업종대분류명"
ORDER BY 상가수 DESC
LIMIT 10;
```

### 윈도우 함수
```sql
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
SELECT * FROM RankedIndustries WHERE 순위 <= 3;
```

## 면접 준비 전략

1. **기본 SQL 숙달**: SELECT, WHERE, GROUP BY, ORDER BY, JOIN
2. **집계 함수**: COUNT, SUM, AVG, MIN, MAX, COUNT(DISTINCT)
3. **윈도우 함수**: ROW_NUMBER, RANK, DENSE_RANK, PARTITION BY
4. **CTE 활용**: WITH 절을 사용한 복잡한 쿼리 구조화
5. **실무 시나리오**: 사업자 리포트, 타겟 마케팅 관점으로 접근

## 라이선스

MIT

## 문의

프로젝트 관련 문의사항은 GitHub Issues를 활용해주세요.
