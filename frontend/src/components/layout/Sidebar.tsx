import {
    ArrowTopRightOnSquareIcon,
    ChatBubbleLeftIcon,
    DocumentDuplicateIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { collection, DocumentData, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import '../../app/sidebar-animations.css';
import { auth, db } from '../../services/firebase';

interface SidebarProps {
	activeChat?: string;
	onChatSelect?: (chatId: string) => void;
}

interface ChatItem {
	id: string;
	title: string;
	preview: string;
	date?: string;
	createdAt?: Date;
	active?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeChat, onChatSelect }) => {
	const [chats, setChats] = useState<ChatItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [collapsed, setCollapsed] = useState(false);

	useEffect(() => {
		// Function to fetch chats from Firestore
		const fetchChats = async () => {
			try {
				setLoading(true);
				
				// Get current user ID or use anonymous ID
				const userId = auth.currentUser?.uid || 'anonymous';
				
				// Query for recent chats
				const chatsRef = collection(db, 'chats');
				const q = query(
					chatsRef,
					where('userId', '==', userId),
					orderBy('lastMessageAt', 'desc'),
					limit(10)
				);
				
				const querySnapshot = await getDocs(q);
				const fetchedChats: ChatItem[] = [];
				
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					// Extract latest message preview if available
					const messages = data.messages || [];
					const latestUserMessage = messages.filter((m: any) => m.role === 'user').pop();
					
					fetchedChats.push({
						id: doc.id,
						title: data.title || 'Untitled Chat',
						preview: latestUserMessage ? latestUserMessage.content.substring(0, 50) + '...' : 'No messages',
						date: data.lastMessageAt?.toDate().toLocaleDateString(),
						createdAt: data.createdAt?.toDate(),
						active: activeChat === doc.id
					});
				});
				
				setChats(fetchedChats);
			} catch (error) {
				console.error('Error fetching chats:', error);
				// Provide fallback data in case of error
				setChats([
					{
						id: 'welcome',
						title: 'Welcome to Decryptify',
						preview: 'Ask me about any cryptocurrency project...',
						active: true
					}
				]);
			} finally {
				setLoading(false);
			}
		};
		
		fetchChats();
	}, [activeChat]); // Refetch when active chat changes

	const handleToggle = () => setCollapsed((prev) => !prev);
	const handleDoubleClick = () => setCollapsed((prev) => !prev);
	
	const handleChatClick = (chatId: string) => {
		if (onChatSelect) {
			onChatSelect(chatId);
		}
	};

	return (
		<aside
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

				{/* Chat List */}
				<div className={`flex-1 flex flex-col ${collapsed ? 'items-center gap-4 mt-2' : ''} transition-all duration-500`} style={collapsed ? { minHeight: 0 } : {}}>
					{loading ? (
						// Loading state
						<div className="text-center py-4 text-gray-500">Loading chats...</div>
					) : collapsed ? (
						// Collapsed view - show avatars
						<>
							{chats.map((chat) => (
								<div 
									key={chat.id} 
									className="rounded-full bg-blue-100 border border-blue-300 w-12 h-12 flex items-center justify-center text-blue-500 font-bold text-lg shadow-sm transition-all duration-500 animate-fadeIn cursor-pointer" 
									style={{ opacity: 1, transform: 'translateY(0)' }}
									onClick={() => handleChatClick(chat.id)}
								>
									{chat.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
								</div>
							))}
						</>
					) : (
						// Expanded view - show chat list
						<>
							<div className='flex items-center justify-between mb-3'>
								<p className='text-sm text-gray-500'>Your conversations</p>
								{chats.length > 0 && (
									<button className='text-sm text-blue-500 hover:text-blue-600'>
										Clear All
									</button>
								)}
							</div>
							<div className='space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1'>
								{chats.length === 0 ? (
									<div className="text-center py-4 text-gray-500">No chat history found</div>
								) : (
									<>
										{/* Recent chats */}
										{chats.filter(c => {
											// Filter chats from last 24 hours
											if (!c.createdAt) return true;
											const dayAgo = new Date();
											dayAgo.setHours(dayAgo.getHours() - 24);
											return c.createdAt >= dayAgo;
										}).map((chat) => (
											<div
												key={chat.id}
												onClick={() => handleChatClick(chat.id)}
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

										{/* Older chats section */}
										{chats.filter(c => {
											// Filter chats older than a day
											if (!c.createdAt) return false;
											const dayAgo = new Date();
											dayAgo.setHours(dayAgo.getHours() - 24);
											return c.createdAt < dayAgo;
										}).length > 0 && (
											<>
												<div className='pt-4 pb-2 mt-2 border-t border-gray-100'>
													<p className='text-xs text-blue-300 font-medium mb-2 uppercase'>Earlier</p>
													{chats.filter(c => {
														if (!c.createdAt) return false;
														const dayAgo = new Date();
														dayAgo.setHours(dayAgo.getHours() - 24);
														return c.createdAt < dayAgo;
													}).map((chat) => (
														<div
															key={chat.id}
															onClick={() => handleChatClick(chat.id)}
															className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer text-gray-700 hover:bg-gray-50`}
														>
															<div className={`w-6 h-6 flex items-center justify-center mr-3 text-gray-600`}>
																<ChatBubbleLeftIcon className='w-5 h-5' />
															</div>
															<p className={`text-sm truncate`}>{chat.title}</p>
														</div>
													))}
												</div>
											</>
										)}
									</>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
