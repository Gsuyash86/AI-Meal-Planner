'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Sparkles, 
  Clock, 
  Flame, 
  Target, 
  ChefHat,
  Filter,
  Loader2
} from 'lucide-react'

const MealSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [filters, setFilters] = useState({
    cuisine: '',
    dietType: '',
    calories: '',
    time: ''
  })

  // Mock AI search function
  const performAISearch = async (query: string) => {
    setIsSearching(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock results based on query
    const mockResults = [
      {
        id: 1,
        name: "High-Protein Quinoa Buddha Bowl",
        description: "A nutrient-dense bowl with quinoa, grilled chicken, mixed vegetables, and tahini dressing",
        calories: 485,
        protein: 32,
        carbs: 45,
        fat: 18,
        cookTime: 25,
        difficulty: "Easy",
        rating: 4.8,
        ingredients: ["Quinoa", "Chicken breast", "Broccoli", "Sweet potato", "Tahini"],
        tags: ["High-Protein", "Balanced", "Gluten-Free"]
      },
      {
        id: 2,
        name: "Mediterranean Salmon Wrap",
        description: "Grilled salmon with fresh vegetables and tzatziki in a whole wheat tortilla",
        calories: 420,
        protein: 28,
        carbs: 35,
        fat: 20,
        cookTime: 15,
        difficulty: "Easy",
        rating: 4.6,
        ingredients: ["Salmon fillet", "Whole wheat tortilla", "Cucumber", "Tomato", "Greek yogurt"],
        tags: ["Heart-Healthy", "Mediterranean", "Quick"]
      },
      {
        id: 3,
        name: "Protein-Packed Smoothie Bowl",
        description: "Thick smoothie bowl topped with nuts, seeds, and fresh berries",
        calories: 350,
        protein: 25,
        carbs: 30,
        fat: 15,
        cookTime: 10,
        difficulty: "Very Easy",
        rating: 4.7,
        ingredients: ["Protein powder", "Banana", "Berries", "Almond milk", "Chia seeds"],
        tags: ["Post-Workout", "Quick", "Antioxidant-Rich"]
      }
    ]
    
    setSearchResults(mockResults)
    setIsSearching(false)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performAISearch(searchQuery)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-4 gradient-text">AI Meal Discovery</h2>
        <p className="text-text-secondary">
          Describe what you're looking for and let AI find the perfect meal for you
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            placeholder="e.g., 'High protein meal under 500 calories for muscle gain'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-16 py-4 bg-dark-card border border-dark-border rounded-2xl text-white placeholder-text-muted focus:outline-none focus:border-cred-purple/50 focus:ring-2 focus:ring-cred-purple/20 transition-all duration-300"
          />
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cred-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
          </button>
        </div>
      </motion.div>

      {/* Quick Filters */}
      <motion.div
        className="flex flex-wrap gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          "High Protein",
          "Low Carb",
          "Quick (< 30 min)",
          "Vegetarian",
          "Gluten-Free",
          "Under 400 calories"
        ].map((filter, index) => (
          <button
            key={index}
            onClick={() => setSearchQuery(filter)}
            className="px-4 py-2 bg-dark-card border border-dark-border rounded-xl text-text-secondary hover:border-cred-purple/50 hover:text-white transition-all duration-300 text-sm"
          >
            {filter}
          </button>
        ))}
      </motion.div>

      {/* Search Results */}
      {isSearching && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="inline-flex items-center space-x-3 bg-dark-card border border-cred-purple/30 rounded-2xl px-6 py-4">
            <Loader2 size={24} className="animate-spin text-cred-purple" />
            <span className="text-lg">AI is analyzing your preferences...</span>
          </div>
        </motion.div>
      )}

      {searchResults.length > 0 && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Found {searchResults.length} perfect matches
            </h3>
            <button className="flex items-center space-x-2 text-text-secondary hover:text-white transition-colors">
              <Filter size={16} />
              <span>Refine</span>
            </button>
          </div>

          {searchResults.map((meal, index) => (
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
                      <Flame size={16} className="text-cred-red" />
                      <span className="text-sm">{meal.calories} cal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target size={16} className="text-cred-green" />
                      <span className="text-sm">{meal.protein}g protein</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-cred-cyan" />
                      <span className="text-sm">{meal.cookTime} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ChefHat size={16} className="text-cred-purple" />
                      <span className="text-sm">{meal.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {meal.tags.map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-cred-purple/20 text-cred-purple rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:ml-6 flex flex-col space-y-2">
                  <button className="cred-button">
                    Add to Plan
                  </button>
                  <button className="px-6 py-2 border border-dark-border rounded-xl text-text-secondary hover:border-cred-purple/50 hover:text-white transition-all duration-300">
                    View Recipe
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* AI Suggestions */}
      {!isSearching && searchResults.length === 0 && (
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="floating-card text-center">
            <Sparkles className="mx-auto mb-4 text-cred-purple" size={32} />
            <h3 className="text-lg font-semibold mb-2">Smart Suggestions</h3>
            <p className="text-text-secondary mb-4">
              Get personalized meal recommendations based on your goals and preferences
            </p>
            <button 
              onClick={() => setSearchQuery("High protein meals for weight loss")}
              className="text-cred-purple hover:text-cred-pink transition-colors"
            >
              Try AI Suggestions →
            </button>
          </div>

          <div className="floating-card text-center">
            <Target className="mx-auto mb-4 text-cred-green" size={32} />
            <h3 className="text-lg font-semibold mb-2">Nutrition Goals</h3>
            <p className="text-text-secondary mb-4">
              Set your daily calorie and macro targets for personalized results
            </p>
            <button className="text-cred-green hover:text-cred-cyan transition-colors">
              Set Goals →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MealSearch