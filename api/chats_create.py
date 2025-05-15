import json
import os
from datetime import datetime
from uuid import uuid4
from typing import Optional

from pydantic import BaseModel
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from agent_logic import process_message

# Load environment variables
load_dotenv(
    dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../.env")
)

# Initialize Firebase
try:
    if not firebase_admin._apps:
        cred_path = os.getenv(
            "GOOGLE_APPLICATION_CREDENTIALS", "firebase-credentials.json"
        )
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    db = None


def create_chat_session(user_id: Optional[str], initial_message: str) -> str:
    chat_id = str(uuid4())
    if db:
        chat_data = {
            "chat_id": chat_id,
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "messages": [
                {
                    "role": "user",
                    "content": initial_message,
                    "timestamp": datetime.utcnow().isoformat(),
                }
            ],
        }
        db.collection("chats").document(chat_id).set(chat_data)
    return chat_id


def handler(request):
    if request.method != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method not allowed"}),
            "headers": {"Content-Type": "application/json"},
        }
    try:
        body = request.json()
        user_id = body.get("user_id")
        initial_message = body.get("initial_message")
        chat_id = create_chat_session(user_id, initial_message)
        # Process the initial message with the agent
        assistant_content = process_message(chat_id, initial_message)
        assistant_message = {
            "role": "assistant",
            "content": assistant_content,
            "timestamp": datetime.utcnow().isoformat(),
        }
        if db:
            chat_ref = db.collection("chats").document(chat_id)
            chat_ref.update(
                {
                    "messages": firestore.ArrayUnion([assistant_message]),
                    "updated_at": datetime.utcnow().isoformat(),
                }
            )
        return {
            "statusCode": 200,
            "body": json.dumps({"chat_id": chat_id, "status": "success"}),
            "headers": {"Content-Type": "application/json"},
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"},
        }
