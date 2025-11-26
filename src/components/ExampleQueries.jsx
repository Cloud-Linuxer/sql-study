import { useState } from 'react';
import { exampleQueries, queryCategories, difficultyColors } from '../data/exampleQueries';

export default function ExampleQueries({ onLoadQuery }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const filteredQueries = selectedCategory
    ? exampleQueries.filter(q => q.category === selectedCategory)
    : exampleQueries;

  return (
    <div className="card flex flex-col max-h-[calc(50vh-24px)]">
      <div
        className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
          </svg>
          <span className="font-semibold text-gray-700 dark:text-gray-200">예제 쿼리</span>
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
        <>
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-naver-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                전체
              </button>
              {queryCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-naver-green text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Level {cat.id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              {filteredQueries.map(example => (
                <div
                  key={example.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => onLoadQuery(example.query)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {example.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${difficultyColors[example.difficulty]}`}>
                          {example.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {example.category}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {example.description}
                      </p>

                      <div className="text-xs font-mono text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 rounded p-2 line-clamp-2">
                        {example.query}
                      </div>
                    </div>

                    <button className="ml-2 p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"/>
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
