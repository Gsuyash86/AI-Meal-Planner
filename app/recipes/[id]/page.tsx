'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Clock, Flame, Target, ChevronLeft, ChefHat } from 'lucide-react'
import Link from 'next/link'

interface Recipe {
  _id: string
  title: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  tags?: string[]
  ingredients?: { name: string; quantity?: string }[]
  steps?: string[]
  imageUrl?: string
  youtubeUrl?: string
  sourceUrl?: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

export default function RecipeDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`)
        if (!res.ok) throw new Error('Recipe not found')
        const data = await res.json()
        setRecipe(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipe')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchRecipe()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="skeleton h-12 w-64 mb-6"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="skeleton h-96 w-full rounded-xl"></div>
            <div className="skeleton h-6 w-48"></div>
          </div>
          <div className="space-y-6">
            <div className="skeleton h-8 w-3/4"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-5/6"></div>
            <div className="skeleton h-4 w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
        <p className="text-text-secondary mb-6">{error || 'The requested recipe could not be found.'}</p>
        <button 
          onClick={() => router.back()}
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    )
  }

  // Extract video ID from YouTube URL if it exists
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    const videoId = (match && match[2].length === 11) ? match[2] : null
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  const embedUrl = recipe.youtubeUrl ? getYouTubeEmbedUrl(recipe.youtubeUrl) : null

  return (
    <div className="max-w-6xl mx-auto p-4">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-cred-cyan hover:text-cred-cyan/80 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Recipes
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Image and Video */}
        <div className="space-y-6">
          {recipe.imageUrl ? (
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-card">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-2xl bg-dark-card flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-text-tertiary" />
            </div>
          )}

          {embedUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden bg-dark-card">
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title={`${recipe.title} video tutorial`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          )}
        </div>

        {/* Right Column - Recipe Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-text-secondary mb-4">{recipe.description}</p>
            )}
          </div>

          {/* Recipe Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-dark-card rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-cred-red">{recipe.calories || '--'}</div>
              <div className="text-xs text-text-secondary">CALORIES</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cred-green">{recipe.protein || '--'}<span className="text-sm">g</span></div>
              <div className="text-xs text-text-secondary">PROTEIN</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cred-cyan">{recipe.carbs || '--'}<span className="text-sm">g</span></div>
              <div className="text-xs text-text-secondary">CARBS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cred-orange">{recipe.fat || '--'}<span className="text-sm">g</span></div>
              <div className="text-xs text-text-secondary">FAT</div>
            </div>
          </div>

          {/* Prep Time & Servings */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(recipe.prepTime || recipe.cookTime) && (
              <div className="bg-dark-card p-4 rounded-xl">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">TIME</span>
                </div>
                <div className="text-sm">
                  {recipe.prepTime && <div>Prep: {recipe.prepTime} min</div>}
                  {recipe.cookTime && <div>Cook: {recipe.cookTime} min</div>}
                  {recipe.prepTime && recipe.cookTime && (
                    <div className="font-medium">Total: {recipe.prepTime + recipe.cookTime} min</div>
                  )}
                </div>
              </div>
            )}
            {recipe.servings && (
              <div className="bg-dark-card p-4 rounded-xl">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <ChefHat className="w-4 h-4" />
                  <span className="text-xs font-medium">SERVINGS</span>
                </div>
                <div className="text-sm">{recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}</div>
              </div>
            )}
            {recipe.difficulty && (
              <div className="bg-dark-card p-4 rounded-xl">
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-medium">DIFFICULTY</span>
                </div>
                <div className="text-sm">{recipe.difficulty}</div>
              </div>
            )}
          </div>

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cred-cyan mt-2 flex-shrink-0"></span>
                    <span>
                      <span className="font-medium">{ingredient.name}</span>
                      {ingredient.quantity && (
                        <span className="text-text-secondary ml-2">{ingredient.quantity}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {recipe.steps && recipe.steps.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cred-purple/20 text-cred-purple flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <p className="text-text-secondary">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-dark-card text-sm rounded-full text-text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Source Link */}
          {recipe.sourceUrl && (
            <div className="pt-4 border-t border-dark-border">
              <a 
                href={recipe.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cred-cyan hover:underline inline-flex items-center gap-1"
              >
                View Original Recipe
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
