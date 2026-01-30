import os
import json
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

# --------------------------------
# OpenAI client
# --------------------------------
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --------------------------------
# FastAPI app
# --------------------------------
app = FastAPI(title="Recipe List Generator", version="1.0.0")

# --------------------------------
# CORS Configuration
# --------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production (e.g., ["http://localhost:3000"])
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
    
    Args:
        req: IngredientRequest containing list of available ingredients
        
    Returns:
        RecipeListResponse with 5 suggested recipes
        
    Raises:
        HTTPException: If ingredients are empty or API call fails
    """
    # Validate input
    if not req.ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty")
    
    system_prompt = """
You are a recipe discovery agent.

Rules:
- Suggest 5 realistic recipes
- Recipes must mostly use provided ingredients
- Avoid exotic ingredients
- Do NOT include cooking steps
- Titles must be concise
- Return ONLY valid JSON
"""

    user_prompt = f"""
User ingredients:
{req.ingredients}

Return format:
{{
  "recipes": [
    {{
      "id": "short_stable_id",
      "title": "",
      "missing": [],
      "reason": ""
    }}
  ]
}}
"""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Fixed: was "gpt-4.1-mini" which doesn't exist
            temperature=0.4,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )

        content = response.choices[0].message.content
        
        # Parse JSON response
        try:
            result = json.loads(content)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse LLM response as JSON: {str(e)}"
            )
        
        # Validate response structure
        if "recipes" not in result:
            raise HTTPException(
                status_code=500,
                detail="LLM response missing 'recipes' field"
            )
        
        # Validate with Pydantic model
        validated_response = RecipeListResponse(**result)
        return validated_response

    except OpenAI.APIError as e:
        raise HTTPException(
            status_code=500,
            detail=f"OpenAI API error: {str(e)}"
        )
    except HTTPException:
        # Re-raise HTTPExceptions as-is
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
    
    Returns:
        Dictionary with status and message
    """
    return {
        "status": "healthy",
        "message": "Recipe List Generator API is running"
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
        "name": "Recipe List Generator API",
        "version": "1.0.0",
        "endpoints": {
            "POST /agent/recipes": "Generate recipe suggestions from ingredients",
            "GET /health": "Health check",
            "GET /": "API information"
        }
    }