# DeCryptify Web - Complete Deployment Guide

A comprehensive crypto trust assessment system with Next.js frontend and Python backend using LangChain and Google's AI Studio agents.

## Architecture

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI with LangChain agents
- **AI**: Google AI Studio (Gemini Pro) via LangChain
- **Database**: Firebase Firestore
- **Deployment**: Vercel (supports both frontend and Python backend)

## Prerequisites

- Node.js 18+ installed
- Python 3.9+ installed
- Google Cloud account with AI Studio API access
- Firebase project with Firestore enabled
- Vercel account

## Project Structure

```
decryptify-web/
├── frontend/           # Next.js frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.local
├── backend/           # Python FastAPI backend with agents
│   ├── agents/       # Crypto analysis agents
│   ├── api.py       # Main API server
│   ├── requirements.txt
│   └── .env
└── vercel.json      # Vercel deployment configuration
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd decryptify-web
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Backend Environment Configuration

Create a `.env` file in the backend directory:

```env
# Google AI API Configuration
GOOGLE_API_KEY=your_google_ai_studio_api_key

# Firebase Admin SDK (for Firestore)
GOOGLE_APPLICATION_CREDENTIALS=path/to/firebase-credentials.json

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Optional: Model Configuration
MODEL_NAME=gemini-pro
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Click "Generate new private key"
6. Save the JSON file as `firebase-credentials.json` in the backend directory
7. Update the path in your `.env` file

### 5. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 6. Frontend Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 7. Run Development Servers

In separate terminals:

**Backend:**
```bash
cd backend
# Make sure virtual environment is activated
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Available Agents

The backend includes specialized crypto analysis agents:

1. **DeCryptify Orchestrator**: Main agent that coordinates all other agents
2. **Coin Info Agent**: Provides market data and cryptocurrency information
3. **CertiK Agent**: Analyzes smart contract security audits
4. **ChainBroker Agent**: Evaluates broker and exchange data
5. **Crypto Scam Agent**: Detects potential scam indicators
6. **Founder Info Agent**: Investigates project founder backgrounds
7. **Project Info Agent**: Gathers comprehensive project data
8. **Trust Score Agent**: Calculates final trust score (0-10)

## Production Deployment on Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from project root:
```bash
vercel
```

3. Follow prompts and set environment variables when asked.

### Option 2: Deploy via GitHub

1. Push your code to GitHub

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Import your repository

4. Configure environment variables:
   ```
   # Backend (Function) Environment Variables
   GOOGLE_API_KEY=your_google_ai_studio_api_key
   GOOGLE_APPLICATION_CREDENTIALS=firebase-credentials.json
   ALLOWED_ORIGINS=https://your-domain.vercel.app
   
   # Frontend Environment Variables
   NEXT_PUBLIC_BACKEND_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

5. Deploy

### Option 3: Manual Configuration

1. Create a vercel.json in the root directory:
```json
{
  "functions": {
    "backend/api.py": {
      "runtime": "python3.9",
      "maxDuration": 60
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/backend/api.py"
    }
  ]
}
```

2. Deploy via Vercel Dashboard with appropriate settings

## Environment Variables for Production

### Backend (Vercel Functions):
- `GOOGLE_API_KEY`: Your Google AI Studio API key
- `GOOGLE_APPLICATION_CREDENTIALS`: Firebase credentials (upload file to Vercel)
- `ALLOWED_ORIGINS`: Your production domain

### Frontend:
- `NEXT_PUBLIC_BACKEND_URL`: Your production URL
- `NEXT_PUBLIC_SITE_URL`: Your production URL

## API Endpoints

- `GET /`: API root and welcome message
- `GET /api/agents`: List all available agents
- `GET /api/model`: Get current model information
- `POST /api/chats/create`: Create new chat session
- `POST /api/chats/message`: Send message to existing chat
- `GET /api/chats/{chat_id}/history`: Get chat history

## Features

- ✅ Comprehensive crypto trust assessment
- ✅ Multiple specialized AI agents
- ✅ Persistent chat history in Firestore
- ✅ Real-time response processing
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Production-ready deployment

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `ALLOWED_ORIGINS` includes your frontend URL
2. **Firebase Connection**: Verify credentials file path and permissions
3. **API Key Issues**: Check Google AI Studio API key is valid
4. **Agent Errors**: Review agent logs in backend console

### Development Tips

1. Use the API documentation at `/docs` for testing endpoints
2. Check browser console for frontend errors
3. Monitor backend logs for agent processing details
4. Use Firestore console to verify data persistence

## Performance Optimization

- Agents have a 3-iteration limit to prevent loops
- Chat sessions are stored in memory for faster access
- Firestore queries are optimized with proper indexing
- Frontend implements proper error handling and loading states

## Security Notes

- Google API keys are server-side only
- Firebase credentials are never exposed to client
- CORS is properly configured for production
- All agent responses are sanitized

## Future Enhancements

- Add user authentication
- Implement rate limiting
- Add more specialized agents
- Create admin dashboard
- Add real-time streaming responses
- Implement agent result caching

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

- Google AI Studio: [Documentation](https://ai.google.dev/docs)
- LangChain: [Documentation](https://docs.langchain.com/)
- Firebase: [Documentation](https://firebase.google.com/docs)
- Vercel: [Documentation](https://vercel.com/docs)

## License

[Your License Here]
