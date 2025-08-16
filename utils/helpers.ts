export const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female') => {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
  }
  
  export const calculateTDEE = (bmr: number, activityLevel: number) => {
    return bmr * activityLevel
  }
  
  export const formatCalories = (calories: number) => {
    return new Intl.NumberFormat().format(Math.round(calories))
  }
  
  export const formatMacros = (value: number) => {
    return Math.round(value * 10) / 10
  }
  
  export const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'cred-green'
    if (percentage >= 70) return 'cred-cyan'
    if (percentage >= 50) return 'cred-orange'
    return 'cred-red'
  }
  
  export const generateMealPlanId = () => {
    return `meal-plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }