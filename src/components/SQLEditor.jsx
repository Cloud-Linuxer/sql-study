import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function SQLEditor({ value, onChange, onExecute, darkMode }) {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // Add Ctrl+Enter keybinding
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecute();
    });

    // Configure SQL language
    monaco.languages.setLanguageConfiguration('sql', {
      comments: {
        lineComment: '--',
        blockComment: ['/*', '*/']
      },
      brackets: [
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '(', close: ')' },
        { open: "'", close: "'" },
        { open: '"', close: '"' }
      ]
    });

    // Register custom autocomplete provider
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        // Korean column names
        const columnSuggestions = [
          '상가업소번호', '상호명', '지점명',
          '상권업종대분류코드', '상권업종대분류명',
          '상권업종중분류코드', '상권업종중분류명',
          '상권업종소분류코드', '상권업종소분류명',
          '표준산업분류코드', '표준산업분류명',
          '시도코드', '시도명', '시군구코드', '시군구명',
          '행정동코드', '행정동명', '법정동코드', '법정동명',
          '지번코드', '대지구분코드', '대지구분명',
          '지번본번지', '지번부번지', '지번주소',
          '도로명코드', '도로명', '건물본번지', '건물부번지',
          '건물관리번호', '건물명', '도로명주소',
          '구우편번호', '신우편번호', '동정보', '층정보', '호정보',
          '경도', '위도'
        ].map(col => ({
          label: col,
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: col,
          range: range,
          detail: '컬럼'
        }));

        // SQL Keywords
        const keywordSuggestions = [
          { label: 'SELECT', detail: '데이터 조회' },
          { label: 'FROM', detail: '테이블 지정' },
          { label: 'WHERE', detail: '조건 필터' },
          { label: 'GROUP BY', detail: '그룹화' },
          { label: 'ORDER BY', detail: '정렬' },
          { label: 'HAVING', detail: '그룹 필터' },
          { label: 'LIMIT', detail: '개수 제한' },
          { label: 'COUNT(*)', detail: '개수 세기' },
          { label: 'COUNT(DISTINCT ', detail: '중복 제거 개수' },
          { label: 'SUM(', detail: '합계' },
          { label: 'AVG(', detail: '평균' },
          { label: 'MIN(', detail: '최소값' },
          { label: 'MAX(', detail: '최대값' },
          { label: 'DISTINCT', detail: '중복 제거' },
          { label: 'AS', detail: '별칭' },
          { label: 'AND', detail: '그리고' },
          { label: 'OR', detail: '또는' },
          { label: 'LIKE', detail: '패턴 검색' },
          { label: 'IN', detail: '포함' },
          { label: 'BETWEEN', detail: '범위' },
          { label: 'IS NULL', detail: '빈 값' },
          { label: 'IS NOT NULL', detail: '값 있음' },
          { label: 'WITH', detail: 'CTE 시작' },
          { label: 'ROW_NUMBER() OVER', detail: '행 번호' },
          { label: 'RANK() OVER', detail: '순위' },
          { label: 'PARTITION BY', detail: '그룹별 분할' }
        ].map(kw => ({
          label: kw.label,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw.label,
          range: range,
          detail: kw.detail
        }));

        // Table name
        const tableSuggestions = [{
          label: 'stores',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'stores',
          range: range,
          detail: '테이블 (536,115건)'
        }];

        return {
          suggestions: [...columnSuggestions, ...keywordSuggestions, ...tableSuggestions]
        };
      }
    });
  }

  return (
    <div className="card flex flex-col h-[40vh]">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
          <span className="font-semibold text-gray-700 dark:text-gray-200">SQL Editor</span>
        </div>
        <button
          onClick={onExecute}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
          </svg>
          실행 (Ctrl+Enter)
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          theme={darkMode ? 'vs-dark' : 'vs-light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true }
          }}
        />
      </div>
    </div>
  );
}
