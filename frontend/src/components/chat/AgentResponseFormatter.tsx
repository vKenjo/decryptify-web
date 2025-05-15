import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AgentResponseFormatterProps {
  content: string;
}

// Define proper types for component props
interface ChildrenProps {
  children?: React.ReactNode;
}

interface AnchorProps extends ChildrenProps {
  href?: string;
}

const AgentResponseFormatter: React.FC<AgentResponseFormatterProps> = ({ content }) => {
  // Parse trust score data from content
  const extractTrustScore = (text: string) => {
    const scoreMatch = text.match(/Overall Trust Score:\s*(\d+\.?\d*)\/10/);
    const levelMatch = text.match(/Trust Level:\s*(HIGH|MEDIUM|LOW)/);
    return {
      score: scoreMatch ? parseFloat(scoreMatch[1]) : null,
      level: levelMatch ? levelMatch[1] : null
    };
  };

  const trustData = extractTrustScore(content);

  // Custom components for markdown rendering
  const components = {
    h1: (props: ChildrenProps) => {
      const text = props.children?.toString() || '';
      
      // Special formatting for main headers - simplified
      if (text.includes('DECRYPTIFY') || text.includes('TRUST SCORE')) {
        return <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg mb-6 text-center">{props.children}</h1>;
      }
      
      return <h1 className="text-2xl font-bold mb-4 mt-6 pb-2 border-b border-gray-200 dark:border-gray-700">{props.children}</h1>;
    },
    
    h2: (props: ChildrenProps) => {
      const text = props.children?.toString() || '';
      
      // Simpler header display
      return <h2 className="text-xl font-semibold mb-4 mt-6 border-l-4 border-blue-500 pl-3">{props.children}</h2>;
    },
    
    h3: (props: ChildrenProps) => <h3 className="text-lg font-semibold mb-3 mt-4 text-gray-800 dark:text-gray-200">{props.children}</h3>,
    
    strong: (props: ChildrenProps) => {
      const text = props.children?.toString() || '';
      
      // Trust score display - simplified and fixed
      if (text.includes('Overall Trust Score:')) {
        const match = text.match(/(\d+\.?\d*)\/10/);
        if (match) {
          const score = parseFloat(match[1]);
          const color = score >= 7 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-600';
          return (
            <strong className="block text-center my-4">
              <span className="text-lg font-semibold mb-2 block">Overall Trust Score</span>
              <span className={`text-4xl font-bold ${color} block`}>{score}/10</span>
            </strong>
          );
        }
      }
      
      // Trust level badge - fixed to avoid hydration issues
      if (text.includes('Trust Level:')) {
        const level = text.replace('Trust Level:', '').trim();
        const colorClass = level === 'HIGH' ? 'text-green-800' : level === 'MEDIUM' ? 'text-yellow-800' : 'text-red-800';
        return <strong className={`block text-center mb-4 ${colorClass}`}>Trust Level: {level}</strong>;
      }
      
      return <strong className="font-semibold text-gray-900 dark:text-gray-100">{props.children}</strong>;
    },
    
    ul: (props: ChildrenProps) => <ul className="space-y-2 mb-4">{props.children}</ul>,
    
    li: (props: ChildrenProps) => {
      const text = props.children?.toString() || '';
      
      // Simplified list items
      return (
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>{text}</span>
        </li>
      );
    },
    
    code: (props: { inline?: boolean; children?: React.ReactNode }) => {
      if (props.inline) {
        return <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono">{props.children}</code>;
      }
      return <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4"><code>{props.children}</code></pre>;
    },
    
    a: (props: AnchorProps) => (
      <a 
        href={props.href || '#'}
        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.children}
      </a>
    ),
    
    blockquote: (props: ChildrenProps) => <blockquote className="border-l-4 border-blue-500 pl-4 py-3 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">{props.children}</blockquote>,
    
    hr: () => <hr className="my-6 border-gray-300 dark:border-gray-600" />,
    
    // Paragraphs with simplified styling
    p: (props: ChildrenProps) => {
      const text = props.children?.toString() || '';
      
      // Simplified special sections
      if (text.includes('Key Findings:')) {
        return <p className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4 font-semibold">Key Findings</p>;
      }
      
      if (text.includes('Red Flags Detected:')) {
        return <p className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 font-semibold">Red Flags Detected</p>;
      }
      
      if (text.includes('Recommendation:')) {
        return <p className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4"><span className="font-semibold">Recommendation: </span>{text.replace('Recommendation:', '').trim()}</p>;
      }
      
      // Disclaimer
      if (text.includes('DISCLAIMER') || text.includes('This analysis is for informational')) {
        return <p className="text-xs text-gray-500 dark:text-gray-400 italic border-t pt-4 mt-6">{props.children}</p>;
      }
      
      return <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">{props.children}</p>;
    },
  };

  // Pre-process content - simplified 
  const processContent = (text: string) => {
    // Remove excessive formatting
    return text
      .replace(/\*\*DECRYPTIFY TRUST SCORE REPORT\*\*/g, '# DECRYPTIFY TRUST SCORE REPORT');
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

export default AgentResponseFormatter;
