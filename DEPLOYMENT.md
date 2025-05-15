# Decryptify Deployment Guide

This guide walks you through deploying Decryptify to Vercel (frontend and backend as serverless functions).

## Prerequisites

- Node.js 16+ and npm installed
- Python 3.9+ installed
- Vercel account (free tier works)
- Google Cloud account (for Firestore)
- API keys:
  - Google Gemini API key
  - CoinGecko API key (optional)
  - Firebase credentials

## Step 1: Clone and Setup

```bash
git clone <your-repo-url>
cd decryptify-web
```

## Step 2: Backend Setup

### 2.1 Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2.2 Environment Variables

Create a `.env` file in the backend directory:

```env
GOOGLE_API_KEY=your-google-gemini-api-key
COINGECKO_API_KEY=your-coingecko-api-key
GOOGLE_APPLICATION_CREDENTIALS=path-to-firebase-credentials.json
ALLOWED_ORIGINS=http://localhost:3000,https://your-vercel-domain.vercel.app
```

### 2.3 Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Create a service account:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Save as `firebase-credentials.json` in backend directory

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd ../frontend
npm install
```

### 3.2 Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Step 4: Deploy to Vercel

### 4.1 Prepare for Deployment

Create a `vercel.json` file in the root directory:

```json
{
  "functions": {
    "backend/api.py": {
      "runtime": "python3.9"
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

### 4.2 Deploy Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Which scope: Choose your account
# - Link to existing project: N
# - Project name: decryptify-web
# - Directory: ./
# - Override settings: N
```

### 4.3 Configure Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Settings > Environment Variables
3. Add the following:

```
GOOGLE_API_KEY=your-google-gemini-api-key
COINGECKO_API_KEY=your-coingecko-api-key
GOOGLE_APPLICATION_CREDENTIALS=firebase-credentials.json
NEXT_PUBLIC_API_URL=https://your-project.vercel.app
```

4. Upload your Firebase credentials:
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add the contents of `firebase-credentials.json` as a variable
   - Or use Vercel CLI: `vercel secrets add firebase-creds < firebase-credentials.json`

### 4.4 Redeploy with Environment Variables

```bash
vercel --prod
```

## Step 5: Alternative Deployment Options

### Option A: Deploy Backend Separately

If you prefer to deploy the backend separately:

1. Deploy backend to any Python hosting service (Render, Railway, etc.)
2. Update `NEXT_PUBLIC_API_URL` in Vercel to point to your backend URL
3. Ensure CORS is configured correctly

### Option B: Use Vercel Functions

Convert the FastAPI app to Vercel Functions:

1. Create `api` directory in root
2. Move backend logic to `api/index.py`
3. Adjust imports and routing for Vercel Functions format

## Step 6: Local Development

For local development:

```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn api:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Step 7: Testing

After deployment:

1. Visit your Vercel URL
2. Test the chat functionality
3. Check browser console for errors
4. Monitor Vercel function logs

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `ALLOWED_ORIGINS` includes your Vercel domain
   - Check that API routes are correctly configured

2. **Environment Variables Not Working**
   - Redeploy after adding environment variables
   - Check Vercel function logs for errors

3. **Firebase Connection Issues**
   - Verify credentials are correctly formatted
   - Ensure Firestore is enabled in Firebase console

4. **API Rate Limits**
   - Monitor usage of external APIs
   - Implement caching if needed

### Logs and Monitoring

- View logs in Vercel dashboard: Functions > Logs
- Check browser developer console for frontend errors
- Monitor Firebase console for database issues

## Security Considerations

1. Never commit API keys or credentials to git
2. Use environment variables for all sensitive data
3. Enable CORS properly
4. Implement rate limiting for production
5. Regular security audits of dependencies

## Support

For issues or questions:
1. Check the logs in Vercel dashboard
2. Review error messages in browser console
3. Ensure all environment variables are set correctly
4. Verify API keys are valid and have proper permissions

---

**Note**: This deployment uses Vercel's serverless functions. For high-traffic applications, consider deploying the backend to a dedicated server for better performance and cost efficiency.
