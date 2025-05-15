import json


def handler(request):
    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": "Welcome to Decryptify API (Vercel serverless)",
                "version": "2.0.0",
                "description": "AI-powered crypto analysis and trust assessment",
            }
        ),
        "headers": {"Content-Type": "application/json"},
    }
