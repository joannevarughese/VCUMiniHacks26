# VCU Mini Hacks 26 - Backend

Backend server built with Node.js, Express.js, and Anthropic Claude API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### GET /
Health check endpoint - returns a welcome message

### GET /health
Returns server health status

### POST /api/chat
Send a message to Claude AI

**Request Body:**
```json
{
  "message": "Your question here",
  "model": "claude-3-5-sonnet-20241022" // optional
}
```

**Response:**
```json
{
  "response": "Claude's response",
  "model": "claude-3-5-sonnet-20241022",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 25
  }
}
```

### POST /api/chat/stream
Stream responses from Claude AI (Server-Sent Events)

**Request Body:**
```json
{
  "message": "Your question here",
  "model": "claude-3-5-sonnet-20241022" // optional
}
```

**Response:**
Server-Sent Events stream with text chunks

## Environment Variables

- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
- `PORT` - Server port (default: 3001)

## Technologies

- Node.js
- Express.js
- Anthropic Claude API (@anthropic-ai/sdk)
- CORS
- dotenv
