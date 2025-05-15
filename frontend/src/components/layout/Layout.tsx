"use client";
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from 'next-themes';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutInner: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null; // Avoid hydration mismatch
  return (
    <div className="min-h-screen flex">
      <Sidebar activeChat="chat3" />
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