import { NextRequest, NextResponse } from 'next/server';
import { getLangChainService } from '@/services/langchain';
import { v4 as uuidv4 } from 'uuid';

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  chatId?: string;
  stream?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, chatId = uuidv4(), stream = false } = body;

    const langchainService = getLangChainService();
    
    if (!langchainService) {
      return NextResponse.json(
        { error: 'LangChain service not available' },
        { status: 500 }
      );
    }

    if (stream) {
      // Handle streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            await langchainService.streamMessage(messages, (token) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
            });
            
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Handle regular response
      const response = await langchainService.sendMessage(messages);
      
      return NextResponse.json({
        chatId,
        message: {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
        },
        status: 'success',
      });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
