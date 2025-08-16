import mongoose, { Schema, models, model, Model } from 'mongoose'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  avatarUrl?: string
  heightCm?: number
  weightKg?: number
  bmi?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    neck?: number
    biceps?: number
    thighs?: number
  }
  goal?: 'lose_fat' | 'build_muscle' | 'maintain' | 'recomp'
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  avatarUrl: { type: String, trim: true },
  heightCm: { type: Number },
  weightKg: { type: Number },
  bmi: { type: Number },
  measurements: {
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number },
    neck: { type: Number },
    biceps: { type: Number },
    thighs: { type: Number },
  },
  goal: { type: String, enum: ['lose_fat', 'build_muscle', 'maintain', 'recomp'] },
  activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'] },
}, { timestamps: { createdAt: true, updatedAt: true } })

const UserModel: Model<IUser> = (models.User as Model<IUser>) || model<IUser>('User', UserSchema)
export default UserModel
