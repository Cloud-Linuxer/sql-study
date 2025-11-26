import { useState, useEffect } from 'react';

export default function SchemaViewer({ db }) {
  const [schema, setSchema] = useState(null);
  const [sampleData, setSampleData] = useState({});
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!db) return;

    try {
      // Get table schema
      const result = db.exec(`
        SELECT name, type
        FROM pragma_table_info('stores')
        ORDER BY cid
      `);

      if (result.length > 0) {
        const columns = result[0].values.map(row => ({
          name: row[0],
          type: row[1]
        }));

        setSchema({ tableName: 'stores', columns });

        // Get sample data for first few columns
        const samples = {};
        columns.slice(0, 10).forEach(col => {
          try {
            const sampleResult = db.exec(`
              SELECT DISTINCT "${col.name}"
              FROM stores
              WHERE "${col.name}" IS NOT NULL
              LIMIT 3
            `);

            if (sampleResult.length > 0) {
              samples[col.name] = sampleResult[0].values.map(v => v[0]);
            }
          } catch (err) {
            console.warn(`Failed to get sample for ${col.name}:`, err);
          }
        });

        setSampleData(samples);
      }
    } catch (err) {
      console.error('Failed to load schema:', err);
    }
  }, [db]);

  if (!schema) {
    return (
      <div className="card p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex flex-col max-h-[calc(50vh-24px)]">
      <div
        className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
          <span className="font-semibold text-gray-700 dark:text-gray-200">스키마</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
      </div>

      {expanded && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                {schema.tableName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({schema.columns.length} 컬럼)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {schema.columns.map((col, idx) => (
              <div
                key={idx}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200">
                        {col.name}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-mono">
                        {col.type}
                      </span>
                    </div>

                    {sampleData[col.name] && sampleData[col.name].length > 0 && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">샘플:</span>
                        <div className="mt-1 space-y-0.5">
                          {sampleData[col.name].map((sample, sIdx) => (
                            <div key={sIdx} className="font-mono truncate" title={String(sample)}>
                              • {String(sample)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
