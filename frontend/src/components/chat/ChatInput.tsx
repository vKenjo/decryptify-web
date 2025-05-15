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
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto mb-0 bg-transparent">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isProcessing ? "Processing response..." : "Ask me about crypto projects"}
        className={`w-full py-4 px-6 pr-16 rounded-full border-0 shadow-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all duration-300 text-base text-gray-700 placeholder:text-gray-400 backdrop-blur-md`}
        disabled={isProcessing}
        style={{ boxShadow: '0 8px 32px 0 rgba(80, 63, 205, 0.10)', background: 'rgba(255,255,255,0.90)' }}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={isProcessing}
        className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-[#8ecafe] to-[#b18fff] rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
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
