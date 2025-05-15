"use client";
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutInner: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  // Get active chat ID from URL or local storage
  useEffect(() => { 
    setMounted(true); 
    
    // Get chat ID from URL or local storage
    const urlParams = new URLSearchParams(window.location.search);
    const urlChatId = urlParams.get('chatId');
    const storedChatId = localStorage.getItem('currentChatId');
    
    setActiveChatId(urlChatId || storedChatId || null);
  }, []);
  
  // Handle chat selection from sidebar
  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    
    // Update URL without reload
    const newUrl = `${window.location.pathname}?chatId=${chatId}`;
    window.history.pushState({}, '', newUrl);
    
    // Store in local storage
    localStorage.setItem('currentChatId', chatId);
    
    // Dispatch custom event to notify Chat component
    const event = new CustomEvent('chatselected', { detail: { chatId } });
    window.dispatchEvent(event);
  };
  
  if (!mounted) return null; // Avoid hydration mismatch
  
  return (
    <div className="min-h-screen flex">
      <Sidebar 
        activeChat={activeChatId || undefined} 
        onChatSelect={handleChatSelect} 
      />
      <div className="flex flex-col flex-1 relative min-h-screen">
        <Header 
          username="Kenjo"
          isDarkMode={theme === 'dark'}
          toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
        <main className="flex-1 flex flex-col justify-start overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutInner;