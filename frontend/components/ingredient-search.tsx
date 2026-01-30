"use client"

import { useState, type KeyboardEvent } from "react"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IngredientSearchProps {
  ingredients: string[]
  setIngredients: (ingredients: string[]) => void
  onSearch: () => void
  isLoading?: boolean
}

export function IngredientSearch({ 
  ingredients, 
  setIngredients, 
  onSearch,
  isLoading = false 
}: IngredientSearchProps) {
  const [inputValue, setInputValue] = useState("")

  const addIngredient = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed])
      setInputValue("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addIngredient()
    }
  }

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add an ingredient..."
          className="w-full pl-10 pr-4 py-3 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center gap-1 px-3 py-1 bg-card border border-primary/30 rounded-full text-sm"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => removeIngredient(ingredient)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${ingredient}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {ingredients.length > 0 && (
        <Button 
          onClick={onSearch} 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? "Finding recipes..." : "Find Recipes"}
        </Button>
      )}
    </div>
  )
}
