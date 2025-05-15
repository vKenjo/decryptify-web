import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(
    dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../.env")
)


def handler(request):
    if request.method != "GET":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method not allowed"}),
            "headers": {"Content-Type": "application/json"},
        }
    agents = [
        {
            "name": "Decryptify Main Agent",
            "description": "Orchestrates all agents for comprehensive crypto trust assessment",
        },
        {
            "name": "Coin Info Agent",
            "description": "Provides comprehensive cryptocurrency market data and analysis",
        },
        {
            "name": "Crypto Scam Agent",
            "description": "Detects and analyzes cryptocurrency scam risks",
        },
        {
            "name": "ChainBroker Agent",
            "description": "Analyzes cryptocurrency broker and exchange data",
        },
        {
            "name": "CertiK Agent",
            "description": "Analyzes smart contract security audits and vulnerabilities",
        },
        {
            "name": "Founder Info Agent",
            "description": "Investigates founder background and credibility",
        },
        {
            "name": "Project Info Agent",
            "description": "Gathers and analyzes project information from various sources",
        },
        {
            "name": "Trust Agent",
            "description": "Synthesizes all information to provide a trust score (0-10)",
        },
    ]
    return {
        "statusCode": 200,
        "body": json.dumps({"agents": agents, "status": "success"}),
        "headers": {"Content-Type": "application/json"},
    }
