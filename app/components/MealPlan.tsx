'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Flame, Target, Plus, MoreHorizontal, Share } from 'lucide-react'
import { useState } from 'react'

const MealPlan = () => {
  const [selectedDay, setSelectedDay] = useState(1)
  
  const mealPlan = [
    {
      day: 1,
      dayName: "Monday",
      totalCalories: 1600,
      totalProtein: 83,
      totalCarbs: 210,
      totalFat: 41,
      meals: [
        {
          type: "Breakfast",
          name: "Aloo Paratha with Curd & Almonds",
          calories: 380,
          protein: 13,
          carbs: 65,
          fat: 13,
          time: "8:00 AM",
          ingredients: ["Whole wheat flour (100g)", "Potato (120g)", "Curd (150g)", "Almonds (10g)"]
        },
        {
          type: "Protein Shake",
          name: "Vanilla Protein Smoothie",
          calories: 250,
          protein: 25,
          carbs: 20,
          fat: 8,
          time: "10:00 AM",
          isProteinShake: true,
          ingredients: ["Whey protein (30g)", "Banana (100g)", "Spinach (50g)", "Almond milk (200ml)"]
        },
        {
          type: "Lunch",
          name: "Brown Rice with Dal & Vegetables",
          calories: 350,
          protein: 10,
          carbs: 55,
          fat: 5,
          time: "1:00 PM",
          ingredients: ["Brown rice (120g)", "Mixed dal (120g)", "Mixed vegetables (100g)", "Salad (80g)"]
        },
        {
          type: "Snack",
          name: "Soybean Chaap with Green Tea",
          calories: 150,
          protein: 15,
          carbs: 10,
          fat: 4,
          time: "4:00 PM",
          ingredients: ["Soybean chaap (80g)", "Green tea (1 cup)"]
        },
        {
          type: "Dinner",
          name: "Chapati with Paneer Curry",
          calories: 350,
          protein: 18,
          carbs: 32,
          fat: 11,
          time: "7:30 PM",
          ingredients: ["Whole wheat chapati (60g)", "Paneer (80g)", "Mixed vegetables (100g)", "Salad (80g)"]
        }
      ]
    },
    {
      day: 2,
      dayName: "Tuesday",
      totalCalories: 1460,
      totalProtein: 68,
      totalCarbs: 194,
      totalFat: 34,
      meals: [
        {
          type: "Breakfast",
          name: "Soy Milk with Cornflakes & Banana",
          calories: 280,
          protein: 10,
          carbs: 57,
          fat: 3,
          time: "8:00 AM",
          ingredients: ["Soy milk (200ml)", "Cornflakes (30g)", "Banana (120g)"]
        },
        {
          type: "Protein Shake",
          name: "Chocolate Peanut Butter Protein Shake",
          calories: 280,
          protein: 28,
          carbs: 15,
          fat: 12,
          time: "10:30 AM",
          isProteinShake: true,
          ingredients: ["Chocolate protein powder (30g)", "Peanut butter (15g)", "Oat milk (200ml)", "Ice cubes"]
        },
        {
          type: "Lunch",
          name: "Chapati with Veg Curry & Dal",
          calories: 370,
          protein: 12,
          carbs: 56,
          fat: 6,
          time: "1:00 PM",
          ingredients: ["Chapati (90g)", "Mixed veg curry (100g)", "Dal (120g)", "Salad (80g)"]
        },
        {
          type: "Snack",
          name: "Mixed Nuts & Green Tea",
          calories: 70,
          protein: 2,
          carbs: 8,
          fat: 4,
          time: "4:00 PM",
          ingredients: ["Almonds (7g)", "Raisins (6g)", "Green tea (1 cup)"]
        },
        {
          type: "Dinner",
          name: "Chapati with Tofu Curry",
          calories: 350,
          protein: 14,
          carbs: 32,
          fat: 9,
          time: "7:30 PM",
          ingredients: ["Chapati (60g)", "Tofu (60g)", "Mixed vegetables (100g)", "Salad (80g)"]
        }
      ]
    },
    // Add more days as needed...
  ]

  const currentPlan = mealPlan.find(plan => plan.day === selectedDay) || mealPlan[0]

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-4 gradient-text">7-Day Protein-Rich Meal Plan</h2>
        <p className="text-text-secondary">
          Optimized for weight loss with enhanced protein intake
        </p>
      </motion.div>

      {/* Day Selector */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {mealPlan.map((plan) => (
          <button
            key={plan.day}
            onClick={() => setSelectedDay(plan.day)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              selectedDay === plan.day
                ? 'bg-cred-purple text-white shadow-lg shadow-cred-purple/25'
                : 'bg-dark-card border border-dark-border text-text-secondary hover:border-cred-purple/50 hover:text-white'
            }`}
          >
            <div className="text-sm">Day {plan.day}</div>
            <div className="text-xs opacity-75">{plan.dayName}</div>
          </button>
        ))}
      </motion.div>

      {/* Daily Overview */}
      <motion.div
        className="floating-card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Day {currentPlan.day} - {currentPlan.dayName}</h3>
            <p className="text-text-secondary">Complete nutrition breakdown for the day</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 bg-dark-card border border-dark-border rounded-xl hover:border-cred-purple/50 transition-all duration-300">
              <Share size={20} />
            </button>
            <button className="p-2 bg-dark-card border border-dark-border rounded-xl hover:border-cred-purple/50 transition-all duration-300">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-cred-red/20 rounded-2xl mx-auto mb-3">
              <Flame className="text-cred-red" size={24} />
            </div>
            <div className="text-2xl font-bold">{currentPlan.totalCalories}</div>
            <div className="text-text-secondary text-sm">Total Calories</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-cred-green/20 rounded-2xl mx-auto mb-3">
              <Target className="text-cred-green" size={24} />
            </div>
            <div className="text-2xl font-bold">{currentPlan.totalProtein}g</div>
            <div className="text-text-secondary text-sm">Protein</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-cred-cyan/20 rounded-2xl mx-auto mb-3">
              <div className="w-6 h-6 bg-cred-cyan rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">{currentPlan.totalCarbs}g</div>
            <div className="text-text-secondary text-sm">Carbs</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-cred-orange/20 rounded-2xl mx-auto mb-3">
              <div className="w-6 h-6 bg-cred-orange rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">{currentPlan.totalFat}g</div>
            <div className="text-text-secondary text-sm">Fat</div>
          </div>
        </div>
      </motion.div>

      {/* Meal Timeline */}
      <div className="space-y-6">
        {currentPlan.meals.map((meal, index) => (
          <motion.div
            key={index}
            className={`floating-card ${meal.isProteinShake ? 'border-cred-purple/30 bg-gradient-to-r from-cred-purple/5 to-transparent' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-cred-cyan" />
                    <span className="text-sm text-text-secondary">{meal.time}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    meal.isProteinShake
                      ? 'bg-cred-purple/20 text-cred-purple'
                      : 'bg-dark-card border border-dark-border text-text-secondary'
                  }`}>
                    {meal.isProteinShake ? '🥤 Protein Shake' : meal.type}
                  </div>
                </div>

                <h4 className="text-xl font-semibold mb-2">{meal.name}</h4>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Flame size={14} className="text-cred-red" />
                    <span className="text-sm">{meal.calories} cal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target size={14} className="text-cred-green" />
                    <span className="text-sm">{meal.protein}g protein</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cred-cyan rounded-full"></div>
                    <span className="text-sm">{meal.carbs}g carbs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cred-orange rounded-full"></div>
                    <span className="text-sm">{meal.fat}g fat</span>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="bg-dark-card/50 rounded-xl p-4">
                  <h5 className="font-semibold mb-2 text-sm text-text-secondary">Ingredients:</h5>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-dark-border rounded-lg text-xs text-text-secondary"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col space-y-2">
                <button className="cred-button text-sm px-4 py-2">
                  View Recipe
                </button>
                <button className="px-4 py-2 border border-dark-border rounded-xl text-text-secondary hover:border-cred-purple/50 hover:text-white transition-all duration-300 text-sm">
                  Substitute
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Progress */}
      <motion.div
        className="floating-card mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Weekly Progress</h3>
          <button className="text-cred-purple hover:text-cred-pink transition-colors">
            View Full Report →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-dark-card/50 rounded-xl">
            <div className="text-2xl font-bold text-cred-green mb-2">85%</div>
            <div className="text-sm text-text-secondary">Protein Goals Met</div>
          </div>
          <div className="text-center p-4 bg-dark-card/50 rounded-xl">
            <div className="text-2xl font-bold text-cred-cyan mb-2">1,520</div>
            <div className="text-sm text-text-secondary">Avg Daily Calories</div>
          </div>
          <div className="text-center p-4 bg-dark-card/50 rounded-xl">
            <div className="text-2xl font-bold text-cred-orange mb-2">7/7</div>
            <div className="text-sm text-text-secondary">Days Completed</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MealPlan