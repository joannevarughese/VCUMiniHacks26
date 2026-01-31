import os
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

# --------------------------------
# API Configuration
# --------------------------------
# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

# Hugging Face Configuration
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")  
HF_API_URL = "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2"

def call_openai_model(prompt: str, max_tokens: int = 1500) -> str:
    """
    Call OpenAI API (GPT-3.5-turbo or GPT-4)
    """
    if not OPENAI_API_KEY:
        print("OpenAI API key not configured")
        return None
    
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-3.5-turbo",  # or "gpt-4" for better results
        "messages": [
            {
                "role": "system",
                "content": "You are a creative recipe assistant. Always respond with valid JSON only, no additional text."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(OPENAI_API_URL, headers=headers, json=payload, timeout=15)
        
        if response.status_code != 200:
            print(f"OpenAI API Error: {response.status_code} - {response.text}")
            return None
        
        result = response.json()
        
        if "choices" in result and len(result["choices"]) > 0:
            return result["choices"][0]["message"]["content"]
        
        return None
    except Exception as e:
        print(f"OpenAI API Exception: {str(e)}")
        return None

def call_huggingface_model(prompt: str, max_tokens: int = 1000) -> str:
    """
    Call Hugging Face Inference API with timeout and fallback
    """
    headers = {}
    if HF_API_KEY:
        headers["Authorization"] = f"Bearer {HF_API_KEY}"
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": max_tokens,
            "temperature": 0.7,
            "return_full_text": False,
            "top_p": 0.95
        }
    }
    
    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload, timeout=10)
        
        if response.status_code != 200:
            print(f"HF API Error: {response.status_code} - {response.text}")
            return None
        
        result = response.json()
        
        # Handle different response formats
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "")
        elif isinstance(result, dict):
            return result.get("generated_text", "")
        
        return None
    except Exception as e:
        print(f"HF API Exception: {str(e)}")
        return None

    return str(result)

# --------------------------------
# Fallback Recipe Generator
# --------------------------------
def generate_fallback_recipes(ingredients: List[str]) -> List[dict]:
    """Generate diverse recipes programmatically when AI is unavailable"""
    recipes = []
    ing_lower = [i.lower() for i in ingredients]
    ing_str = ', '.join(ingredients[:3])
    
    # Recipe templates based on common ingredients with MORE variety
    
    # Protein-based recipes
    if any(i in ing_lower for i in ['chicken', 'beef', 'pork', 'turkey', 'lamb']):
        protein = next((i for i in ingredients if i.lower() in ['chicken', 'beef', 'pork', 'turkey', 'lamb']), ingredients[0])
        recipes.extend([
            {
                "id": "protein_stir_fry",
                "title": f"{protein.title()} Stir Fry",
                "missing": ["soy sauce", "ginger"],
                "reason": "Quick Asian-inspired meal ready in 20 minutes"
            },
            {
                "id": "protein_grilled",
                "title": f"Grilled {protein.title()} with Herbs",
                "missing": ["herbs", "lemon"],
                "reason": "Healthy grilled option with simple seasoning"
            },
            {
                "id": "protein_curry",
                "title": f"{protein.title()} Curry",
                "missing": ["curry powder", "coconut milk"],
                "reason": "Flavorful one-pot meal with rich spices"
            }
        ])
    
    # Pasta dishes
    if any(i in ing_lower for i in ['pasta', 'noodles', 'spaghetti', 'linguine', 'penne']):
        recipes.extend([
            {
                "id": "pasta_aglio_olio",
                "title": f"{ing_str.title()} Aglio e Olio",
                "missing": ["garlic", "olive oil", "chili flakes"],
                "reason": "Classic Italian pasta, simple and delicious"
            },
            {
                "id": "pasta_baked",
                "title": f"Baked {ing_str.title()} Casserole",
                "missing": ["cheese", "breadcrumbs"],
                "reason": "Comforting baked pasta perfect for meal prep"
            },
            {
                "id": "pasta_primavera",
                "title": f"{ing_str.title()} Primavera",
                "missing": ["mixed vegetables", "cream"],
                "reason": "Light and fresh pasta with seasonal vegetables"
            }
        ])
    
    # Rice dishes
    if any(i in ing_lower for i in ['rice', 'quinoa', 'couscous']):
        grain = next((i for i in ingredients if i.lower() in ['rice', 'quinoa', 'couscous']), 'rice')
        recipes.extend([
            {
                "id": "rice_bowl",
                "title": f"{ing_str.title()} Power Bowl",
                "missing": ["avocado", "sesame seeds"],
                "reason": "Nutritious and filling bowl with balanced ingredients"
            },
            {
                "id": "fried_rice",
                "title": f"{ing_str.title()} Fried Rice",
                "missing": ["soy sauce", "egg", "green onions"],
                "reason": "Popular Asian dish, great for using leftovers"
            },
            {
                "id": "rice_pilaf",
                "title": f"{grain.title()} Pilaf",
                "missing": ["onion", "broth"],
                "reason": "Aromatic side dish that pairs with any protein"
            }
        ])
    
    # Egg dishes
    if any(i in ing_lower for i in ['egg', 'eggs']):
        recipes.extend([
            {
                "id": "egg_omelette",
                "title": f"{ing_str.title()} Omelette",
                "missing": ["butter", "cheese"],
                "reason": "Quick protein-packed breakfast or lunch"
            },
            {
                "id": "egg_frittata",
                "title": f"{ing_str.title()} Frittata",
                "missing": ["milk", "herbs"],
                "reason": "Italian-style baked egg dish, great for brunch"
            },
            {
                "id": "egg_scramble",
                "title": f"{ing_str.title()} Scramble",
                "missing": ["cream", "chives"],
                "reason": "Fluffy scrambled eggs with your ingredients"
            }
        ])
    
    # Vegetable-based recipes
    if any(i in ing_lower for i in ['tomato', 'tomatoes', 'pepper', 'onion', 'carrot', 'broccoli', 'spinach']):
        recipes.extend([
            {
                "id": "veggie_salad",
                "title": f"Fresh {ing_str.title()} Salad",
                "missing": ["olive oil", "vinegar"],
                "reason": "Crisp and refreshing raw vegetable salad"
            },
            {
                "id": "veggie_roasted",
                "title": f"Roasted {ing_str.title()}",
                "missing": ["olive oil", "herbs"],
                "reason": "Caramelized roasted vegetables with herbs"
            },
            {
                "id": "veggie_soup",
                "title": f"{ing_str.title()} Soup",
                "missing": ["broth", "garlic"],
                "reason": "Warming soup perfect for any season"
            }
        ])
    
    # Fish and seafood
    if any(i in ing_lower for i in ['fish', 'salmon', 'tuna', 'cod', 'shrimp', 'prawns']):
        seafood = next((i for i in ingredients if i.lower() in ['fish', 'salmon', 'tuna', 'cod', 'shrimp', 'prawns']), ingredients[0])
        recipes.extend([
            {
                "id": "seafood_baked",
                "title": f"Baked {seafood.title()} with Lemon",
                "missing": ["lemon", "butter", "herbs"],
                "reason": "Healthy baked seafood with citrus flavors"
            },
            {
                "id": "seafood_pan_seared",
                "title": f"Pan-Seared {seafood.title()}",
                "missing": ["garlic", "white wine"],
                "reason": "Restaurant-quality seafood in minutes"
            }
        ])
    
    # Bread-based
    if any(i in ing_lower for i in ['bread', 'toast', 'baguette']):
        recipes.extend([
            {
                "id": "toast_avocado",
                "title": f"{ing_str.title()} Toast",
                "missing": ["avocado", "seasoning"],
                "reason": "Trendy and nutritious breakfast or snack"
            },
            {
                "id": "sandwich",
                "title": f"{ing_str.title()} Sandwich",
                "missing": ["lettuce", "mayo"],
                "reason": "Classic sandwich packed with your ingredients"
            }
        ])
    
    # Default/mixed recipes if none of the above match
    if not recipes:
        recipes = [
            {
                "id": "mixed_sauté",
                "title": f"{ing_str.title()} Sauté",
                "missing": ["oil", "seasoning"],
                "reason": "Simple sautéed dish highlighting your ingredients"
            },
            {
                "id": "mixed_stew",
                "title": f"{ing_str.title()} Stew",
                "missing": ["broth", "herbs"],
                "reason": "Hearty stew combining your ingredients"
            },
            {
                "id": "mixed_casserole",
                "title": f"{ing_str.title()} Casserole",
                "missing": ["cheese", "breadcrumbs"],
                "reason": "Comforting baked casserole dish"
            },
            {
                "id": "mixed_bowl",
                "title": f"{ing_str.title()} Buddha Bowl",
                "missing": ["tahini", "greens"],
                "reason": "Nutritious bowl with balanced ingredients"
            },
            {
                "id": "mixed_wrap",
                "title": f"{ing_str.title()} Wrap",
                "missing": ["tortilla", "sauce"],
                "reason": "Quick and portable wrap with your ingredients"
            },
            {
                "id": "mixed_skillet",
                "title": f"One-Pan {ing_str.title()} Skillet",
                "missing": ["onion", "garlic"],
                "reason": "Easy one-pan meal, minimal cleanup"
            },
            {
                "id": "mixed_mediterranean",
                "title": f"Mediterranean {ing_str.title()} Plate",
                "missing": ["olive oil", "lemon"],
                "reason": "Healthy Mediterranean-inspired dish"
            },
            {
                "id": "mixed_tacos",
                "title": f"{ing_str.title()} Tacos",
                "missing": ["tortillas", "salsa"],
                "reason": "Fun and customizable taco night"
            },
            {
                "id": "mixed_grain_bowl",
                "title": f"{ing_str.title()} Grain Bowl",
                "missing": ["quinoa", "dressing"],
                "reason": "Wholesome grain bowl packed with nutrition"
            },
            {
                "id": "mixed_pizza",
                "title": f"{ing_str.title()} Pizza",
                "missing": ["dough", "cheese"],
                "reason": "Homemade pizza with your favorite toppings"
            }
        ]
    
    return recipes[:10]  # Return max 10 recipes

# --------------------------------
# FastAPI app
# --------------------------------
app = FastAPI(title="Recipe Agent API (Hugging Face)", version="1.0.0")

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
    Uses AI when available, falls back to programmatic generation.
    """
    if not req.ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty")
    
    prompt = f"""You are a creative recipe discovery agent. Suggest 10 diverse and realistic recipes using mostly these ingredients: {', '.join(req.ingredients)}.

Return ONLY valid JSON in this exact format (no other text):
{{
  "recipes": [
    {{
      "id": "short_stable_id",
      "title": "Recipe Title",
      "missing": ["ingredient1", "ingredient2"],
      "reason": "Why this recipe is good"
    }}
  ]
}}

Rules:
- Generate 10 different recipes with variety (different cuisines, cooking methods, meal types)
- Use mostly provided ingredients
- Include options for breakfast, lunch, dinner, and snacks
- Vary cooking styles: quick meals, slow-cooked, baked, fried, grilled, raw/salads
- Keep missing ingredients minimal and common
- Titles must be appetizing and concise
- Each recipe should feel distinct from the others
- Return ONLY the JSON, nothing else"""

    try:
        # Try OpenAI first (usually faster and more reliable)
        print("Attempting OpenAI API...")
        response_text = call_openai_model(prompt, max_tokens=2500)
        
        # If OpenAI failed, try Hugging Face
        if response_text is None:
            print("OpenAI unavailable, trying Hugging Face...")
            response_text = call_huggingface_model(prompt, max_tokens=2500)
        else:
            print("✓ Using OpenAI-generated recipes")
                
        # If AI failed, use fallback
        if response_text is None:
            print("AI unavailable, using fallback recipe generator")
            fallback_recipes = generate_fallback_recipes(req.ingredients)
            return RecipeListResponse(recipes=fallback_recipes)
        
        # Extract JSON from response (sometimes models add extra text)
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start == -1 or json_end == 0:
            print("AI response invalid, using fallback")
            fallback_recipes = generate_fallback_recipes(req.ingredients)
            return RecipeListResponse(recipes=fallback_recipes)
        
        json_str = response_text[json_start:json_end]
        
        # Parse and validate JSON
        try:
            result = json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {str(e)}, using fallback")
            fallback_recipes = generate_fallback_recipes(req.ingredients)
            return RecipeListResponse(recipes=fallback_recipes)
        
        # Validate response structure
        if "recipes" not in result:
            print("Invalid AI response structure, using fallback")
            fallback_recipes = generate_fallback_recipes(req.ingredients)
            return RecipeListResponse(recipes=fallback_recipes)
        
        # Validate with Pydantic
        validated_response = RecipeListResponse(**result)
        return validated_response

    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}, using fallback")
        fallback_recipes = generate_fallback_recipes(req.ingredients)
        return RecipeListResponse(recipes=fallback_recipes)
@app.post("/agent/recipe/details", response_model=RecipeDetailResponse)
def generate_recipe_details(req: RecipeDetailRequest):
    """
    Generate detailed recipe instructions based on recipe ID and user ingredients.
    """
    if not req.recipe_id:
        raise HTTPException(status_code=400, detail="Recipe ID cannot be empty")
    
    if not req.ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty")
    
    prompt = f"""You are a cooking assistant. Generate a complete recipe for "{req.recipe_id}" using these ingredients: {', '.join(req.ingredients)}.

Return ONLY valid JSON in this exact format (no other text):
{{
  "title": "Recipe Title",
  "ingredients": [
    {{ "name": "ingredient name", "required": true }}
  ],
  "steps": [
    "Step 1: First instruction",
    "Step 2: Second instruction"
  ],
  "tips": ["Helpful tip 1", "Helpful tip 2"]
}}

Rules:
- Include clear step-by-step instructions
- Prefer user's ingredients
- Mention substitutions if needed
- Return ONLY the JSON, nothing else"""

    try:
        response_text = call_huggingface_model(prompt, max_tokens=2000)
        
        # Extract JSON from response
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        
        if json_start == -1 or json_end == 0:
            raise HTTPException(
                status_code=500,
                detail="Model did not return valid JSON"
            )
        
        json_str = response_text[json_start:json_end]
        
        # Parse and validate JSON
        try:
            result = json.loads(json_str)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse model response as JSON: {str(e)}"
            )
        
        # Validate with Pydantic
        validated_response = RecipeDetailResponse(**result)
        return validated_response

    except HTTPException:
        raise
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
    apis_configured = []
    if OPENAI_API_KEY:
        apis_configured.append("OpenAI (GPT-3.5-turbo)")
    if HF_API_KEY:
        apis_configured.append("Hugging Face (Mistral-7B)")
    
    return {
        "status": "healthy",
        "message": "Recipe Agent API is running",
        "ai_providers": apis_configured if apis_configured else ["Programmatic Fallback Only"],
        "model_priority": "OpenAI → Hugging Face → Programmatic"
    }