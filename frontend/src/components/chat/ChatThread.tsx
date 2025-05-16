import React from 'react';
import ChatMessage, { MessageRole } from './ChatMessage';

interface Message {
  id: string;
  content: string;
  role: MessageRole;
}

interface ChatThreadProps {
  messages: Message[];
  isWelcomeVisible?: boolean;
  isTyping?: boolean;
}

const ChatThread: React.FC<ChatThreadProps> = ({ 
  messages, 
  isWelcomeVisible = true, 
  isTyping = false 
}) => {
  // Special component for the project verification card
  const ProjectVerificationCard = () => (
    <div className="project-verification bg-white dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-4 shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
      <div className="flex items-center mb-2">
        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/70 rounded-full flex items-center justify-center mr-2">
          <svg className="w-4 h-4 text-blue-500 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Project Credibility Verification</h3>
      </div>
      
      <p className="mb-3">Project Name: NeonChain</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            Trust Score 
            <span className="ml-1 w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-800/60 text-blue-500 dark:text-blue-300 flex items-center justify-center text-xs">i</span>
          </p>
          <p className="font-medium text-gray-800 dark:text-gray-200">80%</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 flex items-center">
            Created
            <span className="ml-1 w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs">i</span>
          </p>
          <p className="font-medium">2 days</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 flex items-center">
            Volume
            <span className="ml-1 w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs">i</span>
          </p>
          <p className="font-medium">170.87k</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 flex items-center">
            Liquidity
            <span className="ml-1 w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs">i</span>
          </p>
          <p className="font-medium">548.99k</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 flex items-center mb-1">
          T.M. Cap
          <span className="ml-1 w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs">i</span>
        </p>
        <p className="font-medium">48.68M</p>
      </div>
      
      <p className="mb-2"><span className="font-medium">Founder:</span> Sophia Reyes</p>
      
      <div className="mt-4">
        <p className="font-medium mb-1">Verdict:</p>
        <p>NeonChain shows strong liquidity and market engagement, but its volatility suggests a high-risk investment. Investors should review community engagement and ongoing development before committing.</p>
      </div>
    </div>
  );
    // Custom message component to handle special message types
  const MessageWithContent = ({ message }: { message: Message }) => {
    if (message.role === 'assistant' && message.content.includes("What's the trust score for NeonChain?")) {
      return (
        <div className="mb-6">
          <ChatMessage content={message.content} role={message.role} />
          <div className="mt-4 ml-12">
            <ProjectVerificationCard />
          </div>
        </div>
      );
    }
    
    return <ChatMessage content={message.content} role={message.role} />;
  };  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-center transform transition-all duration-500 ease-out ${
            isWelcomeVisible ? 'animate-fadeIn' : 'animate-fadeOut'
          }`}>
            <div className="mb-6 mx-auto w-16 h-16 bg-gradient-to-r from-blue-400 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-300/20 animate-bubble">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent mb-3">
              Welcome to DeCryptify
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Confidence in Crypto Starts with Trust
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-w-4xl mx-auto pt-4 w-full">
          {messages.map((message, index) => (
            <div 
              key={message.id} 
              className={`message-container animate-fadeIn`}
              style={{ 
                animationDelay: `${index * 50}ms`,
              }}
            >
              <MessageWithContent message={message} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatThread;
