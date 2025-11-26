// 라니를 위한 SQL 학습 문제 - 실제 데이터 기반

export const learningPath = [
  {
    level: 1,
    name: '입문: SQL 첫걸음',
    description: 'SQL이 처음이신가요? 천천히 따라오세요!',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: '🌱'
  },
  {
    level: 2,
    name: '초급: 데이터 조회',
    description: '조건을 걸어서 원하는 데이터만 찾기',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    icon: '🔍'
  },
  {
    level: 3,
    name: '중급: 데이터 집계',
    description: '그룹화해서 통계 내기',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    icon: '📊'
  },
  {
    level: 4,
    name: '고급: 복잡한 분석',
    description: '실무 수준의 데이터 분석',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    icon: '🎯'
  },
  {
    level: 5,
    name: '마스터: 고급 기법',
    description: '윈도우 함수와 CTE 마스터하기',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: '🏆'
  }
];

export const quizProblems = [
  // ============ LEVEL 1: 입문 ============
  {
    id: 101,
    level: 1,
    title: '첫 번째 쿼리: 모든 데이터 보기',
    description: '가장 기본적인 SQL 문법입니다. stores 테이블의 모든 데이터를 조회하세요. (처음 10개만)',
    points: 10,
    timeLimit: 300,

    tutorial: `
# SELECT 문의 기본 구조

\`\`\`sql
SELECT * FROM 테이블명;
\`\`\`

- **SELECT**: "선택하다" - 어떤 컬럼을 볼지 정함
- **\***: "모든 컬럼" (별표는 "all"을 의미)
- **FROM**: "~로부터" - 어느 테이블에서 가져올지
- **테이블명**: 데이터가 저장된 테이블 (우리는 stores)

💡 **팁**: 데이터가 너무 많으면 LIMIT 10을 추가하세요!
    `,

    hints: [
      "SELECT * FROM stores",
      "LIMIT 10을 추가하면 10개만 볼 수 있어요",
      "정답: SELECT * FROM stores LIMIT 10;"
    ],

    answer: "SELECT * FROM stores LIMIT 10;",

    validation: {
      type: 'rowCount',
      expected: 10,
      columns: null  // Any columns OK
    }
  },

  {
    id: 102,
    level: 1,
    title: '특정 컬럼만 선택하기',
    description: '상호명, 업종, 구 정보만 조회하세요. (처음 10개)',
    points: 15,
    timeLimit: 300,

    tutorial: `
# 특정 컬럼만 선택하기

\`\`\`sql
SELECT 컬럼1, 컬럼2, 컬럼3 FROM 테이블명;
\`\`\`

- 컬럼명을 쉼표(,)로 구분
- 필요한 컬럼만 볼 수 있어 화면이 깔끔함

**우리 데이터의 주요 컬럼:**
- 상호명: 가게 이름
- 상권업종대분류명: 업종 (음식, 소매 등)
- 시군구명: 구 이름 (강남구, 서초구 등)
    `,

    hints: [
      "SELECT 상호명, ... FROM stores",
      "컬럼명은 쉼표로 구분합니다",
      "상권업종대분류명과 시군구명도 추가하세요"
    ],

    answer: "SELECT 상호명, 상권업종대분류명, 시군구명 FROM stores LIMIT 10;",

    validation: {
      type: 'columns',
      expectedColumns: ['상호명', '상권업종대분류명', '시군구명'],
      minRows: 10
    }
  },

  {
    id: 103,
    level: 1,
    title: '데이터 정렬하기',
    description: '상호명을 가나다순으로 정렬하여 조회하세요. (처음 10개)',
    points: 15,
    timeLimit: 300,

    tutorial: `
# 데이터 정렬 (ORDER BY)

\`\`\`sql
SELECT * FROM 테이블명 ORDER BY 컬럼명;
\`\`\`

- **ORDER BY**: 정렬 기준
- **ASC**: 오름차순 (기본값, 생략 가능) - 가나다순, 123순
- **DESC**: 내림차순 - 하z..., 321순

예: \`ORDER BY 상호명 ASC\` → ㄱㄴㄷ 순서
    `,

    hints: [
      "SELECT * FROM stores ORDER BY ...",
      "상호명으로 정렬하세요",
      "ASC는 생략 가능합니다"
    ],

    answer: "SELECT * FROM stores ORDER BY 상호명 LIMIT 10;",

    validation: {
      type: 'ordering',
      orderColumn: '상호명',
      orderDirection: 'ASC'
    }
  },

  // ============ LEVEL 2: 초급 ============
  {
    id: 201,
    level: 2,
    title: '특정 구의 상가만 보기',
    description: '강남구에 있는 상가만 조회하세요. (처음 20개)',
    points: 20,
    timeLimit: 400,

    tutorial: `
# 조건 필터링 (WHERE)

\`\`\`sql
SELECT * FROM 테이블명 WHERE 조건;
\`\`\`

- **WHERE**: "~인 것만" 조건 설정
- **=**: 같다 (비교 연산자)
- **문자열**: 작은따옴표로 감싸기 '강남구'

예: \`WHERE 시군구명 = '강남구'\`
→ 시군구명이 강남구인 것만!
    `,

    hints: [
      "WHERE 절로 조건을 거세요",
      "시군구명 = '강남구'",
      "문자열은 작은따옴표로!"
    ],

    answer: "SELECT * FROM stores WHERE 시군구명 = '강남구' LIMIT 20;",

    validation: {
      type: 'where',
      conditions: [
        { column: '시군구명', value: '강남구' }
      ]
    }
  },

  {
    id: 202,
    level: 2,
    title: '음식점만 찾기',
    description: '업종이 "음식"인 상가만 조회하세요. (처음 15개)',
    points: 20,
    timeLimit: 400,

    tutorial: `
# 조건 비교

같은 WHERE 절이지만 다른 컬럼으로 조건을 걸 수 있습니다.

\`\`\`sql
WHERE 상권업종대분류명 = '음식'
\`\`\`

💡 **실무 팁**: WHERE 조건은 여러 개를 AND로 연결할 수 있어요!
    `,

    hints: [
      "WHERE 상권업종대분류명 = ?",
      "업종 이름은 '음식'입니다",
      "SELECT * FROM stores WHERE ..."
    ],

    answer: "SELECT * FROM stores WHERE 상권업종대분류명 = '음식' LIMIT 15;",

    validation: {
      type: 'where',
      conditions: [
        { column: '상권업종대분류명', value: '음식' }
      ]
    }
  },

  {
    id: 203,
    level: 2,
    title: '여러 조건 동시에 적용',
    description: '강남구에 있는 음식점만 조회하세요. (처음 20개)',
    points: 25,
    timeLimit: 500,

    tutorial: `
# 여러 조건 조합 (AND)

\`\`\`sql
WHERE 조건1 AND 조건2
\`\`\`

- **AND**: 그리고 (두 조건 모두 만족)
- **OR**: 또는 (둘 중 하나만 만족)

예: \`WHERE 시군구명 = '강남구' AND 상권업종대분류명 = '음식'\`
→ 강남구이면서 동시에 음식점인 것!
    `,

    hints: [
      "두 조건을 AND로 연결하세요",
      "WHERE 시군구명 = '강남구' AND ...",
      "상권업종대분류명 = '음식'도 추가"
    ],

    answer: "SELECT * FROM stores WHERE 시군구명 = '강남구' AND 상권업종대분류명 = '음식' LIMIT 20;",

    validation: {
      type: 'where',
      conditions: [
        { column: '시군구명', value: '강남구' },
        { column: '상권업종대분류명', value: '음식' }
      ]
    }
  },

  {
    id: 204,
    level: 2,
    title: '이름에 특정 단어가 들어간 상가',
    description: '상호명에 "카페"가 포함된 상가를 찾으세요. (처음 15개)',
    points: 25,
    timeLimit: 500,

    tutorial: `
# 패턴 검색 (LIKE)

\`\`\`sql
WHERE 컬럼명 LIKE '%검색어%'
\`\`\`

- **LIKE**: "~와 비슷한"
- **%**: 아무 글자나 (와일드카드)
- **'%카페%'**: 앞뒤에 뭐가 와도 되고, 카페만 들어있으면 OK

예: '스타벅스카페', '카페베네', '투썸플레이스카페' 모두 찾아짐
    `,

    hints: [
      "LIKE 연산자를 사용하세요",
      "WHERE 상호명 LIKE '%카페%'",
      "% 기호는 앞뒤 모두 붙여야 해요"
    ],

    answer: "SELECT * FROM stores WHERE 상호명 LIKE '%카페%' LIMIT 15;",

    validation: {
      type: 'like',
      column: '상호명',
      pattern: '%카페%'
    }
  },

  // ============ LEVEL 3: 중급 ============
  {
    id: 301,
    level: 3,
    title: '총 개수 세기',
    description: '전체 상가의 개수를 세어보세요.',
    points: 30,
    timeLimit: 400,

    tutorial: `
# 집계 함수 (COUNT)

\`\`\`sql
SELECT COUNT(*) FROM 테이블명;
\`\`\`

- **COUNT(*)**: 행의 개수를 셈
- **결과**: 숫자 하나만 나옴

💡 **활용**: "전체 몇 개?", "조건에 맞는 것이 몇 개?" 알고 싶을 때

\`\`\`sql
SELECT COUNT(*) as 개수 FROM stores;
\`\`\`
→ 컬럼명을 '개수'로 표시 (as는 별칭)
    `,

    hints: [
      "COUNT(*) 함수를 사용하세요",
      "SELECT COUNT(*) FROM stores",
      "as 개수를 붙이면 보기 좋아요"
    ],

    answer: "SELECT COUNT(*) as 총상가수 FROM stores;",

    validation: {
      type: 'exact',
      expectedValue: 536115
    }
  },

  {
    id: 302,
    level: 3,
    title: '업종별로 개수 세기',
    description: '각 업종(상권업종대분류명)별로 상가가 몇 개인지 세어보세요.',
    points: 35,
    timeLimit: 500,

    tutorial: `
# 그룹화 (GROUP BY)

\`\`\`sql
SELECT 컬럼, COUNT(*)
FROM 테이블
GROUP BY 컬럼;
\`\`\`

- **GROUP BY**: 같은 값끼리 묶기
- 묶은 후 각 그룹별로 COUNT

**예시:**
음식 → 136,881개
소매 → 111,006개
...

이렇게 각 업종별 개수를 알 수 있어요!
    `,

    hints: [
      "SELECT 상권업종대분류명, COUNT(*) FROM stores",
      "GROUP BY 상권업종대분류명",
      "ORDER BY로 정렬하면 더 보기 좋아요"
    ],

    answer: "SELECT 상권업종대분류명, COUNT(*) as 개수 FROM stores GROUP BY 상권업종대분류명 ORDER BY 개수 DESC;",

    validation: {
      type: 'groupBy',
      groupColumn: '상권업종대분류명',
      hasCount: true
    }
  },

  {
    id: 303,
    level: 3,
    title: '가장 많은 업종 TOP 5',
    description: '상가 수가 가장 많은 업종 5개를 찾으세요.',
    points: 35,
    timeLimit: 500,

    tutorial: `
# 정렬과 제한 조합

\`\`\`sql
SELECT 컬럼, COUNT(*) as 개수
FROM 테이블
GROUP BY 컬럼
ORDER BY 개수 DESC
LIMIT 5;
\`\`\`

- **ORDER BY 개수 DESC**: 개수 많은 순
- **LIMIT 5**: 상위 5개만

이 패턴은 실무에서 정말 많이 써요!
"TOP 10", "상위 5개" 같은 요청에 사용
    `,

    hints: [
      "이전 문제 + ORDER BY + LIMIT",
      "DESC는 내림차순 (큰 것부터)",
      "LIMIT 5로 5개만"
    ],

    answer: "SELECT 상권업종대분류명, COUNT(*) as 개수 FROM stores GROUP BY 상권업종대분류명 ORDER BY 개수 DESC LIMIT 5;",

    validation: {
      type: 'topN',
      groupColumn: '상권업종대분류명',
      n: 5,
      orderBy: 'DESC'
    }
  },

  {
    id: 304,
    level: 3,
    title: '구별 상가 수 계산',
    description: '각 구(시군구명)별로 상가가 몇 개 있는지 세고, 많은 순으로 정렬하세요.',
    points: 35,
    timeLimit: 500,

    tutorial: `
# 같은 패턴, 다른 컬럼

앞에서 배운 것과 똑같은 구조입니다!
다만 "업종" 대신 "구"로 그룹화하는 것만 달라요.

**실무에서:**
"지역별 분포는?" → GROUP BY 지역
"업종별 통계는?" → GROUP BY 업종
"날짜별 추이는?" → GROUP BY 날짜

같은 패턴, 다른 컬럼!
    `,

    hints: [
      "GROUP BY 시군구명",
      "COUNT(*)로 개수 세기",
      "ORDER BY로 정렬"
    ],

    answer: "SELECT 시군구명, COUNT(*) as 개수 FROM stores GROUP BY 시군구명 ORDER BY 개수 DESC;",

    validation: {
      type: 'groupBy',
      groupColumn: '시군구명',
      hasCount: true,
      orderBy: 'DESC'
    }
  },

  // ============ LEVEL 4: 고급 ============
  {
    id: 401,
    level: 4,
    title: '비율 계산하기',
    description: '각 구별 상가 수와 전체 대비 비율(%)을 계산하세요.',
    points: 50,
    timeLimit: 600,

    tutorial: `
# 서브쿼리로 전체 합계 구하기

\`\`\`sql
SELECT
  시군구명,
  COUNT(*) as 개수,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM stores), 2) as 비율
FROM stores
GROUP BY 시군구명;
\`\`\`

- **(SELECT COUNT(*) FROM stores)**: 전체 개수 (서브쿼리)
- **COUNT(*) / 전체개수 * 100**: 백분율
- **ROUND(..., 2)**: 소수점 2자리
    `,

    hints: [
      "서브쿼리: (SELECT COUNT(*) FROM stores)",
      "개수 / 전체 * 100.0",
      "ROUND로 소수점 정리"
    ],

    answer: `SELECT
  시군구명,
  COUNT(*) as 개수,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM stores), 2) as 비율
FROM stores
GROUP BY 시군구명
ORDER BY 개수 DESC;`,

    validation: {
      type: 'columns',
      expectedColumns: ['시군구명', '개수', '비율'],
      hasGroupBy: true
    }
  },

  {
    id: 402,
    level: 4,
    title: '특정 조건 이상만 보기',
    description: '상가 수가 20,000개 이상인 구만 조회하세요.',
    points: 50,
    timeLimit: 600,

    tutorial: `
# 그룹 필터링 (HAVING)

\`\`\`sql
SELECT 컬럼, COUNT(*)
FROM 테이블
GROUP BY 컬럼
HAVING COUNT(*) >= 숫자;
\`\`\`

- **WHERE**: 원본 데이터 필터링 (그룹화 전)
- **HAVING**: 그룹 결과 필터링 (그룹화 후)

**언제 써야 할까?**
- "개수가 100개 이상인 것만" → HAVING
- "강남구만" → WHERE
    `,

    hints: [
      "GROUP BY 시군구명 먼저",
      "HAVING COUNT(*) >= 20000",
      "WHERE가 아니라 HAVING!"
    ],

    answer: `SELECT
  시군구명,
  COUNT(*) as 개수
FROM stores
GROUP BY 시군구명
HAVING COUNT(*) >= 20000
ORDER BY 개수 DESC;`,

    validation: {
      type: 'having',
      groupColumn: '시군구명',
      condition: 'COUNT(*) >= 20000'
    }
  },

  {
    id: 403,
    level: 4,
    title: '구별 업종 다양성 분석',
    description: '각 구마다 서로 다른 업종(상권업종중분류명)이 몇 개 있는지 세어보세요.',
    points: 55,
    timeLimit: 600,

    tutorial: `
# 고유값 개수 (COUNT DISTINCT)

\`\`\`sql
SELECT
  시군구명,
  COUNT(DISTINCT 상권업종중분류명) as 업종다양성
FROM stores
GROUP BY 시군구명;
\`\`\`

- **COUNT(DISTINCT 컬럼)**: 중복 제거 후 개수
- **COUNT(*)**: 모든 행 개수
- **차이**: DISTINCT는 "서로 다른 것만"

**실무 활용:**
- 업종 다양성 높음 = 복합 상권
- 업종 다양성 낮음 = 특화 상권
    `,

    hints: [
      "COUNT(DISTINCT 상권업종중분류명)",
      "GROUP BY 시군구명",
      "DISTINCT가 핵심!"
    ],

    answer: `SELECT
  시군구명,
  COUNT(DISTINCT 상권업종중분류명) as 업종다양성,
  COUNT(*) as 총상가수
FROM stores
GROUP BY 시군구명
ORDER BY 업종다양성 DESC;`,

    validation: {
      type: 'columns',
      expectedColumns: ['시군구명', '업종다양성'],
      hasGroupBy: true
    }
  },

  // ============ LEVEL 5: 마스터 ============
  {
    id: 501,
    level: 5,
    title: '구별 업종 순위 매기기',
    description: '각 구에서 상가 수가 가장 많은 업종 3개씩을 순위와 함께 조회하세요.',
    points: 70,
    timeLimit: 900,

    tutorial: `
# 윈도우 함수 (ROW_NUMBER)

\`\`\`sql
WITH RankedData AS (
  SELECT
    시군구명,
    상권업종대분류명,
    COUNT(*) as 개수,
    ROW_NUMBER() OVER (
      PARTITION BY 시군구명
      ORDER BY COUNT(*) DESC
    ) as 순위
  FROM stores
  GROUP BY 시군구명, 상권업종대분류명
)
SELECT * FROM RankedData WHERE 순위 <= 3;
\`\`\`

- **WITH**: 임시 테이블 만들기 (CTE)
- **ROW_NUMBER()**: 순번 매기기
- **PARTITION BY**: 그룹별로 따로 순번
- **OVER**: 윈도우 함수 시작
    `,

    hints: [
      "CTE(WITH)로 먼저 순위를 매기세요",
      "ROW_NUMBER() OVER (PARTITION BY 시군구명 ...)",
      "WHERE 순위 <= 3으로 필터링"
    ],

    answer: `WITH RankedIndustries AS (
  SELECT
    시군구명,
    상권업종대분류명,
    COUNT(*) as 개수,
    ROW_NUMBER() OVER (PARTITION BY 시군구명 ORDER BY COUNT(*) DESC) as 순위
  FROM stores
  GROUP BY 시군구명, 상권업종대분류명
)
SELECT * FROM RankedIndustries WHERE 순위 <= 3 ORDER BY 시군구명, 순위;`,

    validation: {
      type: 'window',
      hasRowNumber: true,
      hasPartition: true
    }
  },

  {
    id: 502,
    level: 5,
    title: '복합 상권 찾기',
    description: '업종 다양성이 높은 동네 TOP 10을 찾으세요. (여러 업종이 고르게 있는 곳)',
    points: 75,
    timeLimit: 900,

    tutorial: `
# CTE로 복잡한 분석

\`\`\`sql
WITH Diversity AS (
  SELECT
    시군구명,
    행정동명,
    COUNT(DISTINCT 상권업종대분류명) as 업종수,
    COUNT(*) as 총상가수
  FROM stores
  GROUP BY 시군구명, 행정동명
  HAVING COUNT(*) >= 100
)
SELECT * FROM Diversity
ORDER BY 업종수 DESC
LIMIT 10;
\`\`\`

**실무 의미:**
업종 다양성이 높은 곳 = 유동인구 많고 복합적인 상권
→ 마케팅 가치가 높음!
    `,

    hints: [
      "WITH Diversity AS (...) 로 시작",
      "COUNT(DISTINCT 상권업종대분류명)",
      "GROUP BY 시군구명, 행정동명"
    ],

    answer: `WITH Diversity AS (
  SELECT
    시군구명,
    행정동명,
    COUNT(DISTINCT 상권업종대분류명) as 업종다양성,
    COUNT(*) as 총상가수
  FROM stores
  GROUP BY 시군구명, 행정동명
  HAVING COUNT(*) >= 100
)
SELECT * FROM Diversity ORDER BY 업종다양성 DESC LIMIT 10;`,

    validation: {
      type: 'cte',
      hasCTE: true,
      hasDistinct: true
    }
  }
];

export const difficultyLevels = {
  1: { name: '입문', color: 'green', minScore: 0 },
  2: { name: '초급', color: 'blue', minScore: 50 },
  3: { name: '중급', color: 'purple', minScore: 150 },
  4: { name: '고급', color: 'orange', minScore: 300 },
  5: { name: '마스터', color: 'red', minScore: 500 }
};
