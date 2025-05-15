import { apiService } from '@/services/api';
import React, { useEffect, useState } from 'react';
import ChatInput from './ChatInput';
import { MessageRole } from './ChatMessage';
import ChatSuggestions from './ChatSuggestions';
import ChatThread from './ChatThread';

interface Message {
  id: string;
  content: string;
  role: MessageRole;
}

interface Suggestion {
  id: string;
  title: string;
  text: string;
}

interface ChatProps {
  streaming?: boolean; // Optional prop to enable streaming
}

const Chat: React.FC<ChatProps> = ({ streaming = false }) => {  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  
  // Example suggestions based on the image
  const suggestions: Suggestion[] = [
    { 
      id: '1', 
      title: "What's the trust score for Bitcoin?",
      text: "Find out the trust rating for any crypto project"
    },
    { 
      id: '2', 
      title: "Analyze Ethereum",
      text: "Get comprehensive analysis of Ethereum"
    },
    { 
      id: '3', 
      title: "Is Dogecoin a good investment?",
      text: "Evaluate the trustworthiness of Dogecoin"
    }
  ];
  
  const handleTyping = (typing: boolean) => {
    setIsTyping(typing);
    
    // If the user starts typing and the welcome screen is still visible, trigger the fade out
    if (typing && isWelcomeVisible && messages.length === 0) {
      setIsWelcomeVisible(false);
    }
  };
  
  const handleSendMessage = async (content: string) => {
    // When a message is sent, hide the welcome screen
    setIsWelcomeVisible(false);
    
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(true);
    setError(null);
    
    try {
      // If this is the first message, create a new chat
      if (!chatId) {
        const createResponse = await apiService.createChat(content);
        setChatId(createResponse.chat_id);
        
        // After creating the chat, we need to get the first response
        // The backend will have already processed the initial message
        const historyResponse = await apiService.getChatHistory(createResponse.chat_id);
        
        // Add the assistant's response if it exists
        const assistantMessages = historyResponse.messages.filter(msg => msg.role === 'assistant');
        if (assistantMessages.length > 0) {
          const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            content: lastAssistantMessage.content,
            role: 'assistant',
          };
          
          setMessages(prev => [...prev, assistantMessage]);
        }
      } else {
        // Send message to existing chat
        const response = await apiService.sendMessage(chatId, content);
        
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: response.message.content,
          role: 'assistant',
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Add an error message to the chat
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'm sorry, I encountered an error processing your request. Please make sure the backend server is running.",
        role: 'assistant',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: Suggestion) => {
    handleSendMessage(suggestion.title);
  };
    // Function to load a specific chat
  const loadChat = async (chatIdToLoad: string) => {
    if (!chatIdToLoad) return;
    
    setLoadingChat(true);
    setChatId(chatIdToLoad);
    
    try {
      // Load chat history from backend
      const response = await apiService.getChatHistory(chatIdToLoad);
      
      const formattedMessages: Message[] = response.messages
        .filter(msg => msg.role !== 'system') // Don't show system messages
        .map(msg => ({
          id: crypto.randomUUID(),
          content: msg.content,
          role: msg.role as MessageRole,
        }));
        
      setMessages(formattedMessages);
      
      if (formattedMessages.length > 0) {
        setIsWelcomeVisible(false);
      }
      
      // Update URL and localStorage to reflect current chat
      localStorage.setItem('currentChatId', chatIdToLoad);
      const newUrl = `${window.location.pathname}?chatId=${chatIdToLoad}`;
      window.history.replaceState({ ...window.history.state }, '', newUrl);
      
      return true;
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setError('Failed to load chat history. The chat may have been deleted.');
      
      // If chat not found, clear the stored ID
      localStorage.removeItem('currentChatId');
      setChatId(null);
      
      return false;
    } finally {
      setLoadingChat(false);
    }
  };
  // Load existing chat if there's a chatId in URL or storage
  useEffect(() => {
    // Check if there's a chat ID in local storage or URL params
    const storedChatId = localStorage.getItem('currentChatId');
    const urlParams = new URLSearchParams(window.location.search);
    const urlChatId = urlParams.get('chatId');
    
    const chatIdToLoad = urlChatId || storedChatId;
    
    if (chatIdToLoad) {
      loadChat(chatIdToLoad);
    }
    
    // Listen for chat selection events from sidebar
    const handleChatSelected = (event: CustomEvent) => {
      const selectedChatId = event.detail?.chatId;
      if (selectedChatId && selectedChatId !== chatId) {
        loadChat(selectedChatId);
      }
    };
    
    // Listen for "new chat" events
    const handleNewChat = () => {
      startNewChat();
    };
    
    // Add event listeners
    window.addEventListener('chatselected', handleChatSelected as EventListener);
    window.addEventListener('newchat', handleNewChat);
    
    // Clean up
    return () => {
      window.removeEventListener('chatselected', handleChatSelected as EventListener);
      window.removeEventListener('newchat', handleNewChat);
    };
  }, [chatId]);
    // Handle starting a new chat
  const startNewChat = () => {
    // Clear current chat state
    setMessages([]);
    setChatId(null);
    setError(null);
    setIsWelcomeVisible(true);
    
    // Remove stored chat ID and update URL
    localStorage.removeItem('currentChatId');
    const newUrl = window.location.pathname;
    window.history.replaceState({ ...window.history.state }, '', newUrl);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-transparent ">
      {loadingChat && (
        <div className="absolute inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="p-4 bg-white bg-transparent rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-700 dark:text-gray-300">Loading chat...</p>
          </div>
        </div>
      )}
      {/* Main chat area */}
      <div className="flex-1 overflow-hidden relative z-10 flex flex-col max-h-[80vh] bg-transparent">
        <ChatThread 
          messages={messages} 
          isWelcomeVisible={isWelcomeVisible}
          isTyping={isTyping}
        />
      </div>
      {/* Suggestions and input area with ellipses background */}
      <div className="relative z-20 w-full flex flex-col items-center bg-transparent">
        {messages.length === 0 && !isTyping && (
          <div className="w-full px-4 mb-2">
            <div className="max-w-3xl mx-auto">
              <ChatSuggestions 
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>
          </div>
        )}
        <div className="w-full px-4 flex-shrink-0 mt-auto max-w-3xl mx-auto">
          <div className="backdrop-blur-md bg-white/60 dark:bg-gray-900/40 rounded-full shadow-lg flex items-center transition-all duration-300">
            <ChatInput 
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
              onTyping={handleTyping}
            />
          </div>
        </div>
        {isProcessing && (
          <div className="absolute bottom-24 pb-12 left-0 right-0 flex justify-center animate-fadeIn z-20">
            <div className="bg-blue-50/80 backdrop-blur-md rounded-full py-1.5 px-4 text-sm text-blue-600 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              DeCryptify is thinking...
            </div>
          </div>
        )}
        {error && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center animate-fadeIn">
            <div className="bg-red-50/80 dark:bg-red-900/40 backdrop-blur-md rounded-full py-1.5 px-4 text-sm text-red-600 dark:text-red-300 shadow-sm">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
