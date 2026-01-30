"use client"

import { X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export interface Filters {
  cuisine: string[]
  style: string[]
  diet: string[]
}

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters: Filters
  setFilters: (filters: Filters) => void
}

const cuisineOptions = ["Mexican", "Italian", "Seafood", "Asian", "American", "Mediterranean"]
const styleOptions = ["Baking", "Cooking", "Grilling", "Raw", "Slow Cooker"]
const dietOptions = ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb"]

export function FilterSidebar({ isOpen, onClose, filters, setFilters }: FilterSidebarProps) {
  const toggleFilter = (category: keyof Filters, value: string) => {
    const current = filters[category]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setFilters({ ...filters, [category]: updated })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-accent/95 backdrop-blur-md z-50 shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Filter</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-primary/20 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuisine */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Cuisine</h3>
            <div className="space-y-2">
              {cuisineOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cuisine-${option}`}
                    checked={filters.cuisine.includes(option)}
                    onCheckedChange={() => toggleFilter("cuisine", option)}
                  />
                  <Label htmlFor={`cuisine-${option}`} className="text-sm cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Style</h3>
            <div className="space-y-2">
              {styleOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`style-${option}`}
                    checked={filters.style.includes(option)}
                    onCheckedChange={() => toggleFilter("style", option)}
                  />
                  <Label htmlFor={`style-${option}`} className="text-sm cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Diet Restrictions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Diet Restriction</h3>
            <div className="space-y-2">
              {dietOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diet-${option}`}
                    checked={filters.diet.includes(option)}
                    onCheckedChange={() => toggleFilter("diet", option)}
                  />
                  <Label htmlFor={`diet-${option}`} className="text-sm cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
