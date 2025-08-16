import mongoose, { Schema, models, model, Types } from 'mongoose'

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface IMealEntry {
  recipeId?: Types.ObjectId
  name?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  ingredients?: string[]
  time?: string
}

export interface IDayEntry {
  date: Date
  meals: Record<MealSlot, IMealEntry[]>
  totals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export interface IMealPlan extends mongoose.Document {
  userId: Types.ObjectId
  weekStart: Date // normalized to Monday 00:00:00 of that week (UTC)
  days: IDayEntry[] // length: 7
  createdAt: Date
  updatedAt: Date
}

const MealEntrySchema = new Schema<IMealEntry>({
  recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe' },
  name: { type: String, trim: true },
  calories: { type: Number },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
  ingredients: { type: [String], default: [] },
  time: { type: String },
}, { _id: false })

const DayEntrySchema = new Schema<IDayEntry>({
  date: { type: Date, required: true },
  meals: {
    type: new Schema<Record<MealSlot, IMealEntry[]>>({
      breakfast: { type: [MealEntrySchema], default: [] },
      lunch: { type: [MealEntrySchema], default: [] },
      dinner: { type: [MealEntrySchema], default: [] },
      snack: { type: [MealEntrySchema], default: [] },
    }, { _id: false }),
    required: true,
  },
  totals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
}, { _id: false })

const MealPlanSchema = new Schema<IMealPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  weekStart: { type: Date, required: true, index: true },
  days: { type: [DayEntrySchema], required: true, validate: [(v: any[]) => v.length === 7, 'days must have length 7'] },
}, { timestamps: true })

MealPlanSchema.index({ userId: 1, weekStart: 1 }, { unique: true })

export default (models.MealPlan as mongoose.Model<IMealPlan>) || model<IMealPlan>('MealPlan', MealPlanSchema)
