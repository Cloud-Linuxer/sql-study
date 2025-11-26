# 네이버파이낸셜 쿼리 테스트 준비 플랫폼

## 프로젝트 개요

### 목적
네이버파이낸셜 데이터 분석가 포지션의 쿼리 테스트를 준비하기 위한 인터랙티브 SQL 학습 웹 애플리케이션

### 대상 포지션 요구사항
- **주요 업무**: 데이터 & AI 활용 사업자 리포트 기획, 고객 타겟 마케팅 플랫폼 기획
- **핵심 역량**: 데이터 쿼리 작성 및 분석 능력, 데이터 기반 의사결정
- **우대 경험**: B2B 서비스, 마이데이터, 상권분석

### 데이터 소스
- **출처**: 소상공인시장진흥공단 상가(상권)정보 (공공데이터포털)
- **형식**: CSV
- **URL**: https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=FILE_000000003199920&fileDetailSn=1

---

## 기술 스택

### Frontend
- **React 18**: 현대적 UI 라이브러리
- **Vite**: 빠른 개발 환경 및 빌드 도구
- **Tailwind CSS**: 유틸리티 기반 스타일링

### 데이터베이스
- **sql.js**: 브라우저에서 실행되는 SQLite (WebAssembly)
- **PapaParse**: CSV 파싱 라이브러리

### 코드 에디터
- **Monaco Editor**: VS Code 기반 SQL 에디터 (문법 하이라이팅, 자동완성)
- **@monaco-editor/react**: React 통합 래퍼

### 상태 관리
- React Hooks (useState, useEffect, useCallback, useMemo)
- LocalStorage: 쿼리 히스토리 영속성

---

## 아키텍처 설계

### 프로젝트 구조
```
sql-query-practice/
├── public/
│   └── data/
│       └── store_data.csv          # 상가(상권) 정보 CSV
├── src/
│   ├── components/
│   │   ├── SQLEditor.jsx           # Monaco 기반 SQL 에디터
│   │   ├── ResultTable.jsx         # 쿼리 결과 테이블 표시
│   │   ├── ExampleQueries.jsx      # 실무 예제 쿼리 모음
│   │   ├── SchemaViewer.jsx        # 데이터베이스 스키마 뷰어
│   │   ├── QueryHistory.jsx        # 실행 히스토리
│   │   └── Header.jsx              # 앱 헤더
│   ├── hooks/
│   │   ├── useDatabase.js          # sql.js DB 초기화 및 쿼리 실행
│   │   └── useQueryHistory.js      # 쿼리 히스토리 관리
│   ├── data/
│   │   └── exampleQueries.js       # 네이버파이낸셜 맥락 예제 쿼리
│   ├── utils/
│   │   ├── csvLoader.js            # CSV 로드 및 파싱
│   │   └── sqlHelpers.js           # SQL 유틸리티 함수
│   ├── App.jsx                     # 메인 앱 컴포넌트
│   ├── main.jsx                    # 앱 엔트리 포인트
│   └── index.css                   # 글로벌 스타일
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### 컴포넌트 다이어그램
```
App
├── Header
├── Layout (3-column)
│   ├── Left Panel
│   │   ├── SchemaViewer
│   │   └── ExampleQueries
│   ├── Center Panel
│   │   └── SQLEditor
│   └── Right Panel
│       ├── ResultTable
│       └── QueryHistory
```

---

## 핵심 기능

### 1. 데이터베이스 초기화
- CSV 자동 로드 및 파싱
- SQLite 인메모리 DB 생성
- 컬럼 타입 자동 감지 (TEXT, INTEGER, REAL)
- 인덱스 자동 생성 (성능 최적화)

### 2. SQL 에디터
- Monaco Editor 통합
- SQL 문법 하이라이팅
- 자동완성 (테이블명, 컬럼명)
- 단축키: `Ctrl+Enter` (쿼리 실행)
- 다크모드/라이트모드 지원

### 3. 쿼리 실행 및 결과
- 실시간 쿼리 실행
- 결과 테이블 표시 (페이지네이션)
- 실행 시간 측정
- 반환 행 수 표시
- 에러 메시지 친화적 표시
- CSV 다운로드 기능

### 4. 예제 쿼리 라이브러리
네이버파이낸셜 면접 맥락에 맞춘 6가지 카테고리:

#### Level 1: 기본 집계
- 업종별 매장 수 집계
- 지역별 상가 분포
- 평균 임대료 계산

#### Level 2: 상권 분석
- 특정 상권의 업종 다양성 분석
- 상권별 매장 밀집도
- 지역별 평균 면적 비교

#### Level 3: 사업자 인사이트
- 월세/보증금 패턴 분석
- 면적당 임대료 계산
- 업종별 평균 매장 규모

#### Level 4: 고객 타겟팅
- 특정 조건 사업자 추출 (위치, 업종, 규모)
- 임대료 범위별 사업자 세그먼트
- 신규 진입 가능 상권 분석

#### Level 5: 비즈니스 리포팅
- 윈도우 함수 (ROW_NUMBER, RANK, DENSE_RANK)
- 서브쿼리 활용
- 다중 테이블 JOIN (필요시)

#### Level 6: 고급 분석
- CTE (Common Table Expression)
- 통계 함수 (PERCENTILE, STDDEV)
- 복잡한 GROUP BY + HAVING

### 5. 스키마 뷰어
- 테이블 구조 표시
- 컬럼명, 타입, 샘플 데이터
- 데이터 통계 (총 행 수, NULL 비율)

### 6. 쿼리 히스토리
- 실행한 쿼리 자동 저장 (LocalStorage)
- 히스토리 클릭으로 재실행
- 즐겨찾기 기능
- 히스토리 삭제

---

## 데이터 처리 플로우

### 초기화 단계
```
1. App 마운트
2. CSV 파일 fetch (/public/data/store_data.csv)
3. PapaParse로 CSV → JSON 변환
4. sql.js 초기화 (WebAssembly 로드)
5. CREATE TABLE 실행
6. 데이터 INSERT (배치 처리)
7. 인덱스 생성
8. DB 준비 완료 상태 설정
```

### 쿼리 실행 단계
```
1. 사용자가 SQL 작성
2. Ctrl+Enter 또는 실행 버튼 클릭
3. 쿼리 유효성 검사
4. sql.js에 쿼리 전달
5. 실행 시간 측정
6. 결과 또는 에러 반환
7. 결과 테이블 렌더링
8. 히스토리에 저장
```

---

## 예제 쿼리 설계

### 카테고리 1: 기본 집계
```sql
-- 업종별 상가 수 상위 10개
SELECT
  상권업종대분류명,
  COUNT(*) as 상가수
FROM stores
GROUP BY 상권업종대분류명
ORDER BY 상가수 DESC
LIMIT 10;
```

### 카테고리 2: 상권 분석
```sql
-- 시도별 업종 다양성 (서로 다른 업종 수)
SELECT
  시도명,
  COUNT(DISTINCT 상권업종중분류명) as 업종_다양성,
  COUNT(*) as 총_상가수
FROM stores
GROUP BY 시도명
ORDER BY 업종_다양성 DESC;
```

### 카테고리 3: 사업자 인사이트
```sql
-- 업종별 평균 임대료 및 면적
SELECT
  상권업종대분류명,
  ROUND(AVG(임대료), 2) as 평균_임대료,
  ROUND(AVG(면적), 2) as 평균_면적,
  ROUND(AVG(임대료 / NULLIF(면적, 0)), 2) as 평방미터당_임대료
FROM stores
WHERE 임대료 > 0 AND 면적 > 0
GROUP BY 상권업종대분류명
ORDER BY 평방미터당_임대료 DESC;
```

### 카테고리 4: 고객 타겟팅
```sql
-- 서울 강남구 소형 음식점 (타겟 마케팅 대상)
SELECT
  상호명,
  상권업종중분류명,
  면적,
  임대료
FROM stores
WHERE 시도명 = '서울특별시'
  AND 시군구명 = '강남구'
  AND 상권업종대분류명 = '음식'
  AND 면적 BETWEEN 20 AND 50
ORDER BY 임대료 ASC
LIMIT 50;
```

### 카테고리 5: 윈도우 함수
```sql
-- 시도별 임대료 랭킹 (상위 3개씩)
WITH ranked_stores AS (
  SELECT
    시도명,
    상호명,
    임대료,
    ROW_NUMBER() OVER (PARTITION BY 시도명 ORDER BY 임대료 DESC) as rn
  FROM stores
  WHERE 임대료 > 0
)
SELECT
  시도명,
  상호명,
  임대료,
  rn as 순위
FROM ranked_stores
WHERE rn <= 3
ORDER BY 시도명, rn;
```

### 카테고리 6: CTE 고급 분석
```sql
-- 지역별 임대료 분위수 분석
WITH percentiles AS (
  SELECT
    시도명,
    임대료,
    NTILE(4) OVER (PARTITION BY 시도명 ORDER BY 임대료) as quartile
  FROM stores
  WHERE 임대료 > 0
)
SELECT
  시도명,
  quartile as 분위수,
  MIN(임대료) as 최소값,
  MAX(임대료) as 최대값,
  ROUND(AVG(임대료), 2) as 평균값
FROM percentiles
GROUP BY 시도명, quartile
ORDER BY 시도명, quartile;
```

---

## UI/UX 설계

### 레이아웃
- **3단 레이아웃**: 왼쪽 (스키마/예제), 중앙 (에디터), 오른쪽 (결과)
- **반응형**: 모바일에서는 탭 형식으로 전환
- **다크모드**: 개발자 친화적 인터페이스

### 색상 테마
- **Primary**: Naver Green (#03C75A)
- **Secondary**: Dark Blue (#1E3A8A)
- **Background**: White / Dark Gray (#1F2937)
- **Text**: Black / White
- **Accent**: Orange (#F97316) - 에러, 경고

### 주요 인터랙션
- **쿼리 실행**: `Ctrl+Enter` 단축키
- **예제 로드**: 클릭으로 에디터에 자동 삽입
- **결과 다운로드**: CSV 형식으로 저장
- **히스토리 재실행**: 클릭 한 번으로 재실행
- **스키마 복사**: 테이블/컬럼명 클릭으로 복사

---

## 성능 최적화

### 데이터베이스
- **인덱스**: 자주 검색되는 컬럼 (시도명, 상권업종대분류명) 인덱스 생성
- **배치 INSERT**: 1000개 단위로 트랜잭션 처리
- **메모리 관리**: sql.js 메모리 DB 크기 모니터링

### React
- **useMemo**: 쿼리 결과 캐싱
- **useCallback**: 이벤트 핸들러 메모이제이션
- **코드 스플리팅**: Monaco Editor lazy loading
- **가상화**: 큰 결과 테이블의 경우 react-window 사용

### 번들 크기
- **sql.js**: CDN에서 로드
- **Monaco Editor**: Webpack 설정으로 필요한 언어만 포함
- **Tree Shaking**: 사용하지 않는 코드 제거

---

## 개발 로드맵

### Phase 1: 기본 인프라 (Day 1)
- [x] 프로젝트 설계 문서 작성
- [ ] Vite + React 프로젝트 초기화
- [ ] Tailwind CSS 설정
- [ ] CSV 다운로드 및 데이터 구조 분석

### Phase 2: 데이터베이스 (Day 1-2)
- [ ] sql.js 통합
- [ ] useDatabase 훅 구현
- [ ] CSV 로딩 및 테이블 생성
- [ ] 쿼리 실행 로직

### Phase 3: 코어 컴포넌트 (Day 2-3)
- [ ] SQLEditor 컴포넌트 (Monaco Editor)
- [ ] ResultTable 컴포넌트
- [ ] SchemaViewer 컴포넌트
- [ ] QueryHistory 컴포넌트

### Phase 4: 예제 및 학습 자료 (Day 3-4)
- [ ] 네이버파이낸셜 맥락 예제 쿼리 작성 (6개 레벨)
- [ ] ExampleQueries 컴포넌트
- [ ] SQL 학습 가이드
- [ ] 쿼리 패턴 라이브러리

### Phase 5: 통합 및 최적화 (Day 4-5)
- [ ] App.jsx 레이아웃 통합
- [ ] 다크모드 구현
- [ ] 성능 최적화
- [ ] 에러 처리 개선

### Phase 6: 테스트 및 배포 (Day 5)
- [ ] 기능 테스트
- [ ] 크로스 브라우저 테스트
- [ ] Vercel/Netlify 배포
- [ ] 문서화 (README.md)

---

## 학습 가이드 설계

### SQL 기초
1. **SELECT 기본**: 컬럼 선택, WHERE 조건
2. **집계 함수**: COUNT, SUM, AVG, MIN, MAX
3. **GROUP BY**: 그룹화 및 집계
4. **ORDER BY**: 정렬
5. **LIMIT**: 결과 제한

### SQL 중급
1. **JOIN**: INNER, LEFT, RIGHT JOIN
2. **서브쿼리**: WHERE, FROM, SELECT 절 서브쿼리
3. **CASE WHEN**: 조건부 로직
4. **문자열 함수**: CONCAT, SUBSTR, LIKE
5. **날짜 함수**: DATE, DATETIME 처리

### SQL 고급
1. **윈도우 함수**: ROW_NUMBER, RANK, LAG, LEAD
2. **CTE**: WITH 절 사용
3. **통계 함수**: PERCENTILE, STDDEV
4. **성능 최적화**: 인덱스, 실행 계획
5. **복잡한 쿼리**: 다중 CTE, 재귀 쿼리

---

## 면접 대비 전략

### 예상 쿼리 유형
1. **집계 분석**: "업종별 매출 상위 10개 추출"
2. **세그먼트 분석**: "특정 조건의 사업자 타겟팅"
3. **트렌드 분석**: "월별 신규 사업자 증가율"
4. **상권 분석**: "특정 지역의 업종 밀집도"
5. **고객 인사이트**: "사업자 특성에 따른 분류"

### 쿼리 작성 팁
1. **명확한 컬럼명**: AS로 결과 컬럼 명시
2. **주석 추가**: 복잡한 로직 설명
3. **들여쓰기**: 가독성 있는 포맷팅
4. **NULL 처리**: COALESCE, NULLIF 활용
5. **성능 고려**: 불필요한 서브쿼리 지양

---

## 기술 스택 선정 이유

### React + Vite
- **빠른 개발**: HMR (Hot Module Replacement)
- **현대적**: 최신 JavaScript 기능 지원
- **경량**: 빠른 빌드 및 번들 크기

### sql.js
- **브라우저 실행**: 서버 불필요, 완전한 클라이언트 사이드
- **SQLite 호환**: 표준 SQL 문법
- **빠른 성능**: WebAssembly 기반

### Monaco Editor
- **VS Code 기반**: 익숙한 개발 경험
- **강력한 기능**: 문법 하이라이팅, 자동완성, 에러 표시
- **커스터마이징**: SQL 전용 설정 가능

### Tailwind CSS
- **빠른 스타일링**: 유틸리티 클래스
- **일관성**: 디자인 시스템 통일
- **반응형**: 쉬운 반응형 디자인

---

## 보안 및 제한사항

### 보안
- **클라이언트 사이드**: 모든 처리가 브라우저에서 실행 (데이터 유출 없음)
- **XSS 방지**: React의 기본 XSS 보호
- **SQL Injection**: 읽기 전용 DB, 사용자 쿼리 격리

### 제한사항
- **데이터 크기**: 브라우저 메모리 제한 (~100MB CSV)
- **쿼리 복잡도**: 매우 복잡한 쿼리는 느릴 수 있음
- **브라우저 호환성**: 최신 브라우저 (Chrome, Firefox, Edge)

---

## 확장 가능성

### 향후 추가 기능
1. **다중 데이터셋**: 여러 CSV 파일 로드
2. **쿼리 공유**: URL로 쿼리 공유
3. **AI 도우미**: GPT 기반 쿼리 생성 도움
4. **시각화**: Chart.js로 결과 그래프 표시
5. **협업 기능**: 실시간 공동 쿼리 작성
6. **퀴즈 모드**: SQL 문제 풀이 및 자동 채점
7. **성능 분석**: EXPLAIN QUERY PLAN 표시

---

## 참고 자료

### 공식 문서
- [sql.js Documentation](https://sql.js.org/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/index.html)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### 네이버파이낸셜 관련
- [네이버페이 마이비즈](https://business.pay.naver.com/)
- [네이버 스마트스토어](https://sell.smartstore.naver.com/)
- [공공데이터포털 - 상가정보](https://www.data.go.kr/)

### SQL 학습 자료
- [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [SQL Window Functions](https://www.postgresql.org/docs/current/tutorial-window.html)
- [SQL for Data Analysis](https://mode.com/sql-tutorial/)

---

## 프로젝트 메타데이터

- **프로젝트명**: NaverFinancial SQL Query Practice Platform
- **버전**: 1.0.0
- **작성일**: 2025-11-05
- **작성자**: Claude Code Assistant
- **라이선스**: MIT
- **목적**: 네이버파이낸셜 면접 준비 (쿼리 테스트)
