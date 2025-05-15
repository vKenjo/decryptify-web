// API service for communicating with the Python backend

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp?: string;
}

export interface CreateChatRequest {
  initial_message: string;
  user_id?: string;
}

export interface ChatRequest {
  chat_id: string;
  message: string;
}

export interface ApiMessage {
  role: string;
  content: string;
  timestamp: string;
}

export interface CreateChatResponse {
  chat_id: string;
  status: string;
}

export interface ChatResponse {
  chat_id: string;
  message: ApiMessage;
  status: string;
}

export interface ChatHistoryResponse {
  chat_id: string;
  messages: ApiMessage[];
  status: string;
}

export class APIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async createChat(initialMessage: string, userId?: string): Promise<CreateChatResponse> {
    const response = await fetch(`${this.baseUrl}/api/chats/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initial_message: initialMessage,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async sendMessage(chatId: string, message: string): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/api/chats/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getChatHistory(chatId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(`${this.baseUrl}/api/chats/${chatId}/history`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async listAgents(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/agents`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getModelInfo(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/model`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new APIService();
