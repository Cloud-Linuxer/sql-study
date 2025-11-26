export default function TutorialContent({ content }) {
  // Parse simple markdown-like syntax
  const parseContent = (text) => {
    const lines = text.trim().split('\n');
    const elements = [];
    let currentCodeBlock = null;
    let codeLines = [];

    lines.forEach((line, idx) => {
      // Code block detection
      if (line.trim().startsWith('```')) {
        if (currentCodeBlock === null) {
          currentCodeBlock = line.trim().slice(3); // Language
        } else {
          // End code block
          elements.push({
            type: 'code',
            content: codeLines.join('\n'),
            language: currentCodeBlock
          });
          currentCodeBlock = null;
          codeLines = [];
        }
        return;
      }

      if (currentCodeBlock !== null) {
        codeLines.push(line);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push({
          type: 'h1',
          content: line.slice(2)
        });
      } else if (line.startsWith('## ')) {
        elements.push({
          type: 'h2',
          content: line.slice(3)
        });
      } else if (line.startsWith('- ')) {
        elements.push({
          type: 'li',
          content: line.slice(2)
        });
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push({
          type: 'bold',
          content: line.slice(2, -2)
        });
      } else if (line.trim() === '') {
        elements.push({
          type: 'br'
        });
      } else {
        elements.push({
          type: 'text',
          content: line
        });
      }
    });

    return elements;
  };

  const formatInlineCode = (text) => {
    if (!text) return text;

    const parts = [];
    let current = '';
    let i = 0;

    while (i < text.length) {
      // Check for `code`
      if (text[i] === '`') {
        if (current) {
          parts.push({ type: 'text', content: current });
          current = '';
        }
        i++;
        let code = '';
        while (i < text.length && text[i] !== '`') {
          code += text[i];
          i++;
        }
        parts.push({ type: 'code', content: code });
        i++;
      }
      // Check for **bold**
      else if (text[i] === '*' && text[i + 1] === '*') {
        if (current) {
          parts.push({ type: 'text', content: current });
          current = '';
        }
        i += 2;
        let bold = '';
        while (i < text.length - 1 && !(text[i] === '*' && text[i + 1] === '*')) {
          bold += text[i];
          i++;
        }
        if (text[i] === '*' && text[i + 1] === '*') {
          parts.push({ type: 'bold', content: bold });
          i += 2;
        } else {
          current += '**' + bold;
        }
      } else {
        current += text[i];
        i++;
      }
    }

    if (current) {
      parts.push({ type: 'text', content: current });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-pink-600 dark:text-pink-400 rounded text-xs font-mono"
          >
            {part.content}
          </code>
        );
      } else if (part.type === 'bold') {
        return (
          <strong key={idx} className="font-bold text-blue-900 dark:text-blue-200">
            {part.content}
          </strong>
        );
      } else {
        return part.content;
      }
    });
  };

  const elements = parseContent(content);

  return (
    <div className="space-y-2">
      {elements.map((el, idx) => {
        switch (el.type) {
          case 'h1':
            return (
              <h3 key={idx} className="text-base font-bold text-blue-900 dark:text-blue-200 mt-3 mb-2">
                {formatInlineCode(el.content)}
              </h3>
            );

          case 'h2':
            return (
              <h4 key={idx} className="text-sm font-semibold text-blue-800 dark:text-blue-300 mt-2 mb-1">
                {formatInlineCode(el.content)}
              </h4>
            );

          case 'code':
            return (
              <div key={idx} className="overflow-x-auto">
                <pre className="bg-gray-900 dark:bg-black text-green-400 p-3 rounded-lg text-xs font-mono border border-gray-700 whitespace-pre-wrap break-all">
                  {el.content}
                </pre>
              </div>
            );

          case 'li':
            return (
              <div key={idx} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>{formatInlineCode(el.content)}</span>
              </div>
            );

          case 'bold':
            return (
              <div key={idx} className="font-bold text-sm text-blue-900 dark:text-blue-200">
                {formatInlineCode(el.content)}
              </div>
            );

          case 'br':
            return <div key={idx} className="h-2"></div>;

          case 'text':
            return (
              <div key={idx} className="text-sm text-blue-800 dark:text-blue-300">
                {formatInlineCode(el.content)}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
