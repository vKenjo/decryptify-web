import React from 'react';

export type MessageRole = 'user' | 'assistant';

interface ChatMessageProps {
  content: string;
  role: MessageRole;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role }) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      {role === 'assistant' ? (        <div className="chatbox max-w-[80%] bg-white dark:bg-gray-800/90 rounded-2xl px-6 py-4 shadow-md border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/70 flex items-center justify-center mr-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#3B82F6" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Cryptify Assistant</h3>
          </div>
          <div className="pl-10">
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{content}</p>
          </div>
        </div>      ) : (        <div className="chatbox max-w-[75%] bg-blue-50 dark:bg-blue-900/30 rounded-2xl px-5 py-4 shadow-md border border-blue-100 dark:border-blue-800/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">You</h3>
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#3B82F6" />
              </svg>
            </div>
          </div>
          <p className="text-gray-800 dark:text-blue-100 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
