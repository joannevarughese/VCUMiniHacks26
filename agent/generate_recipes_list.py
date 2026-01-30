import os, json
from openai import OpenAI
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
app = FastAPI()

class IngredientRequest(BaseModel):
    ingredients: List[str]

@app.post("/agent/recipes")
def generate_recipe_list(req: IngredientRequest):
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

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0.4,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    return json.loads(response.choices[0].message.content)
