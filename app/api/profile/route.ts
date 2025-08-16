import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const user = await User.findById((session.user as any).id)
      .select('name email avatarUrl heightCm weightKg bmi measurements goal activityLevel')
      .exec()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json(user)
  } catch (e) {
    console.error('GET /api/profile error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      avatarUrl,
      heightCm,
      weightKg,
      bmi,
      measurements,
      goal,
      activityLevel,
    } = body || {}

    await connectToDatabase()
    const update: any = {}
    if (typeof name === 'string') update.name = name
    if (typeof avatarUrl === 'string') update.avatarUrl = avatarUrl
    const toNum = (v: unknown) => (typeof v === 'number' ? v : (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)) ? Number(v) : undefined))
    const numHeight = toNum(heightCm)
    const numWeight = toNum(weightKg)
    const numBmi = toNum(bmi)
    if (typeof numHeight === 'number') update.heightCm = numHeight
    if (typeof numWeight === 'number') update.weightKg = numWeight
    if (typeof numBmi === 'number') update.bmi = numBmi
    if (measurements && typeof measurements === 'object') {
      const m: any = {}
      const keys = ['chest','waist','hips','neck','biceps','thighs'] as const
      for (const k of keys) {
        const val = toNum((measurements as any)[k])
        if (typeof val === 'number') m[k] = val
      }
      update.measurements = m
    }
    if (typeof goal === 'string') update.goal = goal
    if (typeof activityLevel === 'string') update.activityLevel = activityLevel

    const userId = (session.user as any).id
    if (!userId) {
      return NextResponse.json({ error: 'No user id in session' }, { status: 401 })
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // Temporary debug logs (remove in production)
    try {
      console.log('[PROFILE PUT] userId:', userId)
      console.log('[PROFILE PUT] update payload:', JSON.stringify(update))
    } catch {}

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, runValidators: true }
    )
      .select('name email avatarUrl heightCm weightKg bmi measurements goal activityLevel')
      .exec()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (e) {
    console.error('PUT /api/profile error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
