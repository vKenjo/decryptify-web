import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  updateDoc,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

export interface ChatSession {
  id: string;
  userId: string;
  createdAt: Timestamp;
  lastMessageAt: Timestamp;
  title?: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Timestamp;
}

export class FirestoreService {
  private chatsCollection = collection(db, 'chats');
  
  async createChatSession(userId: string, initialMessage: string): Promise<string> {
    try {
      const chatSession: Omit<ChatSession, 'id'> = {
        userId,
        createdAt: Timestamp.now(),
        lastMessageAt: Timestamp.now(),
        title: initialMessage.substring(0, 50) + '...',
        messages: [
          {
            role: 'system',
            content: 'You are DeCryptify, an AI assistant specializing in cryptocurrency and blockchain technology.',
            timestamp: Timestamp.now()
          },
          {
            role: 'user',
            content: initialMessage,
            timestamp: Timestamp.now()
          }
        ]
      };
      
      const docRef = await addDoc(this.chatsCollection, chatSession);
      return docRef.id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }
  
  async addMessage(chatId: string, message: ChatMessage): Promise<void> {
    try {
      const chatRef = doc(this.chatsCollection, chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (!chatDoc.exists()) {
        throw new Error('Chat session not found');
      }
      
      const currentData = chatDoc.data() as ChatSession;
      const updatedMessages = [...currentData.messages, message];
      
      await updateDoc(chatRef, {
        messages: updatedMessages,
        lastMessageAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }
  
  async getChatSession(chatId: string): Promise<ChatSession | null> {
    try {
      const chatRef = doc(this.chatsCollection, chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (!chatDoc.exists()) {
        return null;
      }
      
      return {
        id: chatDoc.id,
        ...chatDoc.data()
      } as ChatSession;
    } catch (error) {
      console.error('Error getting chat session:', error);
      throw error;
    }
  }
  
  async getUserChats(userId: string, limitCount: number = 10): Promise<ChatSession[]> {
    try {
      const q = query(
        this.chatsCollection,
        where('userId', '==', userId),
        orderBy('lastMessageAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChatSession));
    } catch (error) {
      console.error('Error getting user chats:', error);
      throw error;
    }
  }
  
  async deleteChat(chatId: string): Promise<void> {
    try {
      const chatRef = doc(this.chatsCollection, chatId);
      await updateDoc(chatRef, {
        deleted: true,
        deletedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
}

export const firestoreService = new FirestoreService();
