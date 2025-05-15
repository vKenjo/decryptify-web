import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  TrashIcon,
  PencilIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeChat?: string;
  isExpanded?: boolean;
  toggleSidebar?: () => void;
}

interface ChatItem {
  id: string;
  title: string;
  preview: string;
  date?: string;
  active?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeChat,
  isExpanded: propExpanded,
  toggleSidebar: propToggleSidebar,
}) => {
  const [localExpanded, setLocalExpanded] = useState(true); // Start expanded to match the second image
  const [animateButtons, setAnimateButtons] = useState(false);

  // Use props if provided, otherwise use local state
  const isExpanded = propExpanded !== undefined ? propExpanded : localExpanded;

  // Animation effect
  useEffect(() => {
    setAnimateButtons(true);
    const timer = setTimeout(() => setAnimateButtons(false), 1000);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  const [chats, setChats] = useState<ChatItem[]>([
    {
      id: 'chat1',
      title: 'How is the trust score calculated?',
      preview: 'The trust score is calculated based on...',
      active: false,
    },
    {
      id: 'chat2',
      title: 'Lorem Ipsum Project',
      preview: 'This project has a trust score of...',
      active: false,
    },
    {
      id: 'chat3',
      title: 'NeonChain Project Analysis',
      preview: 'This innovative blockchain solution...',
      active: true,
    },
    {
      id: 'chat4',
      title: 'Which new crypto projects have strong trust scores?',
      preview: 'Here are the top trusted new projects...',
      active: false,
    },
    {
      id: 'chat5',
      title: 'Who is the founder, and what was their previous experience?',
      preview: 'The founder previously worked at...',
      active: false,
    },
    {
      id: 'chat6',
      title: 'What is the current trading volume?',
      preview: 'The current trading volume is approximately...',
      active: false,
    },
    {
      id: 'chat7',
      title: 'How volatile has this project been?',
      preview: 'Over the past 30 days, this project has...',
      active: false,
    },
  ]);
  
  const toggleSidebar = () => {
    if (propToggleSidebar) {
      propToggleSidebar();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };
  // Generate animation styles using only Tailwind classes
  const getAnimationClass = (delay: number = 0) => {
    return animateButtons ? 
      `animate-bubble transform transition-all duration-500 ease-out` : 
      'transform transition-all duration-300 scale-100';
  };
    return (
    <aside
      className={`h-full bg-white dark:bg-[var(--sidebar-bg)] flex flex-col transition-all duration-300 ease-in-out relative rounded-3xl shadow-md
        ${isExpanded ? 'w-[280px]' : 'w-16'}`}
    >
      <div
        className={`py-6 ${
          isExpanded ? 'px-6' : 'flex flex-col items-center gap-4'
        }`}
      >
        {/* Header Section */}
        <div
          className={`flex items-center ${
            isExpanded ? 'justify-between mb-6' : 'justify-center'
          }`}
        >
          {isExpanded ? (
            <div className='flex items-center gap-2'>
              <div className='text-primary-purple'>
                <svg
                  width='28'
                  height='28'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  xmlns='http://www.w3.org/2000/svg'
                  className={`${getAnimationClass(100)}`}
                >
                  <path d='M13 2L3 14H12L11 22L21 10H12L13 2Z' />
                </svg>
              </div>
              <h2 className='font-semibold text-gray-700 dark:text-gray-200 text-xl'>
                DeCryptify
              </h2>
            </div>
          ) : (
            <div className='cursor-pointer mb-6' onClick={toggleSidebar}>
              <div className='text-primary-purple'>
                <svg
                  width='28'
                  height='28'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  xmlns='http://www.w3.org/2000/svg'
                  className={`${getAnimationClass(100)}`}
                >
                  <path d='M13 2L3 14H12L11 22L21 10H12L13 2Z' />
                </svg>
              </div>
            </div>
          )}

          {isExpanded && (
            <button
              onClick={toggleSidebar}
              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500'
            >
              <ChevronRightIcon className='w-5 h-5' />
            </button>
          )}
        </div>
          {/* Action Buttons */}
        {isExpanded ? (
          <div className='mb-8 flex gap-2'>
            <button 
              className="flex-1 bg-gradient-to-r from-blue-400 to-violet-500 text-white rounded-full py-3.5 px-5 flex items-center gap-2 justify-center hover:opacity-95 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-violet-300/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <PlusIcon className='w-5 h-5 text-white' />
              <span className="font-medium text-sm">New chat</span>
            </button>

            <button 
              className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-500 hover:bg-violet-200 transition-colors shadow-sm hover:shadow-md">
              <MagnifyingGlassIcon className='w-5 h-5' />
            </button>
          </div>
        ) : (
          <>
            <button
              className="w-10 h-10 bg-gradient-to-r from-blue-400 to-violet-500 text-white rounded-full flex items-center justify-center hover:opacity-95 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-violet-300/30 relative overflow-hidden group"
              onClick={toggleSidebar}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <PlusIcon className='w-5 h-5 text-white' />
            </button>

            <button
              className="w-10 h-10 bg-violet-100 hover:bg-violet-200 text-violet-500 rounded-full flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
              onClick={toggleSidebar}
            >
              <MagnifyingGlassIcon className='w-5 h-5' />
            </button>
          </>
        )}

        {/* Chat History */}
        {isExpanded ? (
          <div className='flex flex-col'>
            <div className='flex items-center justify-between mb-3'>
              <p className='text-sm text-gray-500'>Your conversations</p>
              <button className='text-sm text-blue-400 hover:text-blue-500 hover:underline transition-colors'>
                Clear All
              </button>
            </div>
            <div className='space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1'>              {chats.map((chat, index) => (
                <div
                  key={chat.id}
                  className={`relative rounded-lg cursor-pointer transition-all duration-300 ${getAnimationClass(150 + index * 30)} ${
                    chat.active
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {chat.active && (
                    <div className='absolute right-0 h-full flex items-center'>
                      <div className='flex gap-1 mr-2'>
                        <button className='p-1.5 rounded-md bg-red-400 hover:bg-red-500 transition-colors'>
                          <TrashIcon className='w-4 h-4 text-white' />
                        </button>
                        <button className='p-1.5 rounded-md bg-blue-400 hover:bg-blue-500 transition-colors'>
                          <PencilIcon className='w-4 h-4 text-white' />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className={`flex gap-3 items-start p-3 relative overflow-hidden`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      chat.active
                        ? 'bg-blue-100 text-blue-500 animate-pulse'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <ChatBubbleLeftIcon className={`w-4 h-4`} />
                    </div>
                    <div className='flex-1 min-w-0 pr-16'>
                      <p className={`text-sm font-medium truncate ${
                        chat.active
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {chat.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className='pt-4 pb-2 mt-2 border-t border-gray-100 dark:border-gray-800'>
                <p className='text-sm text-gray-500 mb-2'>Last 7 Days</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='mt-4 flex flex-col gap-3 items-center'>
            {chats.map((chat, index) => (
              <button
                key={chat.id}
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    chat.active
                      ? 'bg-blue-100 text-blue-500 animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                  } 
                  cursor-pointer transition-all duration-300`}
                onClick={toggleSidebar}
              >
                <ChatBubbleLeftIcon className='w-4 h-4' />
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
