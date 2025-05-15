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
    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "model": "gemini-1.5-pro",
                "api_key_set": bool(os.getenv("GOOGLE_API_KEY")),
                "status": "success",
            }
        ),
        "headers": {"Content-Type": "application/json"},
    }
