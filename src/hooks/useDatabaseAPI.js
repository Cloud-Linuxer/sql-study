import { useState, useEffect, useCallback } from 'react';

const API_URL = '/api';

export default function useDatabaseAPI() {
  const [db, setDb] = useState(true); // Just a flag to indicate API is available
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    async function loadSchema() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/schema`);

        if (!response.ok) {
          throw new Error('Failed to fetch schema');
        }

        const schemaData = await response.json();
        setSchema(schemaData);
        setDb(true);
        setLoading(false);

        console.log('✅ Connected to MySQL API');
        console.log(`📊 Total rows: ${schemaData.rowCount}`);
      } catch (err) {
        console.error('API connection error:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    loadSchema();
  }, []);

  const executeQuery = useCallback(async (query) => {
    if (!db) {
      throw new Error('데이터베이스가 초기화되지 않았습니다.');
    }

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Convert to expected format
      const rows = result.data;
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

      return {
        columns,
        rows,
        rowCount: result.rowCount,
        executionTime: result.executionTime
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }, [db]);

  const getTableInfo = useCallback(() => {
    return schema?.columns || null;
  }, [schema]);

  const getSampleData = useCallback(async (columnName, limit = 5) => {
    if (!db) return [];

    try {
      const response = await fetch(`${API_URL}/sample/${encodeURIComponent(columnName)}`);

      if (!response.ok) {
        return [];
      }

      return await response.json();
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
