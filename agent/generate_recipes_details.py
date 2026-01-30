import os
import json
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI


app = FastAPI()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --------------------------------
# Request model
# --------------------------------
class RecipeDetailRequest(BaseModel):
    recipe_id: str
    ingredients: List[str]

# --------------------------------
# Endpoint
# --------------------------------
@app.post("/agent/recipe/details")
def generate_recipe_details(req: RecipeDetailRequest):
    system_prompt = """
You are a cooking assistant.

Rules:
- Generate a complete, realistic recipe
- Include clear step-by-step instructions
- Use only common kitchen techniques
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
        model="gpt-4o-mini",
        temperature=0.5,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return json.loads(response.choices[0].message.content)
