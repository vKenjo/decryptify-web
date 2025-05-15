import json
import os
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

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


def get_chat_history(chat_id: str):
    if not db:
        return []
    chat_ref = db.collection("chats").document(chat_id)
    chat_doc = chat_ref.get()
    if not chat_doc.exists:
        return None
    chat_data = chat_doc.to_dict()
    return chat_data.get("messages", [])


def handler(request):
    if request.method != "GET":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method not allowed"}),
            "headers": {"Content-Type": "application/json"},
        }
    try:
        chat_id = request.query.get("chat_id") or request.path_params.get("chat_id")
        if not chat_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "chat_id required"}),
                "headers": {"Content-Type": "application/json"},
            }
        messages = get_chat_history(chat_id)
        if messages is None:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Chat not found"}),
                "headers": {"Content-Type": "application/json"},
            }
        return {
            "statusCode": 200,
            "body": json.dumps(
                {"chat_id": chat_id, "messages": messages, "status": "success"}
            ),
            "headers": {"Content-Type": "application/json"},
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"},
        }
