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
	isTyping = false,
}) => {
	// Special component for the project verification card
	const ProjectVerificationCard = () => (
		<div
			className='project-verification bg-white/90 border border-blue-100 rounded-2xl p-6 shadow-md backdrop-blur-md'
			style={{ boxShadow: '0 4px 32px 0 rgba(80, 63, 205, 0.10)' }}
		>
			<div className='flex items-center mb-2'>
				<div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2'>
					<svg
						className='w-4 h-4 text-blue-500'
						fill='currentColor'
						viewBox='0 0 20 20'
					>
						<path
							fillRule='evenodd'
							d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
							clipRule='evenodd'
						></path>
					</svg>
				</div>
				<h3 className='text-lg font-semibold text-blue-900'>
					Project Credibility Verification
				</h3>
			</div>
			<p className='mb-2 text-base text-blue-900 font-medium'>
				Project Name: <span className='font-semibold'>NeonChain</span>
			</p>
			<div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-2'>
				<div className='col-span-1'>
					<p className='text-xs text-gray-500 flex items-center mb-1'>
						Trust Score
						<span className='ml-1 w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-[10px] font-bold'>
							i
						</span>
					</p>
					<p className='font-extrabold text-blue-700 text-xl leading-tight'>
						80%
					</p>
					<div className='w-full bg-blue-100 rounded-full h-1 mt-1'>
						<div
							className='bg-blue-500 h-1 rounded-full transition-all duration-500'
							style={{ width: '80%' }}
						></div>
					</div>
				</div>
				<div className='col-span-1'>
					<p className='text-xs text-gray-500 flex items-center mb-1'>
						Created
						<span className='ml-1 w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-[10px] font-bold'>
							i
						</span>
					</p>
					<p className='font-bold text-blue-700 text-base leading-tight'>
						2 days
					</p>
				</div>
				<div className='col-span-1'>
					<p className='text-xs text-gray-500 flex items-center mb-1'>
						Volume
						<span className='ml-1 w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-[10px] font-bold'>
							i
						</span>
					</p>
					<p className='font-bold text-blue-700 text-base leading-tight'>
						170.87k
					</p>
				</div>
				<div className='col-span-1'>
					<p className='text-xs text-gray-500 flex items-center mb-1'>
						Liquidity
						<span className='ml-1 w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-[10px] font-bold'>
							i
						</span>
					</p>
					<p className='font-bold text-blue-700 text-base leading-tight'>
						548.99k
					</p>
				</div>
				<div className='col-span-1'>
					<p className='text-xs text-gray-500 flex items-center mb-1'>
						T.M. Cap
						<span className='ml-1 w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-[10px] font-bold'>
							i
						</span>
					</p>
					<p className='font-bold text-blue-700 text-base leading-tight'>
						48.68M
					</p>
				</div>
			</div>
			<p className='mb-1 text-sm text-blue-900'>
				<span className='font-semibold'>Founder:</span> Sophia Reyes
			</p>
			<div className='mt-2'>
				<p className='font-semibold mb-1 text-blue-700'>Verdict:</p>
				<p className='text-gray-700 text-sm'>
					NeonChain shows strong liquidity and market engagement, but its
					volatility suggests a high-risk investment. Investors should review
					community engagement and ongoing development before committing.
				</p>
			</div>
		</div>
	);

	// Custom message component to handle special message types
	const MessageWithContent = ({ message }: { message: Message }) => {
		if (
			message.role === 'assistant' &&
			message.content.includes("What's the trust score for NeonChain?")
		) {
			return (
				<div className='mb-6'>
					<ChatMessage content={message.content} role={message.role} />
					<div className='mt-4 ml-10 animate-bubble'>
						<ProjectVerificationCard />
					</div>
				</div>
			);
		}
		// User and assistant message bubbles
		if (message.role === 'user') {
			return (
				<div className='flex justify-end mb-2'>
					<div className='flex items-end gap-2'>
						<ChatMessage content={message.content} role={message.role} />
					</div>
				</div>
			);
		}
		// Assistant normal message
		return (
			<div className='flex items-end gap-2 mb-2'>
				<ChatMessage content={message.content} role={message.role} />
			</div>
		);
	};

	return (
		<div className='flex-1 overflow-y-auto p-8 md:p-10 bg-gradient-to-br from-white via-blue-50 to-violet-50 min-h-[calc(100vh-200px)]'>
			{messages.length === 0 ? (
				<div className='absolute inset-0 flex items-center justify-center'>
					<div
						className={`text-center transform transition-all duration-500 ease-out ${
							isWelcomeVisible ? 'animate-fadeIn' : 'animate-fadeOut'
						}`}
					>
						<div className='mb-6 mx-auto w-16 h-16 bg-gradient-to-r from-blue-400 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-300/20 animate-bubble'>
							<svg
								width='40'
								height='40'
								viewBox='0 0 24 24'
								fill='currentColor'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path d='M13 2L3 14H12L11 22L21 10H12L13 2Z' />
							</svg>
						</div>
						<h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent mb-3'>
							Welcome back, Kenjo!
						</h1>
						<p className='text-base text-gray-500 max-w-md mx-auto'>
							Confidence in Crypto Starts with Trust
						</p>
					</div>
				</div>
			) : (
				<div className='space-y-6 max-w-4xl mx-auto pt-4 w-full'>
					{messages.map((message, index) => (
						<div
							key={message.id}
							className={`message-container animate-fadeIn ${
								message.role === 'assistant' ? 'animate-bubble' : ''
							}`}
							style={{
								animationDelay: `${index * 150}ms`,
								transformOrigin: message.role === 'user' ? 'right' : 'left',
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
