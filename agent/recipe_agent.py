import os
import json
from typing import List, Optional
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
app = FastAPI(title="Recipe Agent API", version="1.0.0")

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

class RecipeDetailRequest(BaseModel):
    recipe_id: str
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

class Ingredient(BaseModel):
    name: str
    required: bool = True

class RecipeDetailResponse(BaseModel):
    title: str
    ingredients: List[Ingredient]
    steps: List[str]
    tips: Optional[List[str]] = []

# --------------------------------
# Generate recipe list
# --------------------------------
@app.post("/agent/recipes", response_model=RecipeListResponse)
def generate_recipe_list(req: IngredientRequest):
    """
    Generate a list of recipe suggestions based on user ingredients.
    """
    if not req.ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty")
    
    system_prompt = """
You are a recipe discovery agent.

Rules:
- Suggest 5 realistic recipes
- Use mostly provided ingredients
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
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Fixed: was "gpt-4.1-mini"
            temperature=0.4,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )

        content = response.choices[0].message.content
        
        # Parse and validate JSON
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
        
        # Validate with Pydantic
        validated_response = RecipeListResponse(**result)
        return validated_response

    except OpenAI.APIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# --------------------------------
# Generate recipe details
# --------------------------------
@app.post("/agent/recipe/details", response_model=RecipeDetailResponse)
def generate_recipe_details(req: RecipeDetailRequest):
    """
    Generate detailed recipe instructions based on recipe ID and user ingredients.
    """
    if not req.recipe_id:
        raise HTTPException(status_code=400, detail="Recipe ID cannot be empty")
    
    if not req.ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty")
    
    system_prompt = """
You are a cooking assistant.

Rules:
- Generate a complete realistic recipe
- Include step-by-step instructions
- Prefer user's ingredients
- Mention substitutions if needed
- Return ONLY valid JSON
"""

    user_prompt = f"""
Recipe ID:
{req.recipe_id}

User ingredients:
{req.ingredients}

Return format:
{{
  "title": "",
  "ingredients": [
    {{ "name": "", "required": true }}
  ],
  "steps": [
    "Step 1...",
    "Step 2..."
  ],
  "tips": []
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Fixed: was "gpt-4.1-mini"
            temperature=0.5,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )

        content = response.choices[0].message.content
        
        # Parse and validate JSON
        try:
            result = json.loads(content)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse LLM response as JSON: {str(e)}"
            )
        
        # Validate with Pydantic
        validated_response = RecipeDetailResponse(**result)
        return validated_response

    except OpenAI.APIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# --------------------------------
# Health check
# --------------------------------
@app.get("/health")
def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    return {"status": "healthy", "message": "Recipe Agent API is running"}