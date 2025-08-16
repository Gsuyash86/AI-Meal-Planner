import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Target, 
  TrendingUp, 
  ChefHat, 
  Menu,
  X,
  Home,
  BookOpen,
  UserCircle,
  Settings
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'AI Search', icon: Search },
    { id: 'plan', label: 'Meal Plan', icon: Target },
    { id: 'recipes', label: 'Recipes', icon: BookOpen },
    { id: 'shakes', label: 'Protein Shakes', icon: ChefHat },
    { id: 'stats', label: 'Analytics', icon: TrendingUp },
  ]

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [activeTab])

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'glass-effect py-2' : 'py-4'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('home')}
            >
              <div className="w-10 h-10 bg-cred-gradient rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat size={22} className="text-white" />
              </div>
              <span className="text-2xl font-extrabold gradient-text bg-clip-text">
                AI MealPro
              </span>
            </motion.div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.slice(1).map((item) => {
                const isActive = activeTab === item.id
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 relative group ${
                      isActive 
                        ? 'text-white' 
                        : 'text-text-secondary hover:text-white'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <item.icon size={18} />
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.span 
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-cred-cyan rounded-full"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.button 
                className="p-2 rounded-xl text-text-secondary hover:bg-dark-hover hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={20} />
              </motion.button>
              
              <motion.div 
                className="relative"
              >
                <button 
                  type="button"
                  className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="User profile menu"
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen ? 'true' : 'false'}
                  aria-controls="profile-menu"
                  id="profile-menu-button"
                  title="Open profile menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cred-purple to-cred-pink flex items-center justify-center text-white">
                    <UserCircle size={20} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      id="profile-menu"
                      className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 border-b border-dark-border">
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-text-secondary">john@example.com</p>
                      </div>
                      <div className="p-2">
                        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-dark-hover text-sm transition-colors">
                          Profile Settings
                        </button>
                        <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-dark-hover text-sm transition-colors">
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.button 
                className="btn btn-primary ml-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Upgrade
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-xl text-text-secondary hover:bg-dark-hover hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-dark-card border-t border-dark-border shadow-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-cred-purple/20 text-white'
                          : 'text-text-secondary hover:text-white hover:bg-dark-hover'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} className={isActive ? 'text-cred-cyan' : ''} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-cred-cyan rounded-full" />
                      )}
                    </motion.button>
                  )
                })}
                
                <div className="pt-2 mt-2 border-t border-dark-border">
                  <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:bg-dark-hover hover:text-white transition-colors">
                    <span className="font-medium">Settings</span>
                    <Settings size={18} />
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:bg-dark-hover hover:text-white transition-colors">
                    <span className="font-medium">Sign Out</span>
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cred-purple to-cred-pink flex items-center justify-center text-white">
                      <UserCircle size={14} />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <motion.div 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border shadow-2xl z-40"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-around items-center py-2 px-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 relative ${
                  isActive 
                    ? 'text-cred-cyan' 
                    : 'text-text-secondary hover:text-white'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-cred-purple/10' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs mt-1 font-medium">
                  {item.label.split(' ')[0]}
                </span>
                {isActive && (
                  <motion.span 
                    className="absolute top-0 right-2 w-1.5 h-1.5 bg-cred-cyan rounded-full"
                    layoutId="mobileActiveDot"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
      
      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation