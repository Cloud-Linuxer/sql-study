import { useState, useEffect } from 'react';
import { quizProblems, learningPath } from '../data/quizProblems';
import { validateAnswer, getHint, calculateProgress, getNextProblem } from '../utils/quizValidator';
import TutorialContent from './TutorialContent';
import QuickReference from './QuickReference';

export default function QuizMode({ executeQuery, onLoadQuery }) {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [result, setResult] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quiz_progress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        setSolvedProblems(progress.solved || []);
      } catch (err) {
        console.error('Failed to load progress:', err);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('quiz_progress', JSON.stringify({
      solved: solvedProblems,
      lastUpdated: new Date().toISOString()
    }));
  }, [solvedProblems]);

  // Load first problem of selected level
  useEffect(() => {
    const levelProblems = quizProblems.filter(p => p.level === selectedLevel);
    const solvedIds = solvedProblems.map(p => p.id);
    const nextProblem = getNextProblem(solvedIds, levelProblems);

    if (nextProblem) {
      setCurrentProblem(nextProblem);
      setUserAnswer('');
      setHintLevel(0);
      setShowTutorial(true);
      setResult(null);
    } else {
      setCurrentProblem(levelProblems[0] || null);
    }
  }, [selectedLevel, solvedProblems]);

  const handleSubmit = async () => {
    if (!userAnswer.trim() || !currentProblem) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const validationResult = await validateAnswer(userAnswer, currentProblem, executeQuery);

      setResult(validationResult);

      if (validationResult.isCorrect && !solvedProblems.find(p => p.id === currentProblem.id)) {
        setSolvedProblems(prev => [
          ...prev,
          {
            id: currentProblem.id,
            level: currentProblem.level,
            score: validationResult.score,
            solvedAt: new Date().toISOString(),
            executionTime: validationResult.executionTime
          }
        ]);
      }
    } catch (err) {
      setResult({
        isCorrect: false,
        score: 0,
        feedback: `오류: ${err.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowHint = () => {
    const hint = getHint(currentProblem, hintLevel);
    if (hint) {
      setHintLevel(prev => prev + 1);
    }
  };

  const handleShowAnswer = () => {
    onLoadQuery(currentProblem.answer);
    setUserAnswer(currentProblem.answer);
  };

  const handleNextProblem = () => {
    const levelProblems = quizProblems.filter(p => p.level === selectedLevel);
    const currentIndex = levelProblems.findIndex(p => p.id === currentProblem.id);
    const nextInLevel = levelProblems[currentIndex + 1];

    // Clear current state
    setUserAnswer('');
    setHintLevel(0);
    setShowTutorial(true);
    setResult(null);

    if (nextInLevel) {
      // Next problem in same level
      setCurrentProblem(nextInLevel);
    } else {
      // Last problem in this level - move to next level
      if (selectedLevel < 5) {
        const nextLevelProblems = quizProblems.filter(p => p.level === selectedLevel + 1);
        if (nextLevelProblems.length > 0) {
          setSelectedLevel(selectedLevel + 1);
          // Don't set currentProblem here - let useEffect handle it
        }
      } else {
        // Already at max level, loop back to first problem
        setCurrentProblem(levelProblems[0]);
      }
    }
  };

  const progress = calculateProgress(solvedProblems, quizProblems);
  const levelProgress = calculateProgress(
    solvedProblems.filter(p => p.level === selectedLevel),
    quizProblems.filter(p => p.level === selectedLevel)
  );

  if (!currentProblem) {
    return (
      <div className="card p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">축하합니다!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            이 레벨의 모든 문제를 풀었습니다!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 h-full overflow-y-auto">
      {/* Level Selector - Vertical List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400">학습 단계</h3>
          <div className="text-xs text-gray-500">
            <span className="text-naver-green font-bold">{progress.solved}</span>/{progress.total}
          </div>
        </div>

        <div className="space-y-1.5">
          {learningPath.map(path => {
            const levelSolved = solvedProblems.filter(p => p.level === path.level).length;
            const levelTotal = quizProblems.filter(p => p.level === path.level).length;

            return (
              <button
                key={path.level}
                onClick={() => setSelectedLevel(path.level)}
                className={`w-full px-3 py-2 rounded-lg transition-all text-left ${
                  selectedLevel === path.level
                    ? 'bg-naver-green text-white shadow-md'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{path.icon}</span>
                    <div className="font-medium text-xs">
                      {path.name.replace('입문: ', '').replace('초급: ', '').replace('중급: ', '').replace('고급: ', '').replace('마스터: ', '')}
                    </div>
                  </div>
                  <div className="text-xs opacity-75">
                    {levelSolved}/{levelTotal}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Problem */}
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{learningPath[selectedLevel - 1].icon}</span>
                <h3 className="font-bold text-lg">{currentProblem.title}</h3>
                <span className="text-xs px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                  {currentProblem.points}점
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentProblem.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tutorial Section */}
        {showTutorial && currentProblem.tutorial && (
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300">📚 학습 가이드</h4>
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    숨기기
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
                  <TutorialContent content={currentProblem.tutorial} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hint Section */}
        {hintLevel > 0 && (
          <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">💡 힌트 {hintLevel}</h4>
                {Array.from({ length: hintLevel }).map((_, idx) => (
                  <div key={idx} className="text-sm text-yellow-800 dark:text-yellow-300 mb-1 font-mono">
                    {idx + 1}. {currentProblem.hints[idx]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className={`px-4 py-3 ${
            result.isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-2">
              {result.isCorrect ? (
                <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              )}
              <div className="flex-1">
                <h4 className={`font-bold mb-1 ${
                  result.isCorrect ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                }`}>
                  {result.isCorrect ? '✅ 정답입니다!' : '❌ 다시 시도해보세요'}
                </h4>
                <p className={`text-sm ${
                  result.isCorrect ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
                }`}>
                  {result.feedback}
                </p>
                {result.isCorrect && (
                  <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                    <span className="font-bold">+{result.score}점</span> 획득!
                    {result.executionTime && (
                      <span className="ml-2 text-xs">
                        (실행시간: {result.executionTime.toFixed(2)}ms)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || isSubmitting}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                채점 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                답안 제출 및 채점
              </>
            )}
          </button>

          <button
            onClick={() => onLoadQuery(userAnswer)}
            disabled={!userAnswer.trim()}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
            </svg>
            에디터에서 실행
          </button>

          {!showTutorial && (
            <button
              onClick={() => setShowTutorial(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              학습 가이드 보기
            </button>
          )}

          {hintLevel < (currentProblem.hints?.length || 0) && (
            <button
              onClick={handleShowHint}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
              </svg>
              힌트 보기 ({hintLevel}/{currentProblem.hints?.length})
            </button>
          )}

          <button
            onClick={handleShowAnswer}
            className="btn-secondary flex items-center gap-2 text-orange-600 dark:text-orange-400"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
            정답 보기
          </button>

          {result?.isCorrect && (
            <button
              onClick={handleNextProblem}
              className="btn-primary flex items-center gap-2 ml-auto"
            >
              다음 문제
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
        </div>

        {/* Progress for current level */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              {learningPath[selectedLevel - 1].name} 진행률
            </span>
            <span className="font-semibold text-naver-green">
              {levelProgress.solved}/{levelProgress.total} ({levelProgress.percentage}%)
            </span>
          </div>
          <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-naver-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${levelProgress.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Answer Input */}
        <div className="p-4">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            여기에 SQL 쿼리를 작성하세요:
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-naver-green focus:border-transparent"
            placeholder="SELECT ... FROM stores ..."
          />
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <span>작성한 쿼리는 에디터로 전송되어 실행할 수 있습니다</span>
          </div>
        </div>
      </div>

      {/* Total Score */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">총 점수</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              현재까지 획득한 점수
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-naver-green">
              {progress.score}
            </div>
            <div className="text-xs text-gray-500">
              / {progress.maxScore}점
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
