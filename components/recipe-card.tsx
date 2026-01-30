"use client"

import { Clock } from "lucide-react"

export interface Recipe {
  id: string
  name: string
  image?: string
  estimatedTime: string
  ingredients: string[]
  steps: string[]
}

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="bg-card/90 backdrop-blur-sm border border-primary/20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">{recipe.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{recipe.estimatedTime}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[120px_1fr] gap-4">
          {/* Image placeholder */}
          <div className="w-full h-24 md:h-full bg-secondary/50 rounded-md flex items-center justify-center text-muted-foreground text-sm">
            {recipe.image ? (
              <img 
                src={recipe.image || "/placeholder.svg"} 
                alt={recipe.name} 
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span>Recipe Image</span>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3">
            {/* Ingredients */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Ingredients</h4>
              <div className="flex flex-wrap gap-1">
                {recipe.ingredients.slice(0, 6).map((ing) => (
                  <span key={ing} className="text-xs bg-secondary/60 px-2 py-0.5 rounded-full">
                    {ing}
                  </span>
                ))}
                {recipe.ingredients.length > 6 && (
                  <span className="text-xs text-muted-foreground">+{recipe.ingredients.length - 6} more</span>
                )}
              </div>
            </div>

            {/* Steps preview */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Steps</h4>
              <ol className="text-sm space-y-1">
                {recipe.steps.slice(0, 3).map((step, i) => (
                  <li key={step} className="text-foreground/80 line-clamp-1">
                    {i + 1}. {step}
                  </li>
                ))}
                {recipe.steps.length > 3 && (
                  <li className="text-muted-foreground text-xs">...and {recipe.steps.length - 3} more steps</li>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
