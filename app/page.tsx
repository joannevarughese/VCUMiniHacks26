"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { BunnyChef } from "@/components/bunny-chef"
import { IngredientSearch } from "@/components/ingredient-search"
import { FilterSidebar, type Filters } from "@/components/filter-sidebar"
import { RecipeList } from "@/components/recipe-list"
import type { Recipe } from "@/components/recipe-card"

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [filters, setFilters] = useState<Filters>({
    cuisine: [],
    style: [],
    diet: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (ingredients.length === 0) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, filters }),
      })

      const data = await response.json()
      setRecipes(data.recipes || [])
    } catch (error) {
      console.error("[v0] Error generating recipes:", error)
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main 
      className="min-h-screen bg-background"
      style={{
        backgroundImage: "url('/wallpaper.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Filter Button */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 bg-card/80 backdrop-blur-sm rounded-full border border-primary/20 hover:bg-card transition-colors"
        aria-label="Open filters"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {!hasSearched ? (
          <>
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-semibold text-foreground mb-8 text-center tracking-wide" style={{ fontVariant: "small-caps" }}>
              Chef Lapin
            </h1>

            {/* Search Area */}
            <IngredientSearch
              ingredients={ingredients}
              setIngredients={setIngredients}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {/* Bunny Mascot */}
            <div className="mt-8">
              <BunnyChef size="lg" />
            </div>
          </>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Back to search */}
            <button
              onClick={() => {
                setHasSearched(false)
                setRecipes([])
              }}
              className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to search
            </button>

            {/* Title */}
            <h1 className="text-4xl font-semibold text-foreground mb-6 text-center tracking-wide" style={{ fontVariant: "small-caps" }}>
              Chef Lapin
            </h1>

            {/* Search modification */}
            <div className="mb-8">
              <IngredientSearch
                ingredients={ingredients}
                setIngredients={setIngredients}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>

            {/* Loading state */}
            {isLoading ? (
              <div className="flex flex-col items-center py-12">
                <BunnyChef message="Cooking up some ideas..." size="md" />
                <div className="mt-4 animate-pulse text-muted-foreground">
                  Finding the perfect recipes...
                </div>
              </div>
            ) : (
              <RecipeList recipes={recipes} />
            )}
          </div>
        )}
      </div>
    </main>
  )
}
