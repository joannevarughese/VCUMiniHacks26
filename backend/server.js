import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Agent API URL (Python FastAPI service)
const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8000';

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'VCU Mini Hacks Backend API is running!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Recipe generation endpoint using Python agent
app.post('/api/recipes', async (req, res) => {
  try {
    const { ingredients, filters } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }

    console.log(`Calling agent with ingredients: ${ingredients.join(', ')}`);

    // Call the Python FastAPI agent
    const agentResponse = await fetch(`${AGENT_API_URL}/agent/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients }),
    });

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error('Agent API error:', errorText);
      return res.status(500).json({ 
        error: 'Agent API failed',
        details: errorText 
      });
    }

    const agentData = await agentResponse.json();
    
    // Transform agent response to match frontend format
    const recipes = agentData.recipes.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      estimatedTime: "25 min", // Default time
      ingredients: ingredients.concat(recipe.missing || []),
      steps: [], // Steps can be fetched separately via /api/recipe/details
      missingIngredients: recipe.missing || [],
      reason: recipe.reason,
    }));

    res.json({ recipes });

  } catch (error) {
    console.error('Error calling agent:', error);
    res.status(500).json({
      error: 'Failed to generate recipes',
      details: error.message,
    });
  }
});

// Recipe details endpoint using Python agent
app.post('/api/recipe/details', async (req, res) => {
  try {
    const { recipe_id, ingredients } = req.body;

    if (!recipe_id) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }

    // Call the Python FastAPI agent for details
    const agentResponse = await fetch(`${AGENT_API_URL}/agent/recipe/details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipe_id, ingredients }),
    });

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error('Agent API error:', errorText);
      return res.status(500).json({ 
        error: 'Agent API failed',
        details: errorText 
      });
    }

    const recipeDetails = await agentResponse.json();
    res.json(recipeDetails);

  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).json({
      error: 'Failed to fetch recipe details',
      details: error.message,
    });
  }
});

// Claude API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'claude-3-5-sonnet-20241022' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    res.json({
      response: response.content[0].text,
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({
      error: 'Failed to process request',
      details: error.message,
    });
  }
});

// Claude streaming endpoint
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message, model = 'claude-3-5-sonnet-20241022' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await anthropic.messages.create({
      model: model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error streaming from Claude API:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Anthropic API Key configured: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
});
