import React from 'react';
import Image from 'next/image';
import {
	MoonIcon,
	SunIcon,
	Cog6ToothIcon,
	ChevronDownIcon,
	BellIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
	username: string;
	isDarkMode: boolean;
	toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({
	username,
	isDarkMode,
	toggleTheme,
}) => {	return (
		<header className='w-full flex justify-between items-center px-6 py-3.5 bg-white dark:bg-[var(--navbar-bg)] z-10 shadow-sm relative border-b border-gray-100 dark:border-gray-800'>
			{/* Left section with brand */}
			<div className='flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800/40 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors button-hover-effect'>
				<h3 className='text-base font-medium text-gray-700 dark:text-gray-300'>
					DeCryptify AI
				</h3>
				<ChevronDownIcon className='w-4 h-4 text-gray-500' />
			</div>
			
			{/* Center section with theme toggle - properly centered */}
			<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">				<button 
					onClick={() => {
						console.log("Theme toggle clicked");
						toggleTheme();
					}}
					className='flex items-center justify-center rounded-full w-16 h-8 bg-white dark:bg-gray-700 shadow-md transition-all duration-300 cursor-pointer'
					aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
					type="button" 
				>
					<div className="relative w-full h-full rounded-full flex items-center justify-between px-2">
						<SunIcon className='h-4 w-4 text-gray-400' />
						<MoonIcon className='h-4 w-4 text-gray-400' />
						<div className={`absolute w-6 h-6 rounded-full transition-transform duration-300 shadow-md flex items-center justify-center ${
							isDarkMode 
							? 'transform translate-x-[24px] bg-[#556ee6] text-white' 
							: 'translate-x-0 bg-white text-amber-500'
						}`}>
							{isDarkMode ? (
								<MoonIcon className='h-3.5 w-3.5 text-white' />
							) : (
								<SunIcon className='h-3.5 w-3.5 text-amber-400' />
							)}
						</div>
					</div>
				</button>
			</div>
			
			{/* Right section with user tools */}
			<div className='flex items-center gap-4'>
				<button
					className='rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 relative button-hover-effect'
					aria-label='Notifications'
				>
					<BellIcon className='h-5 w-5' />
					<span className='absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse'></span>
				</button>
				<button
					className='rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 button-hover-effect'
					aria-label='Settings'
				>
					<Cog6ToothIcon className='h-5 w-5' />
				</button>

				<div className='w-9 h-9 rounded-full bg-gradient-to-r from-primary-lightBlue to-primary-purple flex items-center justify-center text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer button-hover-effect'>
					{username.substring(0, 1).toUpperCase()}
				</div>
			</div>
		</header>
	);
};

export default Header;
