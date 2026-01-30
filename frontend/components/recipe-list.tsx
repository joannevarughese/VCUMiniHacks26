"use client"

import { useState } from "react"
import { ArrowUpDown } from "lucide-react"
import { RecipeCard, type Recipe } from "./recipe-card"
import { BunnyChef } from "./bunny-chef"
import { Button } from "@/components/ui/button"

interface RecipeListProps {
  recipes: Recipe[]
}

type SortOption = "default" | "time-asc" | "time-desc"

export function RecipeList({ recipes }: RecipeListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default")

  const parseTime = (time: string): number => {
    const match = time.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortBy === "time-asc") {
      return parseTime(a.estimatedTime) - parseTime(b.estimatedTime)
    }
    if (sortBy === "time-desc") {
      return parseTime(b.estimatedTime) - parseTime(a.estimatedTime)
    }
    return 0
  })

  const cycleSortOption = () => {
    const options: SortOption[] = ["default", "time-asc", "time-desc"]
    const currentIndex = options.indexOf(sortBy)
    const nextIndex = (currentIndex + 1) % options.length
    setSortBy(options[nextIndex])
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case "time-asc": return "Quickest first"
      case "time-desc": return "Longest first"
      default: return "Sort by time"
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with bunny */}
      <div className="flex items-start gap-4 mb-6">
        <BunnyChef message="Here is what I came up with!" size="sm" />
        
        <div className="flex-1 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={cycleSortOption}
            className="gap-2 bg-transparent"
          >
            <ArrowUpDown className="w-4 h-4" />
            {getSortLabel()}
          </Button>
        </div>
      </div>

      {/* Recipe cards */}
      <div className="space-y-4">
        {sortedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No recipes found. Try adding some ingredients!
        </div>
      )}
    </div>
  )
}
