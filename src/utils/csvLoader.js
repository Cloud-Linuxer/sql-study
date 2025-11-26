import Papa from 'papaparse';

/**
 * Load and parse CSV file
 * @param {string} url - URL to CSV file
 * @returns {Promise<Array>} Parsed CSV data
 */
export async function loadCSV(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const text = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  } catch (error) {
    throw new Error(`CSV loading error: ${error.message}`);
  }
}

/**
 * Infer SQL data type from value
 * @param {*} value - Value to check
 * @returns {string} SQL data type
 */
export function inferDataType(value) {
  if (value === null || value === undefined || value === '') {
    return 'TEXT';
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'INTEGER' : 'REAL';
  }

  return 'TEXT';
}

/**
 * Analyze column types from data sample
 * @param {Array} data - Array of data objects
 * @param {number} sampleSize - Number of rows to sample
 * @returns {Object} Column types map
 */
export function analyzeColumnTypes(data, sampleSize = 100) {
  if (!data || data.length === 0) {
    return {};
  }

  const sample = data.slice(0, Math.min(sampleSize, data.length));
  const columns = Object.keys(data[0]);
  const columnTypes = {};

  columns.forEach(column => {
    const types = new Set();

    sample.forEach(row => {
      const type = inferDataType(row[column]);
      types.add(type);
    });

    // If mixed types, default to TEXT
    if (types.size > 1 || types.has('TEXT')) {
      columnTypes[column] = 'TEXT';
    } else {
      columnTypes[column] = Array.from(types)[0];
    }
  });

  return columnTypes;
}

/**
 * Escape SQL identifier (table/column name)
 * @param {string} identifier - Identifier to escape
 * @returns {string} Escaped identifier
 */
export function escapeIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`;
}

/**
 * Escape SQL string value
 * @param {*} value - Value to escape
 * @returns {string} Escaped value
 */
export function escapeValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}
