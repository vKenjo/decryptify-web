import React from 'react';
import AgentResponseFormatter from './AgentResponseFormatter';

export type MessageRole = 'user' | 'assistant';

interface ChatMessageProps {
  role: MessageRole;
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 p-6 w-full ${
      isUser 
        ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800' 
        : 'bg-white dark:bg-gray-800'
    } rounded-lg shadow-sm mb-2`}>
      {/* User/Assistant indicator */}
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-md ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
        }`}>
          {isUser ? 'U' : 'D'}
        </div>
      </div>

      {/* Message content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {isUser ? 'You' : 'DeCryptify Assistant'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={`${isUser ? 'text-gray-900 dark:text-gray-100' : 'text-gray-800 dark:text-gray-200'}`}>
          {isUser ? (
            <p className="text-base leading-relaxed">{content}</p>
          ) : (
            <AgentResponseFormatter content={content} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
