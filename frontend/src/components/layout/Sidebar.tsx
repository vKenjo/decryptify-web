import React, { useState } from 'react';
import '../../app/sidebar-animations.css';
import {
	PlusIcon,
	MagnifyingGlassIcon,
	TrashIcon,
	PencilIcon,
	ChatBubbleLeftIcon,
	DocumentDuplicateIcon,
	ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
	activeChat?: string;
}

interface ChatItem {
	id: string;
	title: string;
	preview: string;
	date?: string;
	active?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeChat }) => {
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
	const [collapsed, setCollapsed] = useState(false);

	const handleToggle = () => setCollapsed((prev) => !prev);
	const handleDoubleClick = () => setCollapsed((prev) => !prev);

	return (		<aside
			className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} h-full bg-white dark:bg-[var(--sidebar-bg)] flex flex-col relative border-r border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500`}
			onDoubleClick={handleDoubleClick}
		>
			<div className={`py-5 px-4 flex flex-col h-full transition-all duration-500 ${collapsed ? 'items-center px-0' : ''}`} style={{ minHeight: '100vh' }}>
				{/* Header Section with clickable logo */}
				<div className={`flex items-center mb-6 ${collapsed ? 'justify-center' : ''}`} style={{ width: '100%' }}>
					<div
						className={`${collapsed ? 'mx-auto' : 'mr-3'} cursor-pointer select-none flex`}
						onClick={handleToggle}
						onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleToggle()}
						tabIndex={0}
						role="button"
						title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
						style={{ outline: 'none', border: 'none', background: 'none', padding: 0, alignItems: 'center', transition: 'all 0.5s' }}
					>
						<svg width='32' height='32' viewBox='0 0 24 24' fill='url(#gradient)' xmlns='http://www.w3.org/2000/svg' style={{ transition: 'transform 0.5s', transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
							<defs>
								<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stopColor="#6366f1" />
									<stop offset="100%" stopColor="#a855f7" />
								</linearGradient>
							</defs>
							<path d='M13 2L3 14H12L11 22L21 10H12L13 2Z' />
						</svg>
					</div>
					{!collapsed && (
						<h2 className='font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-opacity duration-500'>DeCryptify</h2>
					)}
				</div>

				{/* Main Action Buttons */}
				<div className={`mb-5 flex ${collapsed ? 'flex-col gap-4 items-center w-full' : 'gap-2 w-full'} transition-all duration-500`} style={collapsed ? { marginBottom: '2.5rem' } : {}}>
					<button className={`bg-gradient-to-r from-blue-200 to-purple-200 text-gray-700 ${collapsed ? 'rounded-full w-12 h-12 flex items-center justify-center p-0 transition-all duration-500' : 'rounded-full py-2 flex-1 flex items-center gap-2 justify-center hover:opacity-90 transition-all duration-500'}`}>
						<PlusIcon className='w-6 h-6' />
						{!collapsed && <span className='font-medium text-sm transition-opacity duration-500'>New chat</span>}
					</button>
					<button className={`bg-purple-400 ${collapsed ? 'rounded-full w-12 h-12 flex items-center justify-center p-0 transition-all duration-500' : 'w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:opacity-90 transition-all duration-500'}`} style={{ color: '#fff' }}>
						<MagnifyingGlassIcon className='w-6 h-6' />
					</button>
				</div>

				{/* Divider */}
				<div className={`${collapsed ? 'w-8' : 'w-full'} border-t border-blue-200 mb-4 transition-all duration-500`} />

				{/* Avatars/Chat List (collapsed: show avatars for all chats, fade/slide in) */}
				<div className={`flex-1 flex flex-col ${collapsed ? 'items-center gap-4 mt-2' : ''} transition-all duration-500`} style={collapsed ? { minHeight: 0 } : {}}>
					{collapsed ? (
						<>
								{/* Remove placeholder for current chat (active) to eliminate extra space */}
								{chats.map((chat, idx) => (
									<div key={chat.id} className="rounded-full bg-blue-100 border border-blue-300 w-12 h-12 flex items-center justify-center text-blue-500 font-bold text-lg shadow-sm transition-all duration-500 animate-fadeIn" style={{ opacity: 1, transform: 'translateY(0)' }}>
										{chat.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
									</div>
								))}
						</>
					) : (
						<>
							<div className='flex items-center justify-between mb-3'>
								<p className='text-sm text-gray-500'>Your conversations</p>
								<button className='text-sm text-blue-500 hover:text-blue-600'>
									Clear All
								</button>
							</div>
							<div className='space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1'>
								{chats.slice(0, 3).map((chat, index) => (
									<div
										key={chat.id}
										style={chat.active ? {
											position: 'relative',
											overflow: 'hidden',
											paddingRight: '80px'
										} : {}}
										className={`group flex items-center px-3 py-2 transition-all duration-200 cursor-pointer ${
											chat.active
												? 'bg-blue-100 text-gray-700 rounded-2xl'
												: 'text-gray-700 hover:bg-gray-50 rounded-lg'
										}`}
									>
										<div className='w-6 h-6 rounded-sm flex items-center justify-center mr-3'>
											<ChatBubbleLeftIcon className='w-5 h-5 text-gray-600' />
										</div>
										<span className={`flex-1 text-sm truncate`}>{chat.title}</span>
										{chat.active && (
											<div className='absolute right-0 top-0 bottom-0 flex items-center bg-blue-300 px-3 rounded-l-2xl'>
												<button className='h-6 w-6 flex items-center justify-center text-white mr-1' title='Delete'>
													<TrashIcon className='w-4 h-4' />
												</button>
												<button className='h-6 w-6 flex items-center justify-center text-white' title='Edit'>
													<PencilIcon className='w-4 h-4' />
												</button>
											</div>
										)}
									</div>
								))}
								<div className='pt-4 pb-2 mt-2 border-t border-gray-100'>
									<p className='text-xs text-blue-300 font-medium mb-2 uppercase'>Last 7 Days</p>
									{chats.slice(3).map((chat, idx) => (
										<div
											key={chat.id}
											className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer text-gray-700 hover:bg-gray-50`}
										>
											<div className={`w-6 h-6 flex items-center justify-center mr-3 text-gray-600`}>
												<ChatBubbleLeftIcon className='w-5 h-5' />
											</div>
											<p className={`text-sm truncate`}>{chat.title}</p>
										</div>
									))}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
