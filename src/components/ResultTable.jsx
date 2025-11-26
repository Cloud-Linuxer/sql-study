import { useState, useMemo } from 'react';
import { formatExecutionTime, formatNumber, downloadCSV } from '../utils/sqlHelpers';

export default function ResultTable({ result, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  const paginatedRows = useMemo(() => {
    if (!result?.rows) return [];

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return result.rows.slice(startIndex, endIndex);
  }, [result, currentPage]);

  const totalPages = useMemo(() => {
    if (!result?.rows) return 0;
    return Math.ceil(result.rows.length / rowsPerPage);
  }, [result]);

  const handleDownload = () => {
    if (result?.rows && result.rows.length > 0) {
      downloadCSV(result.rows, `query_result_${Date.now()}.csv`);
    }
  };

  if (error) {
    return (
      <div className="card p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">쿼리 실행 오류</h3>
              <p className="text-sm text-red-700 dark:text-red-400 font-mono">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card p-12">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p className="text-lg font-medium">쿼리를 실행하면 결과가 여기에 표시됩니다</p>
          <p className="text-sm mt-2">Ctrl+Enter를 눌러 쿼리를 실행하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex flex-col h-[calc(60vh-120px)]">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-naver-green">{formatNumber(result.rowCount)}</span>행 반환
          </span>
          <span className="text-gray-400 dark:text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-300">
            실행시간: <span className="font-mono font-semibold">{formatExecutionTime(result.executionTime)}</span>
          </span>
        </div>

        {result.rows.length > 0 && (
          <button
            onClick={handleDownload}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            CSV 다운로드
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {result.rows.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>결과가 없습니다</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                  #
                </th>
                {result.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400 font-mono text-xs">
                    {(currentPage - 1) * rowsPerPage + rowIdx + 1}
                  </td>
                  {result.columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 max-w-xs truncate"
                      title={String(row[col] ?? '')}
                    >
                      {row[col] === null || row[col] === undefined ? (
                        <span className="text-gray-400 dark:text-gray-500 italic">NULL</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            페이지 {currentPage} / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              처음
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              이전
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              다음
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              마지막
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
