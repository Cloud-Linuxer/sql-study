/**
 * Quiz answer validation system
 */

export async function validateAnswer(userQuery, problem, executeQuery) {
  try {
    // Execute user's query
    const userResult = await executeQuery(userQuery);

    // Execute correct answer
    const correctResult = await executeQuery(problem.answer);

    const validation = problem.validation;
    let isCorrect = false;
    let feedback = '';
    let score = 0;

    switch (validation.type) {
      case 'rowCount':
        isCorrect = userResult.rowCount === validation.expected;
        feedback = isCorrect
          ? `정답입니다! ${validation.expected}개의 행을 반환했습니다.`
          : `틀렸습니다. ${validation.expected}개를 반환해야 하는데 ${userResult.rowCount}개를 반환했습니다.`;
        break;

      case 'columns':
        const userColumns = userResult.columns || [];
        const hasAllColumns = validation.expectedColumns.every(col =>
          userColumns.includes(col)
        );
        const rowsOk = validation.minRows ? userResult.rowCount >= validation.minRows : true;

        isCorrect = hasAllColumns && rowsOk;
        feedback = isCorrect
          ? `정답입니다! 필요한 컬럼을 모두 포함했습니다.`
          : !hasAllColumns
            ? `필요한 컬럼이 누락되었습니다: ${validation.expectedColumns.join(', ')}`
            : `최소 ${validation.minRows}개 이상의 행이 필요합니다.`;
        break;

      case 'exact':
        // For single value results (like COUNT(*))
        const userValue = userResult.rows[0]?.[Object.keys(userResult.rows[0])[0]];
        isCorrect = userValue === validation.expectedValue;
        feedback = isCorrect
          ? `정답입니다! ${validation.expectedValue}`
          : `틀렸습니다. 정답은 ${validation.expectedValue}인데 ${userValue}를 얻었습니다.`;
        break;

      case 'groupBy':
        const hasGroupColumn = userResult.columns?.includes(validation.groupColumn);
        const hasCountColumn = userResult.columns?.some(col =>
          col.includes('개수') || col.includes('count') || col.includes('COUNT')
        );

        isCorrect = hasGroupColumn && hasCountColumn && userResult.rowCount > 1;
        feedback = isCorrect
          ? `정답입니다! GROUP BY를 올바르게 사용했습니다.`
          : `GROUP BY ${validation.groupColumn}를 사용하고 COUNT(*)로 개수를 세어야 합니다.`;
        break;

      case 'where':
        // Check if result matches expected conditions
        const allRowsMatch = userResult.rows.every(row =>
          validation.conditions.every(cond =>
            row[cond.column] === cond.value
          )
        );

        isCorrect = allRowsMatch && userResult.rowCount > 0;
        feedback = isCorrect
          ? `정답입니다! WHERE 조건을 올바르게 적용했습니다.`
          : `WHERE 조건이 올바르지 않습니다. ${validation.conditions.map(c => `${c.column} = '${c.value}'`).join(' AND ')}`;
        break;

      case 'ordering':
        if (userResult.rowCount >= 2) {
          const firstValue = userResult.rows[0][validation.orderColumn];
          const secondValue = userResult.rows[1][validation.orderColumn];

          if (validation.orderDirection === 'ASC') {
            isCorrect = firstValue <= secondValue;
          } else {
            isCorrect = firstValue >= secondValue;
          }
        }

        feedback = isCorrect
          ? `정답입니다! ${validation.orderColumn}으로 ${validation.orderDirection} 정렬했습니다.`
          : `ORDER BY ${validation.orderColumn} ${validation.orderDirection}로 정렬해야 합니다.`;
        break;

      case 'topN':
        const topNCorrect = userResult.rowCount === validation.n;
        const hasOrder = validation.orderBy ? true : true; // Simplified check

        isCorrect = topNCorrect && hasOrder;
        feedback = isCorrect
          ? `정답입니다! TOP ${validation.n}를 올바르게 조회했습니다.`
          : `LIMIT ${validation.n}를 사용하여 상위 ${validation.n}개만 조회하세요.`;
        break;

      case 'like':
        const likeMatches = userResult.rows.every(row =>
          row[validation.column]?.includes(validation.pattern.replace(/%/g, ''))
        );

        isCorrect = likeMatches && userResult.rowCount > 0;
        feedback = isCorrect
          ? `정답입니다! LIKE 패턴을 올바르게 사용했습니다.`
          : `WHERE ${validation.column} LIKE '${validation.pattern}'를 사용하세요.`;
        break;

      case 'having':
        const queryUpper = userQuery.toUpperCase();
        const hasHaving = queryUpper.includes('HAVING');
        const hasGroupBy = queryUpper.includes('GROUP BY');

        isCorrect = hasHaving && hasGroupBy && userResult.rowCount > 0;
        feedback = isCorrect
          ? `정답입니다! HAVING 절을 올바르게 사용했습니다.`
          : `GROUP BY와 HAVING 절을 사용하여 그룹 결과를 필터링하세요.`;
        break;

      case 'window':
        const queryText = userQuery.toUpperCase();
        const hasWindow = queryText.includes('ROW_NUMBER') ||
                         queryText.includes('RANK') ||
                         queryText.includes('DENSE_RANK');
        const hasPartition = queryText.includes('PARTITION BY');

        isCorrect = hasWindow && hasPartition;
        feedback = isCorrect
          ? `정답입니다! 윈도우 함수를 올바르게 사용했습니다.`
          : `윈도우 함수 (ROW_NUMBER, RANK 등)와 PARTITION BY를 사용하세요.`;
        break;

      case 'cte':
        const hasCTE = userQuery.toUpperCase().includes('WITH');
        const hasDistinct = validation.hasDistinct ?
          userQuery.toUpperCase().includes('DISTINCT') : true;

        isCorrect = hasCTE && hasDistinct && userResult.rowCount > 0;
        feedback = isCorrect
          ? `정답입니다! CTE를 올바르게 사용했습니다.`
          : `WITH 절(CTE)을 사용하여 쿼리를 구조화하세요.`;
        break;

      default:
        // Fallback: compare results
        isCorrect = JSON.stringify(userResult.rows) === JSON.stringify(correctResult.rows);
        feedback = isCorrect ? `정답입니다!` : `결과가 정답과 다릅니다.`;
    }

    // Calculate score
    if (isCorrect) {
      score = problem.points;

      // Bonus for fast execution
      if (userResult.executionTime < 100) {
        score += 5;
        feedback += ' ⚡ 빠른 실행 보너스 +5점!';
      }
    }

    return {
      isCorrect,
      score,
      feedback,
      userResult,
      executionTime: userResult.executionTime
    };

  } catch (error) {
    return {
      isCorrect: false,
      score: 0,
      feedback: `쿼리 실행 오류: ${error.message}`,
      error: error.message
    };
  }
}

/**
 * Get hint by level (progressive hints)
 */
export function getHint(problem, hintLevel) {
  if (!problem.hints || hintLevel >= problem.hints.length) {
    return null;
  }
  return problem.hints[hintLevel];
}

/**
 * Calculate total progress
 */
export function calculateProgress(solvedProblems, totalProblems) {
  const totalScore = solvedProblems.reduce((sum, p) => sum + p.score, 0);
  const maxScore = totalProblems.reduce((sum, p) => sum + p.points, 0);

  return {
    solved: solvedProblems.length,
    total: totalProblems.length,
    percentage: Math.round((solvedProblems.length / totalProblems.length) * 100),
    score: totalScore,
    maxScore: maxScore,
    scorePercentage: Math.round((totalScore / maxScore) * 100)
  };
}

/**
 * Get next recommended problem
 */
export function getNextProblem(solvedIds, allProblems) {
  // Find first unsolved problem
  return allProblems.find(p => !solvedIds.includes(p.id)) || null;
}
