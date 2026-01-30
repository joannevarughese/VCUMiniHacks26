import os
import json
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

# --------------------------------
# Hugging Face Configuration
# --------------------------------
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")  
HF_API_URL = "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2"

def call_huggingface_model(prompt: str, max_tokens: int = 1000) -> str:
    """
    Call Hugging Face Inference API
    """
    headers = {}
    if HF_API_KEY:
        headers["Authorization"] = f"Bearer {HF_API_KEY}"
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": max_tokens,
            "temperature": 0.5,
            "return_full_text": False
        }
    }
    
    response = requests.post(HF_API_URL, headers=headers, json=payload)
    
    if response.status_code != 200:
        raise Exception(f"Hugging Face API error: {response.status_code} - {response.text}")
    
    result = response.json()
    
    # Handle different response formats
    if isinstance(result, list) and len(result) > 0:
        return result[0].get("generated_text", "")
    elif isinstance(result, dict):
        return result.get("generated_text", "")
    
    return str(result)

# --------------------------------
# FastAPI app
# --------------------------------
app = FastAPI(title="Recipe List Generator (Hugging Face)", version="1.0.0")

# --------------------------------
# CORS Configuration
# --------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------
# Request models
# --------------------------------
class IngredientRequest(BaseModel):
    ingredients: List[str]

# --------------------------------
# Response models
# --------------------------------
class Recipe(BaseModel):
    id: str
    title: str
    missing: List[str]
    reason: str

class RecipeListResponse(BaseModel):
    recipes: List[Recipe]

# --------------------------------
# Generate recipe list endpoint
# --------------------------------
@app.post("/agent/recipes", response_model=RecipeListResponse)
def generate_recipe_list(req: IngredientRequest):
    """
    Generate a list of recipe suggestions based on user ingredients.
    """
    if not req.ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty")
    
    prompt = f"""You are a recipe discovery agent. Suggest 5 realistic recipes using mostly these ingredients: {', '.join(req.ingredients)}.

Return ONLY valid JSON in this exact format (no other text):
{{
  "recipes": [
    {{
      "id": "short_stable_id",
      "title": "Recipe Title",
      "missing": ["ingredient1"],
      "reason": "Why this recipe is good"
    }}
  ]
}}

Rules:
- Use mostly provided ingredients
- Avoid exotic ingredients
- Titles must be concise
- Return ONLY the JSON, nothing else"""

    try:
        response_text = call_huggingface_model(prompt, max_tokens=1500)
        
        # Extract JSON from response (sometimes models add extra text)
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start == -1 or json_end == 0:
            raise HTTPException(
                status_code=500,
                detail="Model did not return valid JSON"
            )
        
        json_str = response_text[json_start:json_end]
        
        # Parse JSON response
        try:
            result = json.loads(json_str)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse model response as JSON: {str(e)}"
            )
        
        # Validate response structure
        if "recipes" not in result:
            raise HTTPException(
                status_code=500,
                detail="Model response missing 'recipes' field"
            )
        
        # Validate with Pydantic model
        validated_response = RecipeListResponse(**result)
        return validated_response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

# --------------------------------
# Health check endpoint
# --------------------------------
@app.get("/health")
def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    return {
        "status": "healthy",
        "message": "Recipe List Generator API (Hugging Face) is running",
        "model": "mistralai/Mistral-7B-Instruct-v0.2"
    }

# --------------------------------
# Root endpoint
# --------------------------------
@app.get("/")
def root():
    """
    Root endpoint with API information.
    """
    return {
        "name": "Recipe List Generator API (Hugging Face)",
        "version": "1.0.0",
        "model": "mistralai/Mistral-7B-Instruct-v0.2",
        "endpoints": {
            "POST /agent/recipes": "Generate recipe suggestions from ingredients",
            "GET /health": "Health check",
            "GET /": "API information"
        }
    }