import React from 'react';

interface SuggestionBoxProps {
  title: string;
  text: string;
  onClick: () => void;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ title, text, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full shadow-sm hover:shadow"
    >
      <h4 className="font-medium text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400">{text}</p>
    </button>
  );
};

export default SuggestionBox;
