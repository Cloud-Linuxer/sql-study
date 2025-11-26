/**
 * Format query execution time
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
export function formatExecutionTime(ms) {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(2)}μs`;
  } else if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  } else {
    return `${(ms / 1000).toFixed(2)}s`;
  }
}

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('ko-KR').format(num);
}

/**
 * Download data as CSV
 * @param {Array} data - Array of objects
 * @param {string} filename - Output filename
 */
export function downloadCSV(data, filename = 'query_result.csv') {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.map(h => `"${h}"`).join(','));

  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) {
        return '';
      }
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse SQL query to detect type
 * @param {string} query - SQL query string
 * @returns {string} Query type (SELECT, INSERT, UPDATE, DELETE, etc.)
 */
export function getQueryType(query) {
  const trimmed = query.trim().toUpperCase();

  if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
    return 'SELECT';
  } else if (trimmed.startsWith('INSERT')) {
    return 'INSERT';
  } else if (trimmed.startsWith('UPDATE')) {
    return 'UPDATE';
  } else if (trimmed.startsWith('DELETE')) {
    return 'DELETE';
  } else if (trimmed.startsWith('CREATE')) {
    return 'CREATE';
  } else if (trimmed.startsWith('DROP')) {
    return 'DROP';
  } else if (trimmed.startsWith('ALTER')) {
    return 'ALTER';
  }

  return 'UNKNOWN';
}

/**
 * Validate SQL query
 * @param {string} query - SQL query to validate
 * @returns {Object} Validation result { valid: boolean, error: string }
 */
export function validateQuery(query) {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: '쿼리를 입력해주세요.' };
  }

  const trimmed = query.trim().toUpperCase();

  // Block destructive operations on schema
  const destructiveKeywords = ['DROP TABLE', 'TRUNCATE', 'DELETE FROM stores'];
  for (const keyword of destructiveKeywords) {
    if (trimmed.includes(keyword)) {
      return { valid: false, error: `보안상 ${keyword} 명령은 실행할 수 없습니다.` };
    }
  }

  return { valid: true, error: null };
}

/**
 * Get column statistics from data
 * @param {Array} data - Array of objects
 * @param {string} columnName - Column name
 * @returns {Object} Statistics object
 */
export function getColumnStats(data, columnName) {
  if (!data || data.length === 0) {
    return null;
  }

  const values = data.map(row => row[columnName]).filter(v => v !== null && v !== undefined);

  if (values.length === 0) {
    return { nullCount: data.length, nullPercentage: 100 };
  }

  const stats = {
    totalCount: data.length,
    nonNullCount: values.length,
    nullCount: data.length - values.length,
    nullPercentage: ((data.length - values.length) / data.length * 100).toFixed(2),
    uniqueCount: new Set(values).size
  };

  // Numeric statistics
  const numericValues = values.filter(v => typeof v === 'number');
  if (numericValues.length > 0) {
    stats.min = Math.min(...numericValues);
    stats.max = Math.max(...numericValues);
    stats.avg = (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2);
  }

  return stats;
}
