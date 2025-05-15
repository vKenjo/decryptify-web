import os
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate

# Import agent tools
from backend.agents.coin_info import coin_info_tool
from backend.agents.crypto_scam import crypto_scam_tool
from backend.agents.certik import certik_tool
from backend.agents.chainbroker import chainbroker_tool
from backend.agents.founder_info import founder_info_tool
from backend.agents.project_info import project_info_tool
from backend.agents.trust_score import trust_score_tool
from backend.agents.decryptify import decryptify_tool, decryptify_analysis

# Load environment variables
load_dotenv(
    dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../.env")
)

llm = ChatOpenAI(
    model="gpt-4o-mini",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    temperature=0.7,
)

tools = [
    decryptify_tool,
    coin_info_tool,
    crypto_scam_tool,
    certik_tool,
    chainbroker_tool,
    founder_info_tool,
    project_info_tool,
    trust_score_tool,
]

agent_prompt = PromptTemplate.from_template(
    """You are Decryptify, an AI-powered crypto trust assessment system. You help users evaluate the trustworthiness of cryptocurrency projects by analyzing various aspects.\n\nAvailable tools:\n{tools}\n\nWhen a user asks about a cryptocurrency project, use the decryptify_orchestrator tool FIRST for a comprehensive analysis. Only use individual tools if the user specifically asks for targeted information.\n\nFor general crypto questions, use your knowledge to provide helpful information.\n\nCurrent conversation:\n{chat_history}\n\nUser: {input}\n\n{agent_scratchpad}\n"""
)

# In-memory chat memory (stateless workaround for serverless)
chat_memory_store = {}


def process_message(chat_id: str, message: str) -> str:
    # Use in-memory conversation for this invocation
    memory = chat_memory_store.get(chat_id)
    if not memory:
        memory = ConversationBufferMemory(return_messages=True)
        chat_memory_store[chat_id] = memory

    crypto_keywords = [
        "bitcoin",
        "btc",
        "ethereum",
        "eth",
        "crypto",
        "coin",
        "token",
        "trust",
        "score",
        "analysis",
        "check",
        "evaluate",
        "assess",
    ]
    message_lower = message.lower()
    is_crypto_query = any(keyword in message_lower for keyword in crypto_keywords)
    if is_crypto_query:
        project_name = message
        for phrase in [
            "what's the trust score for",
            "what is the trust score of",
            "analyze",
            "check",
            "evaluate",
            "assess",
            "tell me about",
        ]:
            if phrase in message_lower:
                project_name = message_lower.split(phrase)[-1].strip()
                break
        project_name = project_name.strip("?.,!").strip()
        if len(project_name.split()) <= 3:
            response = decryptify_analysis(project_name, llm=llm)
            memory.chat_memory.add_user_message(message)
            memory.chat_memory.add_ai_message(response)
            return response
    agent = create_react_agent(llm=llm, tools=tools, prompt=agent_prompt)
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        memory=memory,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=3,
        tool_names=[tool.name for tool in tools],
    )
    response = agent_executor.run(input=message)
    return response
