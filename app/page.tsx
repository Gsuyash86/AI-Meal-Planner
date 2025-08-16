'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type TabType = 'home' | 'meals' | 'recipes' | 'stats'

import { 
  Search, 
  Sparkles, 
  ChefHat, 
  Target, 
  Zap, 
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Star,
  Clock,
  Flame,
  Plus,
  Filter,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react'
import Hero from './components/Hero'
import MealSearch from './components/MealSearch'
import MealPlan from './components/MealPlan'
import Recipes from './components/Recipes'
import Stats from './components/Stats'
import LoadingSpinner from './components/LoadingSpinner'

// Mock data for featured content
const featuredMeals = [
  {
    id: 1,
    name: 'High-Protein Breakfast',
    calories: 420,
    protein: 35,
    carbs: 40,
    fat: 12,
    time: 15,
    rating: 4.8,
    saved: true
  },
  {
    id: 2,
    name: 'Vegan Power Bowl',
    calories: 380,
    protein: 22,
    carbs: 50,
    fat: 10,
    time: 20,
    rating: 4.6,
    saved: false
  },
  {
    id: 3,
    name: 'Keto Lunch Box',
    calories: 550,
    protein: 30,
    carbs: 12,
    fat: 40,
    time: 25,
    rating: 4.7,
    saved: true
  }
]

const nutritionGoals = [
  { name: 'Calories', current: 1850, target: 2200, unit: 'kcal' },
  { name: 'Protein', current: 140, target: 180, unit: 'g' },
  { name: 'Carbs', current: 180, target: 220, unit: 'g' },
  { name: 'Fat', current: 65, target: 80, unit: 'g' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDate] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    // Simulate loading for demo
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])
  
  // Fix TypeScript comparison issue
  const isMealsActive = activeTab === 'meals'

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return
    
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setActiveTab(tab)
      setIsLoading(false)
      // Scroll to top when changing tabs
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  if (!mounted) return <LoadingSpinner />

  const renderContent = () => {
    const quickActions = [
      { icon: <Search size={20} />, label: 'Search Meals', tab: 'meals' as TabType },
      { icon: <Sparkles size={20} />, label: 'Generate Plan', tab: 'home' as TabType },
      { icon: <ChefHat size={20} />, label: 'My Recipes', tab: 'recipes' as TabType },
      { icon: <Target size={20} />, label: 'Goals', tab: 'stats' as TabType },
    ]

    switch (activeTab) {
      case 'home':
        return <Hero setActiveTab={handleTabChange} />
      case 'meals':
        return <MealSearch />
      case 'recipes':
        return <Recipes />
      case 'stats':
        return <Stats />
      default:
        return <Hero setActiveTab={handleTabChange} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <motion.main
        className="min-h-screen transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full"
          >
            {activeTab === 'home' ? (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Hero setActiveTab={handleTabChange} />
                
                {/* Quick Actions */}
                {/* <section className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Quick Actions</h2>
                    <button 
                      className="text-cred-purple hover:underline flex items-center text-sm font-medium"
                      title="View all quick actions"
                      aria-label="View all quick actions"
                    >
                      See all <ChevronRight size={16} className="ml-1" aria-hidden="true" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: Plus, label: 'Add Meal', color: 'from-cred-purple to-cred-pink' },
                      { icon: Search, label: 'Find Recipes', color: 'from-cred-cyan to-cred-purple' },
                      { icon: Clock, label: 'Meal Plan', color: 'from-cred-orange to-cred-pink' },
                      { icon: TrendingUp, label: 'Progress', color: 'from-cred-green to-cred-cyan' },
                    ].map((item, index) => (
                      <motion.button
                        key={item.label}
                        className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-left text-white group`}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title={item.label}
                        aria-label={item.label}
                      >
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                          <item.icon className="text-white" size={20} />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{item.label}</h3>
                        <p className="text-sm opacity-80">Quickly {item.label.toLowerCase()}</p>
                      </motion.button>
                    ))}
                  </div>
                </section> */}
                
                {/* Today's Meals */}
                {/* <section className="mt-16">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Today's Meals</h2>
                    <button 
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isMealsActive ? 'bg-cred-pink/20 text-cred-pink' : 'text-text-secondary hover:bg-dark-hover'}`}
                      onClick={() => setActiveTab('meals')}
                      title="View and manage your meals"
                      aria-label="View and manage your meals"
                      aria-current={isMealsActive ? 'page' : undefined}
                    >
                      <Plus size={18} aria-hidden="true" />
                      <span>Add Meal</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredMeals.map((meal) => (
                      <motion.div 
                        key={meal.id}
                        className="card group relative overflow-hidden"
                        whileHover={{ y: -5 }}
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <button 
                            className="p-1.5 rounded-lg bg-dark-card/80 backdrop-blur-sm hover:bg-dark-hover"
                            title={meal.saved ? 'Remove from saved' : 'Save for later'}
                            aria-label={meal.saved ? 'Remove from saved' : 'Save for later'}
                          >
                            <Star 
                              size={18} 
                              className={meal.saved ? 'text-yellow-400 fill-yellow-400' : 'text-text-secondary'}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                        
                        <div className="h-40 bg-gradient-to-br from-cred-purple/20 to-cred-cyan/20 rounded-xl mb-4 overflow-hidden">
                          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{meal.name}</h3>
                          <div className="flex items-center text-amber-400 text-sm">
                            <Star size={14} className="fill-amber-400 mr-1" />
                            {meal.rating}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-dark-card/50 rounded-lg p-2 text-center">
                            <div className="text-xs text-text-secondary mb-1">Calories</div>
                            <div className="font-medium">{meal.calories}</div>
                          </div>
                          <div className="bg-dark-card/50 rounded-lg p-2 text-center">
                            <div className="text-xs text-text-secondary mb-1">Protein</div>
                            <div className="font-medium">{meal.protein}g</div>
                          </div>
                          <div className="bg-dark-card/50 rounded-lg p-2 text-center">
                            <div className="text-xs text-text-secondary mb-1">Time</div>
                            <div className="font-medium">{meal.time}m</div>
                          </div>
                        </div>
                        
                        <button 
                          className="w-full py-2.5 px-4 rounded-lg bg-cred-purple/10 text-cred-purple hover:bg-cred-purple/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          title={`View details for ${meal.name}`}
                          aria-label={`View details for ${meal.name}`}
                        >
                          View Details
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </section> */}
                
                {/* Nutrition Overview */}
                {/* <section className="mt-16 mb-20">
                  <h2 className="text-2xl font-bold mb-6">Today's Nutrition</h2>
                  
                  <div className="card p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold">Daily Progress</h3>
                        <p className="text-text-secondary">
                          {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <select 
                          className="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cred-pink/50"
                          value={activeTab}
                          onChange={(e) => setActiveTab(e.target.value as TabType)}
                          aria-label="Select view type"
                          title="Select view type"
                        >
                          <option>Today</option>
                          <option>This Week</option>
                          <option>This Month</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {nutritionGoals.map((goal) => {
                        const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100)
                        return (
                          <div key={goal.name} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{goal.name}</span>
                              <span className="text-text-secondary">
                                {goal.current} / {goal.target} {goal.unit}
                              </span>
                            </div>
                            <div className="w-full bg-dark-card/50 rounded-full h-2 overflow-hidden">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-cred-purple to-cred-cyan rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-dark-border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-dark-card/30 rounded-xl">
                          <div className="text-2xl font-bold text-cred-green">1,850</div>
                          <div className="text-xs text-text-secondary">Calories</div>
                        </div>
                        <div className="text-center p-4 bg-dark-card/30 rounded-xl">
                          <div className="text-2xl font-bold text-cred-cyan">140g</div>
                          <div className="text-xs text-text-secondary">Protein</div>
                        </div>
                        <div className="text-center p-4 bg-dark-card/30 rounded-xl">
                          <div className="text-2xl font-bold text-cred-purple">180g</div>
                          <div className="text-xs text-text-secondary">Carbs</div>
                        </div>
                        <div className="text-center p-4 bg-dark-card/30 rounded-xl">
                          <div className="text-2xl font-bold text-cred-orange">65g</div>
                          <div className="text-xs text-text-secondary">Fat</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section> */}
              </div>
            ) : (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {renderContent()}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>
      
      {/* Footer */}
      <footer className="bg-dark-card border-t border-dark-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-cred-gradient rounded-lg flex items-center justify-center">
                <ChefHat size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AI MealPro</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-text-secondary hover:text-white transition-colors">About</a>
              <a href="#" className="text-text-secondary hover:text-white transition-colors">Features</a>
              <a href="#" className="text-text-secondary hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-text-secondary hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-dark-border text-center text-sm text-text-secondary">
            {new Date().getFullYear()} AI MealPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}