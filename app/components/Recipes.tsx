'use client'

import { motion } from 'framer-motion'
import { 
  Clock, 
  Users, 
  ChefHat, 
  Star, 
  Flame, 
  Target,
  Play,
  Bookmark,
  Share2,
  Filter
} from 'lucide-react'
import { useState } from 'react'

const Recipes = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const recipes = [
    {
      id: 1,
      name: "Aloo Paratha",
      category: "Breakfast",
      description: "Traditional Indian stuffed flatbread with spiced potato filling",
      calories: 380,
      protein: 13,
      carbs: 65,
      fat: 13,
      servings: 2,
      cookTime: 30,
      difficulty: "Medium",
      rating: 4.7,
      image: "/api/placeholder/400/300",
      youtubeUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      ingredients: [
        { name: "Whole wheat flour", amount: "100g" },
        { name: "Potatoes (boiled & mashed)", amount: "120g" },
        { name: "Green chilies", amount: "2 small" },
        { name: "Ginger", amount: "1 tsp minced" },
        { name: "Cumin seeds", amount: "1/2 tsp" },
        { name: "Coriander leaves", amount: "2 tbsp chopped" },
        { name: "Salt", amount: "to taste" },
        { name: "Oil/Ghee", amount: "2 tbsp" }
      ],
      instructions: [
        "Mix flour with water and a pinch of salt to make soft dough. Rest for 20 minutes.",
        "Mix mashed potatoes with chilies, ginger, cumin, coriander, and salt.",
        "Roll dough into small circles, place filling in center, seal edges.",
        "Roll carefully into flatbread without breaking.",
        "Cook on hot tawa/griddle with oil until golden brown on both sides.",
        "Serve hot with curd and pickle."
      ],
      tags: ["Vegetarian", "High-Carb", "Traditional", "Filling"]
    },
    {
      id: 2,
      name: "Paneer Tikka",
      category: "Snack",
      description: "Marinated cottage cheese cubes grilled to perfection",
      calories: 140,
      protein: 12,
      carbs: 6,
      fat: 7,
      servings: 1,
      cookTime: 20,
      difficulty: "Easy",
      rating: 4.8,
      image: "/api/placeholder/400/300",
      youtubeUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      ingredients: [
        { name: "Paneer", amount: "70g cubes" },
        { name: "Greek yogurt", amount: "2 tbsp" },
        { name: "Ginger-garlic paste", amount: "1 tsp" },
        { name: "Red chili powder", amount: "1/2 tsp" },
        { name: "Garam masala", amount: "1/4 tsp" },
        { name: "Turmeric", amount: "1/4 tsp" },
        { name: "Bell peppers", amount: "30g" },
        { name: "Onion", amount: "30g" },
        { name: "Oil", amount: "1 tsp" }
      ],
      instructions: [
        "Cut paneer, bell peppers, and onion into cubes.",
        "Mix yogurt with all spices to make marinade.",
        "Marinate paneer and vegetables for 30 minutes.",
        "Thread onto skewers alternating paneer and vegetables.",
        "Grill or bake at 200°C for 15 minutes, turning once.",
        "Garnish with mint chutney and serve hot."
      ],
      tags: ["Vegetarian", "High-Protein", "Grilled", "Low-Carb"]
    },
    {
      id: 3,
      name: "Brown Rice Pulao",
      category: "Lunch",
      description: "Aromatic brown rice cooked with vegetables and spices",
      calories: 250,
      protein: 6,
      carbs: 45,
      fat: 4,
      servings: 2,
      cookTime: 35,
      difficulty: "Easy",
      rating: 4.5,
      image: "/api/placeholder/400/300",
      youtubeUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      ingredients: [
        { name: "Brown rice", amount: "120g" },
        { name: "Mixed vegetables", amount: "100g" },
        { name: "Onion", amount: "1 medium" },
        { name: "Ginger-garlic paste", amount: "1 tsp" },
        { name: "Cumin seeds", amount: "1 tsp" },
        { name: "Bay leaves", amount: "2" },
        { name: "Cinnamon stick", amount: "1 small" },
        { name: "Water", amount: "300ml" },
        { name: "Salt", amount: "to taste" },
        { name: "Oil", amount: "1 tbsp" }
      ],
      instructions: [
        "Wash and soak brown rice for 30 minutes.",
        "Heat oil, add cumin, bay leaves, and cinnamon.",
        "Add onions, cook until golden.",
        "Add ginger-garlic paste and vegetables.",
        "Add drained rice and mix gently.",
        "Add water and salt, bring to boil, then simmer covered for 25 minutes."
      ],
      tags: ["Vegetarian", "Whole Grain", "One-Pot", "Balanced"]
    },
    {
      id: 4,
      name: "Dal Tadka",
      category: "Main Course",
      description: "Yellow lentils cooked with aromatic tempering",
      calories: 180,
      protein: 12,
      carbs: 28,
      fat: 3,
      servings: 2,
      cookTime: 25,
      difficulty: "Easy",
      rating: 4.6,
      image: "/api/placeholder/400/300",
      youtubeUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      ingredients: [
        { name: "Yellow dal (toor/moong)", amount: "120g" },
        { name: "Onion", amount: "1 small" },
        { name: "Tomato", amount: "1 medium" },
        { name: "Green chilies", amount: "2" },
        { name: "Ginger", amount: "1 inch piece" },
        { name: "Turmeric", amount: "1/2 tsp" },
        { name: "Cumin seeds", amount: "1 tsp" },
        { name: "Mustard seeds", amount: "1/2 tsp" },
        { name: "Asafoetida", amount: "pinch" },
        { name: "Oil", amount: "1 tbsp" }
      ],
      instructions: [
        "Wash dal and pressure cook with turmeric for 3-4 whistles.",
        "Heat oil, add cumin and mustard seeds.",
        "Add asafoetida, onions, and chilies.",
        "Add tomatoes and cook until soft.",
        "Add cooked dal and simmer for 10 minutes.",
        "Garnish with coriander leaves."
      ],
      tags: ["Vegetarian", "High-Protein", "Comfort Food", "Healthy"]
    },
    {
      id: 5,
      name: "Palak Tofu Curry",
      category: "Dinner",
      description: "Creamy spinach curry with protein-rich tofu",
      calories: 220,
      protein: 14,
      carbs: 12,
      fat: 8,
      servings: 2,
      cookTime: 30,
      difficulty: "Medium",
      rating: 4.4,
      image: "/api/placeholder/400/300",
      youtubeUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      ingredients: [
        { name: "Fresh spinach", amount: "200g" },
        { name: "Tofu", amount: "100g cubes" },
        { name: "Onion", amount: "1 medium" },
        { name: "Tomato", amount: "1 small" },
        { name: "Ginger-garlic paste", amount: "1 tbsp" },
        { name: "Green chilies", amount: "2" },
        { name: "Garam masala", amount: "1 tsp" },
        { name: "Cumin powder", amount: "1/2 tsp" },
        { name: "Oil", amount: "2 tbsp" }
      ],
      instructions: [
        "Blanch spinach in boiling water for 2 minutes, then blend to paste.",
        "Pan-fry tofu cubes until golden, set aside.",
        "Heat oil, sauté onions until golden.",
        "Add ginger-garlic paste and tomatoes.",
        "Add spinach paste and spices.",
        "Add tofu and simmer for 10 minutes."
      ],
      tags: ["Vegan", "High-Protein", "Iron-Rich", "Low-Carb"]
    }
  ]

  const categories = ['all', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Main Course']

  const filteredRecipes = selectedFilter === 'all' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedFilter)

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-4 gradient-text">Recipe Collection</h2>
        <p className="text-text-secondary">
          Detailed recipes with ingredients, instructions, and video tutorials
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedFilter(category)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 capitalize ${
              selectedFilter === category
                ? 'bg-cred-purple text-white shadow-lg shadow-cred-purple/25'
                : 'bg-dark-card border border-dark-border text-text-secondary hover:border-cred-purple/50 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            className="floating-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Recipe Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-cred-purple/20 text-cred-purple rounded-lg text-xs font-medium">
                    {recipe.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-cred-orange fill-current" />
                    <span className="text-sm">{recipe.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                <p className="text-text-secondary mb-3">{recipe.description}</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Flame size={14} className="text-cred-red" />
                    <span className="text-sm">{recipe.calories} cal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target size={14} className="text-cred-green" />
                    <span className="text-sm">{recipe.protein}g protein</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-cred-cyan" />
                    <span className="text-sm">{recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={14} className="text-cred-orange" />
                    <span className="text-sm">{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-dark-card border border-dark-border rounded-lg text-xs text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button 
                  className="p-2 bg-dark-card border border-dark-border rounded-xl hover:border-cred-purple/50 transition-all duration-300"
                  title="Bookmark"
                >
                  <Bookmark size={16} />
                </button>
                <button 
                  className="p-2 bg-dark-card border border-dark-border rounded-xl hover:border-cred-purple/50 transition-all duration-300"
                  title="Share"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-4">
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <ChefHat size={16} className="text-cred-purple" />
                <span>Ingredients</span>
              </h4>
              <div className="bg-dark-card/50 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-2">
                  {recipe.ingredients.map((ingredient, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span>{ingredient.name}</span>
                      <span className="font-medium text-cred-purple">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-4">
              <h4 className="font-semibold mb-3">Instructions</h4>
              <div className="bg-dark-card/50 rounded-xl p-4">
                <ol className="space-y-3">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-cred-purple text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={() => window.open(recipe.youtubeUrl, '_blank')}
                className="cred-button flex items-center justify-center space-x-2 flex-1"
              >
                <Play size={16} />
                <span>Watch Tutorial</span>
              </button>
              <button className="px-4 py-2 border border-dark-border rounded-xl text-text-secondary hover:border-cred-purple/50 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Add to Meal Plan</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recipe Tips */}
      <motion.div
        className="floating-card mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-4">Cooking Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-cred-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChefHat className="text-cred-green" size={24} />
            </div>
            <h4 className="font-semibold mb-2">Meal Prep</h4>
            <p className="text-sm text-text-secondary">
              Prepare ingredients in advance to reduce cooking time during the week
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cred-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="text-cred-purple" size={24} />
            </div>
            <h4 className="font-semibold mb-2">Portion Control</h4>
            <p className="text-sm text-text-secondary">
              Use measuring cups and kitchen scales for accurate portion sizes
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cred-cyan/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Flame className="text-cred-cyan" size={24} />
            </div>
            <h4 className="font-semibold mb-2">Healthy Cooking</h4>
            <p className="text-sm text-text-secondary">
              Use minimal oil and prefer steaming, grilling, or baking over deep frying
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Recipes