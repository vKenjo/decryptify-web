import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing = false, onTyping }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // When message changes, notify parent if user is typing
    if (onTyping) {
      onTyping(message.length > 0);
    }
  }, [message, onTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage('');
    }
  };  return (
    // TODO: change here to change size; pwede din gawin sticky-bottom later 
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto mb-22">   
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isProcessing ? "Processing response..." : "Ask me about crypto projects"}        className={`w-full py-3 px-4 pr-14 rounded-full border border-gray-200/70 dark:border-gray-700/50 ${
          isProcessing ? 'bg-gray-50/95 dark:bg-gray-800/80' : 'bg-white/95 dark:bg-gray-800/70'
        } focus:outline-none focus:ring-2 focus:ring-primary-purple dark:focus:ring-primary-lightPurple shadow-[0_2px_6px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-300 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400`}
        disabled={isProcessing}
      />      
      <button
        type="submit"
        disabled={isProcessing}        className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 ${
          isProcessing 
            ? 'bg-gradient-to-r from-blue-300 to-violet-400 dark:from-blue-500 dark:to-violet-500' 
            : 'bg-gradient-to-r from-primary-purple to-primary-mediumBlue hover:scale-105 dark:from-[#9e6bd2] dark:to-[#6490d9]'
        } rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-md dark:shadow-[0_0_10px_rgba(156,112,223,0.3)]`}
      >
        {isProcessing ? (
          <div className="animate-spin">
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </form>
  );
};

export default ChatInput;
