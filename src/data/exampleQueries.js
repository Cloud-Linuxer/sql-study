export const exampleQueries = [
  {
    id: 1,
    category: 'Level 1: 기본 집계',
    title: '업종별 상가 수 Top 10',
    description: '업종 대분류별로 상가 수를 집계하고 상위 10개 업종을 조회',
    difficulty: 'easy',
    query: `SELECT
  "상권업종대분류명",
  COUNT(*) as 상가수
FROM stores
GROUP BY "상권업종대분류명"
ORDER BY 상가수 DESC
LIMIT 10;`
  },
  {
    id: 2,
    category: 'Level 1: 기본 집계',
    title: '구별 상가 분포',
    description: '서울시 각 구별 상가 수를 집계',
    difficulty: 'easy',
    query: `SELECT
  "시군구명",
  COUNT(*) as 상가수,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM stores), 2) as 비율
FROM stores
GROUP BY "시군구명"
ORDER BY 상가수 DESC;`
  },
  {
    id: 3,
    category: 'Level 2: 상권 분석',
    title: '구별 업종 다양성',
    description: '각 구별로 서로 다른 업종이 몇 개 있는지 분석',
    difficulty: 'medium',
    query: `SELECT
  "시군구명",
  COUNT(DISTINCT "상권업종중분류명") as 업종_다양성,
  COUNT(*) as 총_상가수,
  ROUND(COUNT(DISTINCT "상권업종중분류명") * 1.0 / COUNT(*) * 100, 2) as 다양성_지수
FROM stores
GROUP BY "시군구명"
ORDER BY 업종_다양성 DESC;`
  },
  {
    id: 4,
    category: 'Level 2: 상권 분석',
    title: '업종별 주요 상권',
    description: '음식 업종이 가장 많이 집중된 구 Top 5',
    difficulty: 'medium',
    query: `SELECT
  "시군구명",
  COUNT(*) as 음식점_수,
  ROUND(COUNT(*) * 100.0 / (
    SELECT COUNT(*)
    FROM stores
    WHERE "상권업종대분류명" = 'Q'
  ), 2) as 점유율
FROM stores
WHERE "상권업종대분류명" = 'Q'
GROUP BY "시군구명"
ORDER BY 음식점_수 DESC
LIMIT 5;`
  },
  {
    id: 5,
    category: 'Level 3: 사업자 인사이트',
    title: '상호명 패턴 분석',
    description: '특정 키워드가 들어간 상호명 검색 (예: 카페)',
    difficulty: 'medium',
    query: `SELECT
  "상호명",
  "상권업종중분류명",
  "시군구명",
  "행정동명"
FROM stores
WHERE "상호명" LIKE '%카페%'
  AND "상권업종대분류명" = 'Q'
LIMIT 50;`
  },
  {
    id: 6,
    category: 'Level 3: 사업자 인사이트',
    title: '프랜차이즈 vs 개인 사업자',
    description: '같은 상호명이 여러 곳에 있는 프랜차이즈 추정',
    difficulty: 'medium',
    query: `SELECT
  "상호명",
  COUNT(*) as 매장수,
  COUNT(DISTINCT "시군구명") as 진출_구수,
  "상권업종중분류명"
FROM stores
WHERE "상호명" IS NOT NULL
  AND "상호명" != ''
GROUP BY "상호명", "상권업종중분류명"
HAVING COUNT(*) >= 10
ORDER BY 매장수 DESC
LIMIT 20;`
  },
  {
    id: 7,
    category: 'Level 4: 고객 타겟팅',
    title: '특정 지역 음식점 타겟팅',
    description: '강남구의 음식점 중 특정 업종을 타겟팅',
    difficulty: 'medium',
    query: `SELECT
  "상호명",
  "상권업종중분류명",
  "행정동명",
  "도로명주소"
FROM stores
WHERE "시군구명" = '강남구'
  AND "상권업종대분류명" = 'Q'
  AND "상권업종중분류명" IN ('Q01', 'Q02', 'Q03')
ORDER BY "행정동명"
LIMIT 100;`
  },
  {
    id: 8,
    category: 'Level 4: 고객 타겟팅',
    title: '신규 진입 가능 상권',
    description: '특정 업종이 적은 지역 찾기 (시장 기회 분석)',
    difficulty: 'hard',
    query: `SELECT
  "시군구명",
  "행정동명",
  COUNT(*) as 기존_업체수
FROM stores
WHERE "상권업종중분류명" = 'Q12'  -- 커피/음료
GROUP BY "시군구명", "행정동명"
HAVING COUNT(*) < 10
ORDER BY 기존_업체수 ASC
LIMIT 30;`
  },
  {
    id: 9,
    category: 'Level 5: 윈도우 함수',
    title: '구별 업종 순위',
    description: '각 구에서 가장 많은 업종 Top 3',
    difficulty: 'hard',
    query: `WITH RankedIndustries AS (
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
SELECT
  "시군구명",
  "상권업종대분류명",
  상가수,
  순위
FROM RankedIndustries
WHERE 순위 <= 3
ORDER BY "시군구명", 순위;`
  },
  {
    id: 10,
    category: 'Level 5: 윈도우 함수',
    title: '업종별 상가 밀집도 분석',
    description: '업종별로 구 단위 상가수 분포 분석',
    difficulty: 'hard',
    query: `WITH IndustryStats AS (
  SELECT
    "상권업종대분류명",
    "시군구명",
    COUNT(*) as 상가수
  FROM stores
  GROUP BY "상권업종대분류명", "시군구명"
)
SELECT
  "상권업종대분류명",
  COUNT(DISTINCT "시군구명") as 진출_구수,
  SUM(상가수) as 총_상가수,
  ROUND(AVG(상가수), 1) as 평균_구별_상가수,
  MAX(상가수) as 최대_집중도,
  MIN(상가수) as 최소_분포
FROM IndustryStats
GROUP BY "상권업종대분류명"
HAVING COUNT(DISTINCT "시군구명") >= 20
ORDER BY 총_상가수 DESC;`
  },
  {
    id: 11,
    category: 'Level 6: 고급 분석',
    title: '지역별 업종 집중도 지수',
    description: 'CTE와 집계 함수를 활용한 업종 집중도 계산',
    difficulty: 'hard',
    query: `WITH DistrictTotal AS (
  SELECT
    "시군구명",
    COUNT(*) as 총_상가수
  FROM stores
  GROUP BY "시군구명"
),
IndustryByDistrict AS (
  SELECT
    "시군구명",
    "상권업종대분류명",
    COUNT(*) as 업종별_상가수
  FROM stores
  GROUP BY "시군구명", "상권업종대분류명"
)
SELECT
  i."시군구명",
  i."상권업종대분류명",
  i.업종별_상가수,
  d.총_상가수,
  ROUND(i.업종별_상가수 * 100.0 / d.총_상가수, 2) as 집중도
FROM IndustryByDistrict i
JOIN DistrictTotal d ON i."시군구명" = d."시군구명"
WHERE i.업종별_상가수 >= 100
ORDER BY 집중도 DESC
LIMIT 50;`
  },
  {
    id: 12,
    category: 'Level 6: 고급 분석',
    title: '복합 상권 분석',
    description: '여러 업종이 고르게 분포된 복합 상권 찾기',
    difficulty: 'expert',
    query: `WITH IndustryDiversity AS (
  SELECT
    "시군구명",
    "행정동명",
    COUNT(DISTINCT "상권업종대분류명") as 업종_다양성,
    COUNT(*) as 총_상가수
  FROM stores
  GROUP BY "시군구명", "행정동명"
  HAVING COUNT(*) >= 100
),
RankedDistricts AS (
  SELECT
    *,
    ROUND(업종_다양성 * 1.0 / 총_상가수 * 100, 2) as 다양성_지수,
    ROW_NUMBER() OVER (ORDER BY 업종_다양성 DESC) as 순위
  FROM IndustryDiversity
)
SELECT
  "시군구명",
  "행정동명",
  업종_다양성,
  총_상가수,
  다양성_지수,
  순위
FROM RankedDistricts
WHERE 순위 <= 20
ORDER BY 순위;`
  }
];

export const queryCategories = [
  { id: 1, name: 'Level 1: 기본 집계', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { id: 2, name: 'Level 2: 상권 분석', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 3, name: 'Level 3: 사업자 인사이트', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 4, name: 'Level 4: 고객 타겟팅', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 5, name: 'Level 5: 윈도우 함수', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { id: 6, name: 'Level 6: 고급 분석', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' }
];

export const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  expert: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};
