'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Search, 
  Target, 
  ArrowRight,
  ChefHat,
  Zap,
  Users,
  Award
} from 'lucide-react'

interface HeroProps {
  setActiveTab: (tab: string) => void
}

const Hero = ({ setActiveTab }: HeroProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.section 
      className="pt-32 pb-16 px-4 sm:px-6 lg:px-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          className="inline-flex items-center space-x-2 bg-dark-card border border-cred-purple/30 rounded-full px-4 py-2 mb-6"
          variants={fadeInUp}
        >
          <Sparkles size={16} className="text-cred-purple" />
          <span className="text-sm text-text-secondary">AI-Powered Nutrition Assistant</span>
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          variants={fadeInUp}
        >
          Smart Meal Planning with
          <br />
          <span className="gradient-text">Artificial Intelligence</span>
        </motion.h1>

        <motion.p 
          className="text-xl text-text-secondary max-w-3xl mx-auto mb-8"
          variants={fadeInUp}
        >
          Discover personalized meal recommendations, track your nutrition goals, 
          and achieve optimal health with our AI-powered meal planning platform.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
          variants={fadeInUp}
        >
          <button 
            onClick={() => setActiveTab('search')}
            className="btn btn-primary"
            aria-label="Start AI search"
            title="Start AI search"
          >
            <Search size={20} />
            <span>Start AI Search</span>
            <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('plan')}
            className="btn btn-outline"
            aria-label="View meal plans"
            title="View meal plans"
          >
            <Target size={20} />
            <span>View Meal Plans</span>
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          variants={fadeInUp}
        >
          <div className="floating-card text-center">
            <div className="w-12 h-12 bg-cred-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChefHat className="text-cred-purple" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Recipe Suggestions</h3>
            <p className="text-text-secondary text-sm">
              Get personalized meal recommendations based on your dietary preferences and goals
            </p>
          </div>

          <div className="floating-card text-center">
            <div className="w-12 h-12 bg-cred-green/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="text-cred-green" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Nutrition Tracking</h3>
            <p className="text-text-secondary text-sm">
              Track calories, macros, and micronutrients with intelligent analysis and insights
            </p>
          </div>

          <div className="floating-card text-center">
            <div className="w-12 h-12 bg-cred-cyan/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="text-cred-cyan" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Goal Achievement</h3>
            <p className="text-text-secondary text-sm">
              Set and achieve your health goals with AI-powered guidance and progress tracking
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          variants={fadeInUp}
        >
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">10K+</div>
            <div className="text-text-secondary">Recipes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">95%</div>
            <div className="text-text-secondary">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">50K+</div>
            <div className="text-text-secondary">Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">24/7</div>
            <div className="text-text-secondary">AI Support</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Hero