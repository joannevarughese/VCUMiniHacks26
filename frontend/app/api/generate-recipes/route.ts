// Backend API URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
const USE_AI_AGENT = process.env.NEXT_PUBLIC_USE_AI_AGENT === 'true'

export async function POST(req: Request) {
  let ingredients: string[] = []
  let filters = {}

  try {
    const body = await req.json()
    ingredients = body.ingredients || []
    filters = body.filters || {}
    
    if (!ingredients || ingredients.length === 0) {
      return Response.json({ 
        recipes: [],
        error: 'No ingredients provided' 
      })
    }

    // Only use AI agent if explicitly enabled
    if (USE_AI_AGENT) {
      try {
        // Call the backend API which uses the Python agent
        const response = await fetch(`${BACKEND_URL}/api/recipes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients, filters }),
        })

        if (response.ok) {
          const data = await response.json()
          return Response.json(data)
        }
      } catch (error) {
        console.warn('AI agent unavailable, falling back to static recipes')
      }
    }

    // Use static recipe matching by default
    return Response.json({ 
      recipes: getStaticFallbackRecipes(ingredients, filters)
    })

  } catch (error) {
    console.error('Error generating recipes:', error)
    
    // Fallback to static recipes on error
    return Response.json({ 
      recipes: getStaticFallbackRecipes(ingredients, filters)
    })
  }
}

// Fallback static recipes
function getStaticFallbackRecipes(ingredients: string[], filters?: any) {
  const recipeDatabase = [
  {
    id: "16",
    name: "BBQ Pulled Pork Sandwich",
    estimatedTime: "45 min",
    ingredients: ["pork shoulder", "bbq sauce", "bun", "coleslaw", "onion", "pickles"],
    steps: [
      "Cook pork shoulder until tender and shred",
      "Mix with BBQ sauce",
      "Serve on bun with coleslaw, onion, and pickles"
    ],
    tags: { cuisine: ["american"], style: ["cooking"], diet: [] }
  },
  {
    id: "17",
    name: "Grilled Steak Fajitas",
    estimatedTime: "35 min",
    ingredients: ["steak", "bell pepper", "onion", "tortilla", "lime", "spices"],
    steps: [
      "Grill steak and slice thin",
      "Sauté bell pepper and onion",
      "Serve steak and veggies in tortilla with lime and spices"
    ],
    tags: { cuisine: ["mexican"], style: ["grilling"], diet: [] }
  },
  {
    id: "18",
    name: "Chicken Parmesan",
    estimatedTime: "40 min",
    ingredients: ["chicken breast", "parmesan", "tomato sauce", "mozzarella", "breadcrumbs", "spaghetti"],
    steps: [
      "Bread and fry chicken breast",
      "Top with tomato sauce, mozzarella, and parmesan",
      "Bake until cheese is melted",
      "Serve over spaghetti"
    ],
    tags: { cuisine: ["italian"], style: ["baking"], diet: [] }
  },
  {
    id: "19",
    name: "Beef Stir Fry",
    estimatedTime: "25 min",
    ingredients: ["beef", "broccoli", "soy sauce", "ginger", "garlic", "rice"],
    steps: [
      "Slice beef thin and stir fry with ginger and garlic",
      "Add broccoli and soy sauce",
      "Serve over rice"
    ],
    tags: { cuisine: ["asian"], style: ["cooking"], diet: [] }
  },
  {
    id: "20",
    name: "Lamb Curry",
    estimatedTime: "60 min",
    ingredients: ["lamb", "curry paste", "coconut milk", "potato", "peas", "rice"],
    steps: [
      "Brown lamb and simmer with curry paste",
      "Add coconut milk, potato, and peas",
      "Cook until tender and serve with rice"
    ],
    tags: { cuisine: ["indian"], style: ["cooking"], diet: [] }
  },
  {
    id: "13",
    name: "Vegetarian Ramen Noodles",
    estimatedTime: "30 min",
    ingredients: ["ramen noodles", "vegetable broth", "soy sauce", "bok choy", "mushrooms", "green onions", "egg"],
    steps: [
      "Cook ramen noodles according to package instructions",
      "Simmer vegetable broth with soy sauce, bok choy, and mushrooms",
      "Add cooked noodles to broth",
      "Top with sliced green onions and boiled egg"
    ],
    tags: { cuisine: ["asian"], style: ["cooking"], diet: ["vegetarian"] }
  },
  {
    id: "14",
    name: "Chicken Udon Stir Fry",
    estimatedTime: "25 min",
    ingredients: ["udon noodles", "chicken breast", "soy sauce", "carrots", "snap peas", "garlic", "ginger", "oil"],
    steps: [
      "Cook udon noodles and set aside",
      "Stir fry chicken in oil until cooked",
      "Add garlic, ginger, carrots, and snap peas",
      "Add noodles and soy sauce, toss to combine"
    ],
    tags: { cuisine: ["asian"], style: ["cooking"], diet: [] }
  },
  {
    id: "15",
    name: "Spicy Peanut Noodle Bowl",
    estimatedTime: "20 min",
    ingredients: ["rice noodles", "peanut butter", "soy sauce", "chili paste", "cucumber", "carrot", "lime", "cilantro"],
    steps: [
      "Cook rice noodles according to package instructions",
      "Mix peanut butter, soy sauce, chili paste, and lime juice for sauce",
      "Toss noodles with sauce, top with cucumber, carrot, and cilantro"
    ],
    tags: { cuisine: ["asian"], style: ["cooking"], diet: ["vegetarian"] }
  },
  {
    id: "1",
    name: "Classic Avocado Toast",
    estimatedTime: "10 min",
    ingredients: ["avocado", "bread", "lemon juice", "salt", "pepper", "red pepper flakes"],
    steps: [
      "Toast bread until golden and crispy",
      "Mash avocado in a bowl with lemon juice, salt, and pepper",
      "Spread mashed avocado on toast",
      "Sprinkle with red pepper flakes and serve"
    ],
    tags: { cuisine: ["american"], style: ["quick"], diet: ["vegan", "vegetarian"] }
  },
  {
    id: "2",
    name: "Creamy Milk Pasta",
    estimatedTime: "25 min",
    ingredients: ["milk", "pasta", "butter", "parmesan", "garlic", "salt"],
    steps: [
      "Cook pasta according to package directions",
      "In a pan, melt butter and sauté garlic",
      "Add milk and simmer until slightly thickened",
      "Toss with pasta and parmesan cheese",
      "Season with salt and serve warm"
    ],
    tags: { cuisine: ["italian"], style: ["cooking"], diet: [] }
  },
  {
    id: "3",
    name: "Fresh Garden Salad",
    estimatedTime: "15 min",
    ingredients: ["lettuce", "tomato", "cucumber", "olive oil", "vinegar", "salt"],
    steps: [
      "Wash and chop all vegetables",
      "Combine lettuce, tomatoes, and cucumber in a bowl",
      "Drizzle with olive oil and vinegar",
      "Season with salt and toss gently"
    ],
    tags: { cuisine: [], style: ["quick"], diet: ["vegan", "vegetarian", "gluten-free"] }
  },
  {
    id: "4",
    name: "Egg Fried Rice",
    estimatedTime: "20 min",
    ingredients: ["rice", "egg", "soy sauce", "green onions", "vegetable oil", "garlic"],
    steps: [
      "Cook rice and let it cool (or use day-old rice)",
      "Scramble eggs in a wok and set aside",
      "Stir fry garlic in oil, add rice",
      "Add soy sauce and mix well",
      "Add eggs back, top with green onions"
    ],
    tags: { cuisine: ["asian"], style: ["cooking"], diet: ["vegetarian"] }
  },
  {
    id: "5",
    name: "Banana Pancakes",
    estimatedTime: "20 min",
    ingredients: ["banana", "egg", "flour", "milk", "sugar", "butter"],
    steps: [
      "Mash banana in a bowl",
      "Mix in egg, flour, milk, and sugar until smooth",
      "Heat butter in a pan over medium heat",
      "Pour batter to form pancakes",
      "Flip when bubbles form, cook until golden"
    ],
    tags: { cuisine: ["american"], style: ["baking"], diet: ["vegetarian"] }
  },
  {
    id: "6",
    name: "Chicken Stir Fry",
    estimatedTime: "25 min",
    ingredients: ["chicken", "vegetables", "soy sauce", "garlic", "ginger", "oil"],
    steps: [
      "Slice chicken into thin strips",
      "Heat oil in a wok over high heat",
      "Stir fry chicken until cooked, set aside",
      "Add vegetables, garlic, and ginger",
      "Return chicken, add soy sauce, serve hot"
    ],
    tags: { cuisine: ["asian"], style: ["cooking"], diet: [] }
  },
  {
    id: "7",
    name: "Cheese Quesadilla",
    estimatedTime: "15 min",
    ingredients: ["tortilla", "cheese", "butter", "salsa", "sour cream"],
    steps: [
      "Heat a pan over medium heat",
      "Butter one side of tortilla",
      "Place tortilla butter-side down in pan",
      "Add cheese to half, fold over",
      "Cook until golden on both sides",
      "Serve with salsa and sour cream"
    ],
    tags: { cuisine: ["mexican"], style: ["quick"], diet: ["vegetarian"] }
  },
  {
    id: "8",
    name: "Tomato Soup",
    estimatedTime: "30 min",
    ingredients: ["tomato", "onion", "garlic", "vegetable broth", "cream", "basil"],
    steps: [
      "Sauté onion and garlic until soft",
      "Add chopped tomatoes and broth",
      "Simmer for 20 minutes",
      "Blend until smooth",
      "Stir in cream and fresh basil"
    ],
    tags: { cuisine: ["italian"], style: ["cooking"], diet: ["vegetarian", "gluten-free"] }
  },
  {
    id: "9",
    name: "Greek Salad",
    estimatedTime: "15 min",
    ingredients: ["cucumber", "tomato", "feta", "olives", "olive oil", "oregano"],
    steps: [
      "Chop cucumber and tomatoes into chunks",
      "Add olives and crumbled feta",
      "Drizzle generously with olive oil",
      "Sprinkle with oregano",
      "Toss gently and serve"
    ],
    tags: { cuisine: ["italian"], style: ["quick"], diet: ["vegetarian", "gluten-free"] }
  },
  {
    id: "10",
    name: "Chocolate Mug Cake",
    estimatedTime: "5 min",
    ingredients: ["flour", "sugar", "cocoa", "milk", "oil", "vanilla"],
    steps: [
      "Mix dry ingredients in a mug",
      "Add milk, oil, and vanilla",
      "Stir until smooth",
      "Microwave for 1-2 minutes",
      "Let cool slightly before eating"
    ],
    tags: { cuisine: [], style: ["baking"], diet: ["vegetarian"] }
  },
  {
    id: "11",
    name: "Avocado Smoothie",
    estimatedTime: "5 min",
    ingredients: ["avocado", "milk", "honey", "ice"],
    steps: [
      "Add all ingredients to blender",
      "Blend until smooth and creamy",
      "Pour into a glass and serve cold"
    ],
    tags: { cuisine: [], style: ["quick"], diet: ["vegetarian", "gluten-free"] }
  },
  {
    id: "12",
    name: "Garlic Bread",
    estimatedTime: "15 min",
    ingredients: ["bread", "butter", "garlic", "parsley", "salt"],
    steps: [
      "Preheat oven to 375°F (190°C)",
      "Mix softened butter with minced garlic and parsley",
      "Spread on sliced bread",
      "Bake for 10 minutes until golden",
      "Serve warm"
    ],
    tags: { cuisine: ["italian"], style: ["baking"], diet: ["vegetarian"] }
  },
   {
    id: "21",
    name: "Stuffed Tomatoes",
    estimatedTime: "35 min",
    ingredients: ["tomato", "rice", "ground beef", "onion", "herbs", "parmesan"],
    steps: [
      "Cut tops off tomatoes and scoop out insides",
      "Mix rice, ground beef, onion, and herbs",
      "Stuff tomatoes and top with parmesan",
      "Bake until tomatoes are tender"
    ],
    tags: { cuisine: ["mediterranean"], style: ["baking"], diet: [] }
  },
  {
    id: "22",
    name: "Tomato Shakshuka",
    estimatedTime: "30 min",
    ingredients: ["tomato", "egg", "onion", "bell pepper", "spices", "olive oil"],
    steps: [
      "Sauté onion and bell pepper in olive oil",
      "Add tomatoes and spices, simmer",
      "Make wells and crack eggs into sauce",
      "Cover and cook until eggs are set"
    ],
    tags: { cuisine: ["mediterranean"], style: ["cooking"], diet: ["vegetarian"] }
  },
  {
    id: "23",
    name: "Lettuce Wraps",
    estimatedTime: "20 min",
    ingredients: ["lettuce", "ground chicken", "soy sauce", "ginger", "carrot", "green onion"],
    steps: [
      "Cook ground chicken with ginger and soy sauce",
      "Add carrot and green onion",
      "Spoon mixture into lettuce leaves and wrap"
    ],
    tags: { cuisine: ["asian"], style: ["cooking"], diet: [] }
  },
  {
    id: "24",
    name: "Tofu Stir Fry",
    estimatedTime: "25 min",
    ingredients: ["tofu", "broccoli", "bell pepper", "soy sauce", "garlic", "rice"],
    steps: [
      "Cube tofu and pan fry until golden",
      "Add vegetables and stir fry",
      "Add soy sauce and garlic, serve over rice"
    ],
    tags: { cuisine: ["asian"], style: ["cooking"], diet: ["vegan", "vegetarian"] }
  },
  {
    id: "25",
    name: "Tofu Tacos",
    estimatedTime: "30 min",
    ingredients: ["tofu", "taco shell", "lettuce", "tomato", "spices", "salsa"],
    steps: [
      "Crumble tofu and cook with spices",
      "Fill taco shells with tofu, lettuce, tomato, and salsa"
    ],
    tags: { cuisine: ["mexican"], style: ["cooking"], diet: ["vegan", "vegetarian"] }
  }
  ]
  
  // Convert ingredients to lowercase for matching
  const searchIngredients = (ingredients || []).map((i: string) => i.toLowerCase())
  
  // Filter recipes based on ingredients
  let matchedRecipes = recipeDatabase.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase())
    return searchIngredients.some((searchIng: string) =>
      recipeIngredients.some(recipeIng => 
        recipeIng.includes(searchIng) || searchIng.includes(recipeIng)
      )
    )
  })

  // Apply filters if provided
  if (filters?.cuisine?.length > 0) {
    matchedRecipes = matchedRecipes.filter(recipe =>
      filters.cuisine.some((c: string) => recipe.tags.cuisine.includes(c.toLowerCase()))
    )
  }
  
  if (filters?.style?.length > 0) {
    matchedRecipes = matchedRecipes.filter(recipe =>
      filters.style.some((s: string) => recipe.tags.style.includes(s.toLowerCase()))
    )
  }
  
  if (filters?.diet?.length > 0) {
    matchedRecipes = matchedRecipes.filter(recipe => {
      // If vegetarian or vegan is selected, exclude recipes that do not have those tags
      if (filters.diet.includes("vegetarian")) {
        if (!recipe.tags.diet.includes("vegetarian")) return false;
      }
      if (filters.diet.includes("vegan")) {
        if (!recipe.tags.diet.includes("vegan")) return false;
      }
      // Otherwise, allow recipes that match any diet filter
      return filters.diet.some((d: string) => recipe.tags.diet.includes(d.toLowerCase()));
    });
  }

  // If no matches, try to return recipes that match any filter
  if (matchedRecipes.length === 0) {
    let looseMatches = recipeDatabase;
    if (searchIngredients.length > 0) {
      looseMatches = looseMatches.filter(recipe => {
        const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
        return searchIngredients.some(searchIng =>
          recipeIngredients.some(recipeIng =>
            recipeIng.includes(searchIng) || searchIng.includes(recipeIng)
          )
        );
      });
    }
    if (filters?.cuisine?.length > 0) {
      looseMatches = looseMatches.filter(recipe =>
        filters.cuisine.some((c) => recipe.tags.cuisine.includes(c.toLowerCase()))
      );
    }
    if (filters?.style?.length > 0) {
      looseMatches = looseMatches.filter(recipe =>
        filters.style.some((s) => recipe.tags.style.includes(s.toLowerCase()))
      );
    }
    if (filters?.diet?.length > 0) {
      looseMatches = looseMatches.filter(recipe => {
        if (filters.diet.includes("vegetarian")) {
          if (!recipe.tags.diet.includes("vegetarian")) return false;
        }
        if (filters.diet.includes("vegan")) {
          if (!recipe.tags.diet.includes("vegan")) return false;
        }
        return filters.diet.some((d: string) => recipe.tags.diet.includes(d.toLowerCase()));
      });
    }
    matchedRecipes = looseMatches;
  }
  // If still no matches, return empty array
  if (matchedRecipes.length === 0) {
    return [];
  }

  // Return recipes without the tags field
  return matchedRecipes.map(({ tags, ...recipe }) => recipe)
}

