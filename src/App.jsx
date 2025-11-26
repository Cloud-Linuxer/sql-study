import { useState, useEffect } from 'react';
import Header from './components/Header';
import SQLEditor from './components/SQLEditor';
import ResultTable from './components/ResultTable';
import SchemaViewerAPI from './components/SchemaViewerAPI';
import ExampleQueries from './components/ExampleQueries';
import QueryHistory from './components/QueryHistory';
import QuizMode from './components/QuizMode';
import QuickReference from './components/QuickReference';
import useDatabaseAPI from './hooks/useDatabaseAPI';
import useQueryHistory from './hooks/useQueryHistory';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState('quiz'); // 'practice' or 'quiz'
  const [query, setQuery] = useState('SELECT * FROM stores LIMIT 10;');
  const { db, loading, error: dbError, executeQuery, schema } = useDatabaseAPI();
  const { history, addToHistory, removeFromHistory, clearHistory } = useQueryHistory();
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleExecuteQuery = async () => {
    if (!db || !query.trim()) return;

    try {
      setQueryError(null);
      const result = await executeQuery(query);
      setQueryResult(result);
      addToHistory(query, result);
    } catch (error) {
      setQueryError(error.message);
      setQueryResult(null);
    }
  };

  const handleLoadQuery = (savedQuery) => {
    setQuery(savedQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-naver-green mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">데이터베이스 초기화 중...</p>
          </div>
        </div>
      )}

      {dbError && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400">데이터베이스 초기화 오류: {dbError}</p>
          </div>
        </div>
      )}

      {!loading && !dbError && (
        <div className="max-w-[1920px] mx-auto px-4 py-6">
          {/* Mode Tabs */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => setMode('quiz')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'quiz'
                  ? 'bg-naver-green text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-naver-green'
              }`}
            >
              🎓 학습 모드 (단계별 문제풀이)
            </button>
            <button
              onClick={() => setMode('practice')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'practice'
                  ? 'bg-naver-green text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-naver-green'
              }`}
            >
              💻 연습 모드 (자유 쿼리)
            </button>
          </div>

          {/* Quiz Mode */}
          {mode === 'quiz' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4 h-[calc(100vh-200px)] overflow-y-auto">
                <QuizMode executeQuery={executeQuery} onLoadQuery={handleLoadQuery} />
              </div>

              <div className="col-span-8 flex flex-col gap-4">
                <QuickReference />
                <SQLEditor
                  value={query}
                  onChange={setQuery}
                  onExecute={handleExecuteQuery}
                  darkMode={darkMode}
                />
                <ResultTable
                  result={queryResult}
                  error={queryError}
                />
              </div>
            </div>
          )}

          {/* Practice Mode */}
          {mode === 'practice' && (
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
              {/* Left Panel - Schema & Examples */}
              <div className="col-span-3 flex flex-col gap-6 overflow-y-auto">
                <SchemaViewerAPI schema={schema} />
                <ExampleQueries onLoadQuery={handleLoadQuery} />
              </div>

              {/* Center Panel - SQL Editor */}
              <div className="col-span-6 flex flex-col gap-4">
                <SQLEditor
                  value={query}
                  onChange={setQuery}
                  onExecute={handleExecuteQuery}
                  darkMode={darkMode}
                />
                <ResultTable
                  result={queryResult}
                  error={queryError}
                />
              </div>

              {/* Right Panel - Query History */}
              <div className="col-span-3 overflow-y-auto">
                <QueryHistory
                  history={history}
                  onLoadQuery={handleLoadQuery}
                  onRemove={removeFromHistory}
                  onClear={clearHistory}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
