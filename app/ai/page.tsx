'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Sparkles, Loader2, Plus } from 'lucide-react'
import MealSearch from '../components/MealSearch'
import RequireAuth from '../../components/auth/RequireAuth'

interface Meal {
  id: number
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  cookTime: number
  difficulty: string
  rating: number
  ingredients: string[]
  tags: string[]
  sourceUrl: string
  imageUrl: string
  youtubeUrl: string
  steps: string[]
}

const AIPage = () => {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState<Record<number, boolean>>({})

  const handleAddToDatabase = async (meal: Meal) => {
    setIsAdding(prev => ({ ...prev, [meal.id]: true }))

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: meal.name,
          description: meal.description,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          ingredients: meal.ingredients.map(ing => ({ name: ing })),
          steps: meal.steps,
          tags: meal.tags,
          sourceUrl: meal.sourceUrl,
          imageUrl: meal.imageUrl,
          youtubeUrl: meal.youtubeUrl,
          cookTime: meal.cookTime,
          difficulty: meal.difficulty,
          rating: meal.rating,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save meal')
      }

      const data = await response.json()
      toast.success('Meal saved successfully!');
    } catch (error) {
      console.error('Error saving meal:', error)
      toast.error('Failed to save meal. Please try again.')
    } finally {
      setIsAdding(prev => ({ ...prev, [meal.id]: false }))
    }
  }

  const renderMealCard = (meal: Meal, index: number) => (
    <motion.div
      key={meal.id}
      className="floating-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div className="flex-1 mb-4 lg:mb-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-xl font-semibold mb-2">{meal.name}</h4>
              <p className="text-text-secondary">{meal.description}</p>
            </div>
            <div className="flex items-center space-x-1 ml-4">
              <span className="text-cred-orange font-semibold">{meal.rating}</span>
              <span className="text-cred-orange">★</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">🔥 {meal.calories} cal</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">🍗 {meal.protein}g protein</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">⏱️ {meal.cookTime} min</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">👨‍🍳 {meal.difficulty}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {meal.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-3 py-1 bg-cred-purple/20 text-cred-purple rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Ingredients:</h5>
            <div className="flex flex-wrap gap-2">
              {meal.ingredients.map((ingredient, idx) => (
                <span key={idx} className="px-2 py-1 bg-dark-card rounded-lg text-sm">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:ml-6 flex flex-col space-y-2">
          <button 
            onClick={() => handleAddToDatabase(meal)}
            disabled={isAdding[meal.id]}
            className="cred-button flex items-center justify-center space-x-2"
          >
            {isAdding[meal.id] ? (
              <>
                <span>Saving...</span>
                <Loader2 size={16} className="animate-spin" />
              </>
            ) : (
              <>
                <span>Save Recipe</span>
                <Plus size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <MealSearch customRender={renderMealCard} />
      </div>
    </RequireAuth>
  )
}

export default AIPage
