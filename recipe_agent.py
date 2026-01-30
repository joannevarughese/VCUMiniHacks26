import os, json
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI

# --------------------------------
# OpenAI client
# --------------------------------
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --------------------------------
# FastAPI app
# --------------------------------
app = FastAPI()

# --------------------------------
# Request models
# --------------------------------
class IngredientRequest(BaseModel):
    ingredients: List[str]

class RecipeDetailRequest(BaseModel):
    recipe_id: str
    ingredients: List[str]

# --------------------------------
# Generate recipe list
# --------------------------------
@app.post("/agent/recipes")
def generate_recipe_list(req: IngredientRequest):
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

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0.4,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return json.loads(response.choices[0].message.content)

# --------------------------------
# Generate recipe details
# --------------------------------
@app.post("/agent/recipe/details")
def generate_recipe_details(req: RecipeDetailRequest):
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

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0.5,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return json.loads(response.choices[0].message.content)
