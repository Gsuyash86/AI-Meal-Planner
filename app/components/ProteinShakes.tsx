import { motion } from 'framer-motion'
import { Zap, Clock, Target, Star, Play, ExternalLink } from 'lucide-react'

const ProteinShakes = () => {
  const proteinShakes = [
    {
      id: 1,
      name: "Vanilla Protein Smoothie",
      description: "A creamy blend with banana and spinach for the perfect morning boost",
      calories: 250,
      protein: 25,
      carbs: 20,
      fat: 8,
      prepTime: 5,
      difficulty: "Easy",
      rating: 4.8,
      ingredients: [
        { name: "Whey protein powder (vanilla)", amount: "30g" },
        { name: "Banana", amount: "1 medium (100g)" },
        { name: "Fresh spinach", amount: "50g" },
        { name: "Almond milk", amount: "200ml" },
        { name: "Ice cubes", amount: "4-5 pieces" },
        { name: "Honey (optional)", amount: "1 tsp" }
      ],
      instructions: [
        "Add almond milk to blender first",
        "Add banana, spinach, and protein powder",
        "Add ice cubes and honey if using",
        "Blend on high for 60-90 seconds until smooth",
        "Pour into glass and serve immediately"
      ],
      youtubeId: "dQw4w9WgXcQ",
      tags: ["Beginner-Friendly", "Morning Boost", "Antioxidant-Rich"]
    },
    {
      id: 2,
      name: "Chocolate Peanut Butter Protein Shake",
      description: "Rich and indulgent shake that tastes like a dessert but fuels your muscles",
      calories: 280,
      protein: 28,
      carbs: 15,
      fat: 12,
      prepTime: 3,
      difficulty: "Very Easy",
      rating: 4.9,
      ingredients: [
        { name: "Chocolate protein powder", amount: "30g" },
        { name: "Natural peanut butter", amount: "15g (1 tbsp)" },
        { name: "Oat milk", amount: "200ml" },
        { name: "Ice cubes", amount: "6-8 pieces" },
        { name: "Cacao powder (optional)", amount: "1 tsp" },
        { name: "Stevia (optional)", amount: "2-3 drops" }
      ],
      instructions: [
        "Add oat milk to blender",
        "Add protein powder and peanut butter",
        "Add cacao powder and stevia if desired",
        "Add ice cubes",
        "Blend for 45-60 seconds until creamy",
        "Serve in a chilled glass"
      ],
      youtubeId: "dQw4w9WgXcQ",
      tags: ["Post-Workout", "Muscle Building", "Dessert-Like"]
    },
    {
      id: 3,
      name: "Berry Blast Protein Smoothie",
      description: "Antioxidant-packed smoothie with mixed berries and Greek yogurt",
      calories: 230,
      protein: 24,
      carbs: 25,
      fat: 5,
      prepTime: 4,
      difficulty: "Easy",
      rating: 4.7,
      ingredients: [
        { name: "Vanilla protein powder", amount: "25g" },
        { name: "Mixed berries (frozen)", amount: "80g" },
        { name: "Greek yogurt", amount: "100g" },
        { name: "Water or coconut water", amount: "150ml" },
        { name: "Chia seeds", amount: "1 tsp" },
        { name: "Mint leaves (optional)", amount: "4-5 leaves" }
      ],
      instructions: [
        "Add water/coconut water to blender",
        "Add Greek yogurt and protein powder",
        "Add frozen berries and chia seeds",
        "Add mint leaves if using",
        "Blend until smooth and thick",
        "Add more liquid if needed for consistency"
      ],
      youtubeId: "dQw4w9WgXcQ",
      tags: ["Antioxidant-Rich", "Recovery", "Low-Fat"]
    },
    {
      id: 4,
      name: "Green Tea Protein Smoothie",
      description: "Energizing blend with matcha and coconut for sustained energy",
      calories: 220,
      protein: 22,
      carbs: 18,
      fat: 6,
      prepTime: 6,
      difficulty: "Easy",
      rating: 4.5,
      ingredients: [
        { name: "Vanilla protein powder", amount: "25g" },
        { name: "Matcha green tea powder", amount: "1 tsp" },
        { name: "Coconut milk", amount: "180ml" },
        { name: "Banana (frozen)", amount: "1/2 medium" },
        { name: "Coconut flakes", amount: "1 tbsp" },
        { name: "Agave syrup (optional)", amount: "1 tsp" }
      ],
      instructions: [
        "Dissolve matcha in 2 tbsp warm water",
        "Add coconut milk to blender",
        "Add matcha mixture and protein powder",
        "Add frozen banana and coconut flakes",
        "Blend until smooth and frothy",
        "Sweeten with agave if needed"
      ],
      youtubeId: "dQw4w9WgXcQ",
      tags: ["Energy Boost", "Metabolism", "Caffeine"]
    },
    {
      id: 5,
      name: "Mango Coconut Protein Smoothie",
      description: "Tropical paradise in a glass with creamy coconut and sweet mango",
      calories: 260,
      protein: 26,
      carbs: 22,
      fat: 9,
      prepTime: 4,
      difficulty: "Very Easy",
      rating: 4.6,
      ingredients: [
        { name: "Vanilla protein powder", amount: "30g" },
        { name: "Frozen mango chunks", amount: "100g" },
        { name: "Coconut milk (canned)", amount: "100ml" },
        { name: "Water", amount: "100ml" },
        { name: "Lime juice", amount: "1 tbsp" },
        { name: "Coconut flakes", amount: "1 tbsp" }
      ],
      instructions: [
        "Add water and coconut milk to blender",
        "Add protein powder and mix briefly",
        "Add frozen mango and lime juice",
        "Blend until creamy and smooth",
        "Garnish with coconut flakes",
        "Serve immediately for best texture"
      ],
      youtubeId: "dQw4w9WgXcQ",
      tags: ["Tropical", "Vitamin C", "Summer Favorite"]
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-4 gradient-text">Protein Shake Recipes</h2>
        <p className="text-text-secondary">
          Power-packed shakes with detailed recipes and video tutorials
        </p>
      </motion.div>

      {/* Protein Shakes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {proteinShakes.map((shake, index) => (
          <motion.div
            key={shake.id}
            className="floating-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{shake.name}</h3>
                <p className="text-text-secondary mb-3">{shake.description}</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-cred-red">{shake.calories}</div>
                    <div className="text-xs text-text-muted">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-cred-green">{shake.protein}g</div>
                    <div className="text-xs text-text-muted">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-cred-cyan">{shake.carbs}g</div>
                    <div className="text-xs text-text-muted">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-cred-orange">{shake.fat}g</div>
                    <div className="text-xs text-text-muted">Fat</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} className="text-cred-cyan" />
                    <span className="text-sm">{shake.prepTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target size={14} className="text-cred-purple" />
                    <span className="text-sm">{shake.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-cred-orange fill-current" />
                    <span className="text-sm">{shake.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {shake.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-cred-purple/20 text-cred-purple rounded-lg text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-sm text-text-secondary">Ingredients:</h4>
              <div className="bg-dark-card/50 rounded-xl p-4">
                <ul className="space-y-2">
                  {shake.ingredients.map((ingredient, i) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span>{ingredient.name}</span>
                      <span className="font-medium text-cred-purple">{ingredient.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-sm text-text-secondary">Instructions:</h4>
              <div className="bg-dark-card/50 rounded-xl p-4">
                <ol className="space-y-2">
                  {shake.instructions.map((step, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-cred-purple text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={() => window.open(`https://youtube.com/watch?v=${shake.youtubeId}`, '_blank')}
                className="cred-button flex items-center justify-center space-x-2 flex-1"
              >
                <Play size={16} />
                <span>Watch Tutorial</span>
              </button>
              <button className="px-4 py-2 border border-dark-border rounded-xl text-text-secondary hover:border-cred-purple/50 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
                <ExternalLink size={16} />
                <span>Add to Plan</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Protein Shake Tips */}
      <motion.div
        className="floating-card mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-4">Pro Tips for Perfect Protein Shakes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-cred-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="text-cred-green" size={24} />
            </div>
            <h4 className="font-semibold mb-2">Best Timing</h4>
            <p className="text-sm text-text-secondary">
              Consume within 30 minutes post-workout for optimal muscle recovery
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cred-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="text-cred-purple" size={24} />
            </div>
            <h4 className="font-semibold mb-2">Blend Order</h4>
            <p className="text-sm text-text-secondary">
              Add liquids first, then powder, then frozen ingredients for smooth texture
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cred-cyan/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="text-cred-cyan" size={24} />
            </div>
            <h4 className="font-semibold mb-2">Storage</h4>
            <p className="text-sm text-text-secondary">
              Best consumed fresh, but can be refrigerated for up to 24 hours
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProteinShakes