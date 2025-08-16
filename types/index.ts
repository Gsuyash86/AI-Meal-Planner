export interface Meal {
    id: string
    name: string
    type: string
    calories: number
    protein: number
    carbs: number
    fat: number
    time: string
    ingredients: Ingredient[]
    instructions: string[]
    isProteinShake?: boolean
  }
  
  export interface Ingredient {
    name: string
    amount: string
  }
  
  export interface DayPlan {
    day: number
    dayName: string
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFat: number
    meals: Meal[]
  }
  
  export interface Recipe {
    id: number
    name: string
    category: string
    description: string
    calories: number
    protein: number
    carbs: number
    fat: number
    servings: number
    cookTime: number
    difficulty: string
    rating: number
    ingredients: Ingredient[]
    instructions: string[]
    youtubeUrl: string
    tags: string[]
  }
  
  export interface ProteinShake {
    id: number
    name: string
    description: string
    calories: number
    protein: number
    carbs: number
    fat: number
    prepTime: number
    difficulty: string
    rating: number
    ingredients: Ingredient[]
    instructions: string[]
    youtubeId: string
    tags: string[]
  }
  
  export interface NutritionGoals {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  
  export interface UserProfile {
    name: string
    age: number
    gender: 'male' | 'female'
    weight: number
    height: number
    activityLevel: number
    goal: 'weight_loss' | 'muscle_gain' | 'maintenance'
    dietaryPreferences: string[]
    allergies: string[]
  }