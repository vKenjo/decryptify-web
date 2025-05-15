import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownFormatterProps {
  content: string;
}

const MarkdownFormatter: React.FC<MarkdownFormatterProps> = ({ content }) => {
  // Custom renderers for different components
  const components = {
    // Headers
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-2xl font-bold mb-4 mt-6 pb-2 border-b border-gray-200 dark:border-gray-700" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-xl font-semibold mb-3 mt-5 flex items-center gap-2" {...props}>
        <span className="w-1 h-5 bg-blue-500 rounded"></span>
        {props.children}
      </h2>
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200" {...props} />
    ),
    
    // Paragraphs
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />
    ),
    
    // Lists
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-none mb-3 space-y-2" {...props} />
    ),
    ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
      <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />
    ),
    li: (props: React.LiHTMLAttributes<HTMLLIElement>) => {
      const text = props.children?.toString() || '';
      
      // Special formatting for different types of list items
      if (text.includes('✅') || text.includes('✓')) {
        return (
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span className="flex-1">{text.replace(/[✅✓]/g, '')}</span>
          </li>
        );
      }
      if (text.includes('❌') || text.includes('✗')) {
        return (
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5">✗</span>
            <span className="flex-1">{text.replace(/[❌✗]/g, '')}</span>
          </li>
        );
      }
      if (text.includes('⚠️')) {
        return (
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">⚠</span>
            <span className="flex-1">{text.replace(/⚠️/g, '')}</span>
          </li>
        );
      }
      
      // Check for metric format (e.g., "• Market Cap: $2T")
      if (text.includes(':')) {
        const [label, value] = text.split(':');
        return (
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span className="flex-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {label.replace(/[•]/g, '')}:
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-semibold">
                {value}
              </span>
            </span>
          </li>
        );
      }
      
      return (
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span className="flex-1">{text.replace(/[•]/g, '')}</span>
        </li>
      );
    },
    
    // Strong emphasis
    strong: (props: React.HTMLAttributes<HTMLElement>) => {
      const text = props.children?.toString() || '';
      
      // Special styling for specific keywords
      if (text.includes('Trust Score:') || text.includes('TRUST SCORE:')) {
        return (
          <div className="text-center my-6">
            <div className="text-2xl font-bold mb-2">Trust Score</div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              {text.replace(/Trust Score:|TRUST SCORE:/g, '').trim()}
            </div>
          </div>
        );
      }
      
      if (text.includes('Trust Level:')) {
        const level = text.replace('Trust Level:', '').trim();
        const colorClass = level === 'HIGH' ? 'text-green-600' : 
                          level === 'MEDIUM' ? 'text-yellow-600' : 
                          'text-red-600';
        return (
          <div className="text-center mb-4">
            <span className="font-semibold">Trust Level: </span>
            <span className={`font-bold ${colorClass}`}>{level}</span>
          </div>
        );
      }
      
      return <strong className="font-semibold text-gray-900 dark:text-gray-100">{props.children}</strong>;
    },
    
    // Blockquotes
    blockquote: (props: React.BlockquoteHTMLAttributes<HTMLElement>) => (
      <div className="border-l-4 border-blue-500 pl-4 py-2 mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg" {...props} />
    ),
    
    // Code
    code: (props: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
      if (props.inline) {
        return (
          <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono">
            {props.children}
          </code>
        );
      }
      return (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
          <code>{props.children}</code>
        </div>
      );
    },
    
    // Horizontal rule
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-6 border-gray-300 dark:border-gray-600" {...props} />,
    
    // Links
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a 
        {...props}
        className={"text-blue-600 dark:text-blue-400 hover:underline " + (props.className || "")}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.children}
      </a>
    ),
  };

  // Pre-process content for special formatting
  const processContent = (text: string) => {
    // Convert emoji indicators to icons
    let processed = text
      .replace(/🟢/g, '<span class="text-green-500">●</span>')
      .replace(/🟡/g, '<span class="text-yellow-500">●</span>')
      .replace(/🔴/g, '<span class="text-red-500">●</span>')
      .replace(/🏆/g, '🏆')
      .replace(/💰/g, '💰')
      .replace(/📊/g, '📊')
      .replace(/📈/g, '📈')
      .replace(/🚨/g, '🚨');
    
    // Add special formatting for sections
    processed = processed
      .replace(/\*\*Key Findings:\*\*/g, '**✨ Key Findings:**')
      .replace(/\*\*Red Flags Detected:\*\*/g, '**🚩 Red Flags Detected:**')
      .replace(/\*\*Recommendation:\*\*/g, '**💡 Recommendation:**')
      .replace(/\*\*Investment Guidance:\*\*/g, '**📋 Investment Guidance:**');
    
    return processed;
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {processContent(content)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownFormatter;
