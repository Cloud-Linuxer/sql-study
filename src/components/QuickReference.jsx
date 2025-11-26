import { useState } from 'react';

export default function QuickReference() {
  const [expanded, setExpanded] = useState(false);

  const mainColumns = [
    { name: '상호명', icon: '🏪' },
    { name: '상권업종대분류명', icon: '📦' },
    { name: '시군구명', icon: '📍' },
    { name: '행정동명', icon: '🏘️' }
  ];

  const sqlCommands = [
    { cmd: 'SELECT', icon: '🔍' },
    { cmd: 'WHERE', icon: '🎯' },
    { cmd: 'GROUP BY', icon: '📊' },
    { cmd: 'ORDER BY', icon: '🔀' },
    { cmd: 'LIMIT', icon: '✂️' },
    { cmd: 'COUNT(*)', icon: '🔢' }
  ];

  return (
    <div className="card">
      <div
        className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">💡 빠른 참조</span>
          <span className="text-xs text-gray-500">(컬럼명 & SQL 명령어)</span>
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
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-3">
            {/* Columns */}
            <div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">주요 컬럼</div>
              <div className="flex flex-wrap gap-1">
                {mainColumns.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigator.clipboard.writeText(col.name);
                    }}
                    className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-mono"
                    title={`클릭하여 "${col.name}" 복사`}
                  >
                    {col.icon} {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Commands */}
            <div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">SQL 명령어</div>
              <div className="flex flex-wrap gap-1">
                {sqlCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigator.clipboard.writeText(cmd.cmd);
                    }}
                    className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors font-mono"
                    title={`클릭하여 "${cmd.cmd}" 복사`}
                  >
                    {cmd.icon} {cmd.cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
            💡 <strong>Tip:</strong> 에디터에서 타이핑하면 자동완성 팝업이 나타납니다 (Tab으로 선택)
          </div>
        </div>
      )}
    </div>
  );
}
