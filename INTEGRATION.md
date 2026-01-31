# Agent Integration Guide

## Architecture Overview

Your application now has **three layers** working together:

```
┌─────────────────────────────────────────────────────┐
│  Frontend (Next.js) - Port 3000                    │
│  • User interface                                   │
│  • Ingredient search                                │
│  • Recipe display                                   │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP Request
                   ▼
┌─────────────────────────────────────────────────────┐
│  Backend (Express.js) - Port 3001                  │
│  • API Gateway                                      │
│  • Request routing                                  │
│  • Response formatting                              │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP Request
                   ▼
┌─────────────────────────────────────────────────────┐
│  Agent (FastAPI/Python) - Port 8000                │
│  • AI-powered recipe generation                     │
│  • Hugging Face Mistral-7B model                   │
│  • Smart ingredient matching                        │
└─────────────────────────────────────────────────────┘
```

## How It Works

### 1. User Flow
1. User enters ingredients in the frontend
2. Frontend calls `/api/generate-recipes`
3. Next.js API route forwards to backend `/api/recipes`
4. Backend calls Python agent `/agent/recipes`
5. Agent uses AI to generate personalized recipes
6. Response flows back: Agent → Backend → Frontend → User

### 2. AI Integration
The Python agent uses:
- **Model**: Mistral-7B-Instruct (via Hugging Face)
- **Features**:
  - Generates recipes based on available ingredients
  - Lists missing ingredients needed
  - Provides reasoning for each suggestion
  - Returns structured JSON responses

## Quick Start

### Option 1: Start All Services at Once
```bash
./start-all.sh
```

### Option 2: Start Services Individually

**Terminal 1 - Python Agent:**
```bash
cd agent
python3 -m uvicorn recipe_agent:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

## API Endpoints

### Backend Endpoints (Port 3001)

#### Generate Recipes
```bash
POST /api/recipes
Content-Type: application/json

{
  "ingredients": ["chicken", "rice", "onion"],
  "filters": {
    "cuisine": ["asian"],
    "diet": ["gluten-free"]
  }
}
```

**Response:**
```json
{
  "recipes": [
    {
      "id": "chicken_rice_bowl",
      "name": "Asian Chicken Rice Bowl",
      "estimatedTime": "25 min",
      "ingredients": ["chicken", "rice", "onion", "soy sauce"],
      "missingIngredients": ["soy sauce"],
      "reason": "Simple one-bowl meal using your main ingredients"
    }
  ]
}
```

#### Get Recipe Details
```bash
POST /api/recipe/details
Content-Type: application/json

{
  "recipe_id": "chicken_rice_bowl",
  "ingredients": ["chicken", "rice", "onion"]
}
```

### Agent Endpoints (Port 8000)

#### Generate Recipe List
```bash
POST /agent/recipes
Content-Type: application/json

{
  "ingredients": ["tomato", "pasta", "garlic"]
}
```

#### Get Recipe Details
```bash
POST /agent/recipe/details
Content-Type: application/json

{
  "recipe_id": "pasta_marinara",
  "ingredients": ["tomato", "pasta", "garlic"]
}
```

#### Health Check
```bash
GET /health
```

## Configuration

### Backend (.env)
```bash
PORT=3001
AGENT_API_URL=http://localhost:8000
ANTHROPIC_API_KEY=your-key-here  # Optional
```

### Agent (.env)
```bash
HUGGINGFACE_API_KEY=your-key-here  # Optional - improves rate limits
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## Benefits of This Integration

### ✅ AI-Powered Results
- Recipes are generated dynamically based on user input
- Smart matching considers ingredient availability
- Personalized suggestions aligned with user preferences

### ✅ Flexible Architecture
- Easy to swap AI models (currently using Mistral-7B)
- Can add more agents for different cuisines
- Scalable for future features

### ✅ Fallback Support
- If agent is down, falls back to static recipes
- Graceful error handling
- Always returns usable results

### ✅ No API Key Required (Initially)
- Hugging Face Inference API works without auth
- Rate limits apply but suitable for development
- Can add API key later for production

## Troubleshooting

### Agent Not Responding
```bash
# Check if agent is running
curl http://localhost:8000/health

# View agent logs
tail -f /tmp/agent.log

# Restart agent
cd agent
python3 -m uvicorn recipe_agent:app --host 0.0.0.0 --port 8000
```

### Backend Can't Connect to Agent
```bash
# Check agent URL in backend
echo $AGENT_API_URL

# Test agent from backend server
curl -X POST http://localhost:8000/agent/recipes \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["test"]}'
```

### Frontend Shows Fallback Recipes
This means the backend or agent is unavailable. Check:
1. Is agent running on port 8000?
2. Is backend running on port 3001?
3. Check browser console for errors

## Testing the Integration

### 1. Test Agent Directly
```bash
curl -X POST http://localhost:8000/agent/recipes \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice", "vegetables"]}'
```

### 2. Test Backend
```bash
curl -X POST http://localhost:3001/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["pasta", "tomato", "basil"]}'
```

### 3. Test Frontend
Open browser: http://localhost:3000
1. Enter ingredients: "chicken, rice, garlic"
2. Click search
3. See AI-generated recipes!

## Next Steps

1. **Add API Key**: Get a Hugging Face API key for better rate limits
2. **Customize Prompts**: Edit `agent/recipe_agent.py` to adjust AI behavior
3. **Add More Features**: 
   - Recipe rating
   - Cooking time filters
   - Dietary restrictions
   - Step-by-step cooking mode

## Files Modified

- ✅ `backend/server.js` - Added `/api/recipes` endpoint
- ✅ `frontend/app/api/generate-recipes/route.ts` - Calls backend instead of static DB
- ✅ `frontend/.env.local` - Backend URL configuration
- ✅ `start-all.sh` - Convenient startup script
