import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      password,
      avatarUrl,
      heightCm,
      weightKg,
      bmi,
      measurements,
      goal,
      activityLevel,
    } = body || {}

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await connectToDatabase()
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 10)

    const createData: any = { name, email, password: hash }
    if (typeof avatarUrl === 'string' && avatarUrl.trim()) createData.avatarUrl = avatarUrl.trim()
    if (typeof heightCm === 'number') createData.heightCm = heightCm
    if (typeof weightKg === 'number') createData.weightKg = weightKg
    if (typeof bmi === 'number') createData.bmi = bmi
    if (measurements && typeof measurements === 'object') {
      const m: any = {}
      const keys = ['chest','waist','hips','neck','biceps','thighs']
      for (const k of keys) {
        const v = (measurements as any)[k]
        if (typeof v === 'number') m[k] = v
      }
      if (Object.keys(m).length) createData.measurements = m
    }
    if (['lose_fat','build_muscle','maintain','recomp'].includes(goal)) createData.goal = goal
    if (['sedentary','light','moderate','active','very_active'].includes(activityLevel)) createData.activityLevel = activityLevel

    const user = await User.create(createData)
    return NextResponse.json({ id: user._id, name: user.name, email: user.email }, { status: 201 })
  } catch (err) {
    console.error('Register error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
