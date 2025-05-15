import json
import os
from datetime import datetime
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


def add_message_to_chat(chat_id: str, message: dict):
    if db:
        chat_ref = db.collection("chats").document(chat_id)
        chat_ref.update(
            {
                "messages": firestore.ArrayUnion([message]),
                "updated_at": datetime.utcnow().isoformat(),
            }
        )


def handler(request):
    if request.method != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method not allowed"}),
            "headers": {"Content-Type": "application/json"},
        }
    try:
        body = request.json()
        chat_id = body.get("chat_id")
        message = body.get("message")
        if not chat_id or not message:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "chat_id and message required"}),
                "headers": {"Content-Type": "application/json"},
            }
        user_message = {
            "role": "user",
            "content": message,
            "timestamp": datetime.utcnow().isoformat(),
        }
        add_message_to_chat(chat_id, user_message)
        # Call agent logic for assistant response
        assistant_content = process_message(chat_id, message)
        assistant_message = {
            "role": "assistant",
            "content": assistant_content,
            "timestamp": datetime.utcnow().isoformat(),
        }
        add_message_to_chat(chat_id, assistant_message)
        return {
            "statusCode": 200,
            "body": json.dumps(
                {"chat_id": chat_id, "message": assistant_message, "status": "success"}
            ),
            "headers": {"Content-Type": "application/json"},
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"},
        }
