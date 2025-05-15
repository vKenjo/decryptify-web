import React from 'react';
import SuggestionBox from '../ui/SuggestionBox';

interface Suggestion {
	id: string;
	title: string;
	text: string;
}

interface ChatSuggestionsProps {
	suggestions: Suggestion[];
	onSuggestionClick: (suggestion: Suggestion) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
	suggestions,
	onSuggestionClick,
}) => {
	return (
		// TODO: change here to change size; pwede din gawin sticky-bottom later
		<div className='w-full flex flex-col gap-2 mb-28'>
			<p className='text-sm text-gray-500 dark:text-gray-400 mb-0.5'>
				Suggestions on what to ask DeCryptify
			</p>
			<div className='flex justify-between gap-2 flex-wrap'>
				{suggestions.map((suggestion) => (
					<button
						key={suggestion.id}
						onClick={() => onSuggestionClick(suggestion)}
						className='px-4 py-2.5 bg-white/80 dark:bg-gray-800/60 rounded-lg border border-gray-200/40 dark:border-gray-700/40 text-left hover:bg-white dark:hover:bg-gray-800/80 transition-colors shadow-sm dark:shadow-[0_2px_6px_rgba(0,0,0,0.2)] backdrop-blur-sm flex-1 min-w-[200px]'
					>
						<p className='text-sm font-medium text-gray-700 dark:text-gray-200'>
							{suggestion.title}
						</p>
					</button>
				))}
			</div>
		</div>
	);
};

export default ChatSuggestions;
