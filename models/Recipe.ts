import mongoose, { Schema, models, model, Model } from 'mongoose'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface IIngredient {
  name: string
  quantity?: string
}

export interface IRecipe extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  title: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  ingredients: IIngredient[]
  steps: string[]
  tags: string[]
  imageUrl?: string
  youtubeUrl?: string
  sourceUrl?: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: Difficulty
  createdAt: Date
  updatedAt: Date
}

const IngredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true, trim: true },
  quantity: { type: String },
}, { _id: false })

const RecipeSchema = new Schema<IRecipe>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  calories: { type: Number },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
  ingredients: { type: [IngredientSchema], default: [] },
  steps: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  imageUrl: { type: String },
  youtubeUrl: { type: String },
  sourceUrl: { type: String },
  prepTime: { type: Number, min: 0 },
  cookTime: { type: Number, min: 0 },
  servings: { type: Number, min: 1 },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] as const },
}, { timestamps: true })

const RecipeModel: Model<IRecipe> = (models.Recipe as Model<IRecipe>) || model<IRecipe>('Recipe', RecipeSchema)
export default RecipeModel
