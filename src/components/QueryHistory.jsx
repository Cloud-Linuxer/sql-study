import { useState } from 'react';
import { formatExecutionTime, formatNumber } from '../utils/sqlHelpers';

export default function QueryHistory({ history, onLoadQuery, onRemove, onClear }) {
  const [expanded, setExpanded] = useState(true);

  if (!history || history.length === 0) {
    return (
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
          <span className="font-semibold text-gray-700 dark:text-gray-200">히스토리</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          실행한 쿼리가 여기에 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="card flex flex-col max-h-[calc(100vh-140px)]">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
          <span className="font-semibold text-gray-700 dark:text-gray-200">히스토리</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({history.length})
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-red-600 dark:text-red-400 hover:underline"
        >
          전체 삭제
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {history.map((item, idx) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
              onClick={() => onLoadQuery(item.query)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {new Date(item.timestamp).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  <div className="text-sm font-mono text-gray-700 dark:text-gray-300 line-clamp-3 mb-2">
                    {item.query}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatNumber(item.rowCount)}행</span>
                    <span>•</span>
                    <span>{formatExecutionTime(item.executionTime)}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                >
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
