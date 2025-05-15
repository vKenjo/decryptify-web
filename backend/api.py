"""
Decryptify API - LangChain-based crypto trust assessment system
"""
import os
import json
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory

# Load environment variables
load_dotenv()

# Initialize Firebase
try:
    if not firebase_admin._apps:
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "firebase-credentials.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
        else:
            print("Warning: Firebase credentials not found. Chat history will not be saved.")
            db = None
except Exception as e:
    print(f"Firebase initialization error: {e}")
    db = None

# Initialize LangChain LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.7,
)

# Initialize FastAPI app
app = FastAPI(
    title="Decryptify API",
    description="AI-powered crypto analysis and trust assessment system",
    version="2.0.0"
)

# Add CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Data Models
class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    chat_id: str
    message: str

class ChatResponse(BaseModel):
    chat_id: str
    message: ChatMessage
    status: str = "success"

class CreateChatRequest(BaseModel):
    initial_message: str
    user_id: Optional[str] = None

class CreateChatResponse(BaseModel):
    chat_id: str
    status: str = "success"

# Import agent tools
from backend.agents.coin_info import coin_info_tool
from backend.agents.crypto_scam import crypto_scam_tool
from backend.agents.certik import certik_tool
from backend.agents.chainbroker import chainbroker_tool
from backend.agents.founder_info import founder_info_tool
from backend.agents.project_info import project_info_tool
from backend.agents.trust_score import trust_score_tool

# Create the agent tools list
tools = [
    coin_info_tool,
    crypto_scam_tool,
    certik_tool,
    chainbroker_tool,
    founder_info_tool,
    project_info_tool,
    trust_score_tool,
]

# Agent prompt template
agent_prompt = PromptTemplate.from_template("""You are Decryptify, an AI-powered crypto trust assessment system. You help users evaluate the trustworthiness of cryptocurrency projects by analyzing various aspects.

Available tools:
{tools}

Use these tools to gather information when users ask about cryptocurrency projects. Always provide a comprehensive analysis including:
1. Market data and token metrics
2. Scam risk assessment
3. Smart contract security audit results
4. Exchange/broker reliability
5. Founder and team credibility
6. Project fundamentals
7. Overall trust score (0-10)

Current conversation:
{chat_history}

User: {input}

{agent_scratchpad}
""")

# Firestore helper functions
def create_chat_session(user_id: Optional[str], initial_message: str) -> str:
    """Create a new chat session in Firestore"""
    chat_id = str(uuid4())
    
    if db:
        chat_data = {
            "chat_id": chat_id,
            "user_id": user_id,
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP,
            "messages": [
                {
                    "role": "user",
                    "content": initial_message,
                    "timestamp": datetime.utcnow()
                }
            ]
        }
        db.collection("chats").document(chat_id).set(chat_data)
    
    return chat_id

def add_message_to_chat(chat_id: str, message: ChatMessage) -> None:
    """Add a message to an existing chat session"""
    if db:
        chat_ref = db.collection("chats").document(chat_id)
        chat_ref.update({
            "messages": firestore.ArrayUnion([message.dict()]),
            "updated_at": firestore.SERVER_TIMESTAMP
        })

def get_chat_history(chat_id: str) -> List[Dict[str, Any]]:
    """Retrieve chat history from Firestore"""
    if not db:
        return []
    
    chat_ref = db.collection("chats").document(chat_id)
    chat_doc = chat_ref.get()
    
    if not chat_doc.exists:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    chat_data = chat_doc.to_dict()
    return chat_data.get("messages", [])

# Create agent memory store
memory_store = {}

def get_or_create_memory(chat_id: str) -> ConversationBufferMemory:
    """Get or create a conversation memory for a chat session"""
    if chat_id not in memory_store:
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        memory_store[chat_id] = memory
    return memory_store[chat_id]

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "Welcome to Decryptify API",
        "version": "2.0.0",
        "description": "AI-powered crypto analysis and trust assessment"
    }

@app.get("/api/agents")
async def list_agents():
    """List all available agents and their capabilities"""
    agents = [
        {
            "name": "Coin Info Agent",
            "description": "Provides comprehensive cryptocurrency market data and analysis"
        },
        {
            "name": "Crypto Scam Agent",
            "description": "Detects and analyzes cryptocurrency scam risks"
        },
        {
            "name": "ChainBroker Agent",
            "description": "Analyzes cryptocurrency broker and exchange data"
        },
        {
            "name": "CertiK Agent",
            "description": "Analyzes smart contract security audits and vulnerabilities"
        },
        {
            "name": "Founder Info Agent",
            "description": "Investigates founder background and credibility"
        },
        {
            "name": "Project Info Agent",
            "description": "Gathers and analyzes project information from various sources"
        },
        {
            "name": "Trust Agent",
            "description": "Synthesizes all information to provide a trust score (0-10)"
        }
    ]
    
    return {"agents": agents, "status": "success"}

@app.get("/api/model")
async def get_model_info():
    """Get current model configuration"""
    return {
        "model": "gemini-pro",
        "api_key_set": bool(os.getenv("GOOGLE_API_KEY")),
        "status": "success"
    }

@app.post("/api/chats/create", response_model=CreateChatResponse)
async def create_chat(request: CreateChatRequest):
    """Create a new chat session"""
    try:
        chat_id = create_chat_session(
            user_id=request.user_id,
            initial_message=request.initial_message
        )
        
        # Process the initial message
        response_content = await process_message(chat_id, request.initial_message)
        
        # Add assistant response to chat
        assistant_message = ChatMessage(
            role="assistant",
            content=response_content
        )
        add_message_to_chat(chat_id, assistant_message)
        
        return CreateChatResponse(chat_id=chat_id, status="success")
            
    except Exception as e:
        print(f"Error creating chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chats/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a message to an existing chat"""
    try:
        # Add user message to chat
        user_message = ChatMessage(
            role="user",
            content=request.message
        )
        add_message_to_chat(request.chat_id, user_message)
        
        # Process message
        response_content = await process_message(request.chat_id, request.message)
        
        # Add assistant response to chat
        assistant_message = ChatMessage(
            role="assistant",
            content=response_content
        )
        add_message_to_chat(request.chat_id, assistant_message)
        
        return ChatResponse(
            chat_id=request.chat_id,
            message=assistant_message,
            status="success"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chats/{chat_id}/history")
async def get_chat(chat_id: str):
    """Get chat history"""
    try:
        messages = get_chat_history(chat_id)
        return {
            "chat_id": chat_id,
            "messages": messages,
            "status": "success"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving chat history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_message(chat_id: str, message: str) -> str:
    """Process a message using the Decryptify agent"""
    try:
        # Get or create memory for this chat
        memory = get_or_create_memory(chat_id)
        
        # Create the agent
        agent = create_react_agent(
            llm=llm,
            tools=tools,
            prompt=agent_prompt
        )
        
        # Create agent executor
        agent_executor = AgentExecutor(
            agent=agent,
            tools=tools,
            memory=memory,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=5
        )
        
        # Run the agent
        response = agent_executor.run(input=message)
        
        return response
        
    except Exception as e:
        print(f"Error in agent processing: {str(e)}")
        return f"I encountered an error processing your request: {str(e)}. Please try again."

# Vercel handler
app = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
