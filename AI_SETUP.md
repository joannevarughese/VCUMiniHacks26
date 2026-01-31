# AI Integration: OpenAI + Hugging Face

The agent now supports **dual AI providers** with intelligent fallback:

## 🤖 AI Provider Priority

1. **OpenAI (GPT-3.5-turbo)** - Fastest and most reliable
2. **Hugging Face (Mistral-7B)** - Free alternative
3. **Programmatic Fallback** - Always works, no API needed

## 📝 Setup Instructions

### Option 1: Use OpenAI (Recommended)

**Why OpenAI?**
- ✅ Faster response times (< 2 seconds)
- ✅ More reliable and consistent
- ✅ Better quality recipe suggestions
- ✅ No rate limiting issues

**Setup:**

1. Get an OpenAI API key from: https://platform.openai.com/api-keys

2. Add to `agent/.env`:
   ```bash
   OPENAI_API_KEY=sk-proj-your-key-here
   ```

3. Restart the agent:
   ```bash
   cd agent
   python3 -m uvicorn recipe_agent:app --host 0.0.0.0 --port 8000
   ```

### Option 2: Use Hugging Face (Free)

**Note:** Currently experiencing authentication issues, but included as fallback.

Add to `agent/.env`:
```bash
HUGGINGFACE_API_KEY=hf_your-key-here
```

### Option 3: No API Keys (Programmatic)

The agent will automatically use intelligent programmatic recipe generation if no API keys are configured. This works great for demos and testing!

## 🧪 Testing

Test the agent:
```bash
# Check which providers are configured
curl http://localhost:8000/health

# Generate recipes
curl -X POST http://localhost:8000/agent/recipes \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["chicken", "rice", "garlic"]}'
```

## 🎯 How It Works

```
User Request
    ↓
Try OpenAI (if key configured)
    ↓ (if fails)
Try Hugging Face (if key configured)
    ↓ (if fails)
Use Programmatic Fallback (always works)
    ↓
Return Recipes
```

## 💰 Costs

- **OpenAI GPT-3.5-turbo**: ~$0.001 per request (very cheap)
- **Hugging Face**: Free (with rate limits)
- **Programmatic**: Free (no external API)

## 🚀 Current Status

All three services are running:
- ✅ **Agent** (Port 8000): Multi-provider AI with fallback
- ✅ **Backend** (Port 3001): API gateway
- ✅ **Frontend** (Port 3000): User interface

## 📊 Example Response

With OpenAI:
```json
{
  "recipes": [
    {
      "id": "garlic_chicken_rice",
      "title": "Garlic Butter Chicken with Rice",
      "missing": ["butter", "lemon"],
      "reason": "Classic comfort food that makes the most of your chicken, rice, and garlic"
    },
    {
      "id": "chicken_fried_rice",
      "title": "Chicken Fried Rice",
      "missing": ["soy sauce", "egg"],
      "reason": "Popular Asian dish perfect for using leftover rice"
    }
  ]
}
```

## 🔧 Troubleshooting

**"OpenAI API key not configured"**
- Add your key to `agent/.env`
- Restart the agent

**"401 Unauthorized"**
- Check your API key is valid
- Verify it has credits/billing enabled

**Slow responses**
- OpenAI is usually fast (< 2s)
- Hugging Face can be slow (10-30s)
- Programmatic is instant

## 🎨 For Hackathon Demo

**Recommended setup:**
1. Add OpenAI API key for best results
2. The system falls back gracefully if API fails
3. Always returns results, never errors

**Without API key:**
- Still works great with programmatic generation
- Shows intelligent recipe matching
- Perfect for proof of concept
