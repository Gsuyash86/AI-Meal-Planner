import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import MealPlan, { MealSlot, IMealEntry, IMealPlan } from '@/models/MealPlan'

function getWeekStart(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = d.getUTCDay() // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day) // move to Monday
  d.setUTCDate(d.getUTCDate() + diff)
  return d
}

function normalizeWeekStartParam(value: string | null): Date | null {
  if (!value) return null
  const d = new Date(value)
  if (isNaN(d.getTime())) return null
  // normalize to Monday of that week
  return getWeekStart(d)
}

function buildWeekDays(weekStart: Date) {
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(weekStart)
    date.setUTCDate(weekStart.getUTCDate() + i)
    return date
  })
}

function computeTotals(day: { meals: Record<MealSlot, IMealEntry[]> }) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  for (const slot of ['breakfast','lunch','dinner','snack'] as MealSlot[]) {
    const arr = day.meals[slot] || []
    for (const m of arr) {
      if (!m) continue
      totals.calories += m.calories || 0
      totals.protein += m.protein || 0
      totals.carbs += m.carbs || 0
      totals.fat += m.fat || 0
    }
  }
  return totals
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const userId = (session.user as any).id
  const url = new URL(req.url)
  const weekParam = normalizeWeekStartParam(url.searchParams.get('weekStart'))
  const weekStart = weekParam || getWeekStart()
  let plan = await MealPlan.findOne({ userId, weekStart })
  if (!plan) {
    const days = buildWeekDays(weekStart).map((date) => ({
      date,
      meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    }))
    plan = await MealPlan.create({ userId, weekStart, days })
  }
  return NextResponse.json(plan)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const userId = (session.user as any).id
  const url = new URL(req.url)
  const weekParam = normalizeWeekStartParam(url.searchParams.get('weekStart'))
  const body = await req.json()
  const weekStart = weekParam || getWeekStart()
  // Expect body.days (length 7) with meals per slot (arrays); compute totals
  const days = (body?.days || []).slice(0,7).map((d: any) => {
    const day = {
      date: d?.date ? new Date(d.date) : undefined,
      meals: {
        breakfast: Array.isArray(d?.meals?.breakfast) ? d.meals.breakfast : (d?.meals?.breakfast ? [d.meals.breakfast] : []),
        lunch: Array.isArray(d?.meals?.lunch) ? d.meals.lunch : (d?.meals?.lunch ? [d.meals.lunch] : []),
        dinner: Array.isArray(d?.meals?.dinner) ? d.meals.dinner : (d?.meals?.dinner ? [d.meals.dinner] : []),
        snack: Array.isArray(d?.meals?.snack) ? d.meals.snack : (d?.meals?.snack ? [d.meals.snack] : []),
      },
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    }
    const t = computeTotals(day as any)
    ;(day as any).totals = t
    return day
  })
  const normalizedDays = days.length === 7 ? days : buildWeekDays(weekStart).map((date, i) => days[i] ? { ...days[i], date } : { date, meals: { breakfast: [], lunch: [], dinner: [], snack: [] }, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }})
  const updated = await MealPlan.findOneAndUpdate(
    { userId, weekStart },
    { $set: { days: normalizedDays } },
    { upsert: true, new: true }
  )
  return NextResponse.json(updated)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const userId = (session.user as any).id
  const url = new URL(req.url)
  const dayIndex = Number(url.searchParams.get('dayIndex')) // 0..6
  const slot = url.searchParams.get('slot') as MealSlot | null
  const action = (url.searchParams.get('action') || 'replace') as 'add' | 'replace' | 'remove' | 'clear'
  const indexParam = url.searchParams.get('index')
  const index = indexParam != null ? Number(indexParam) : undefined
  const weekParam = normalizeWeekStartParam(url.searchParams.get('weekStart'))
  if (Number.isNaN(dayIndex) || dayIndex < 0 || dayIndex > 6 || !slot || !['breakfast','lunch','dinner','snack'].includes(slot)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }
  const body = await req.json()
  const entry: IMealEntry | null = body?.entry ?? null
  const weekStart = weekParam || getWeekStart()
  const plan = await MealPlan.findOne({ userId, weekStart })
  if (!plan) return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 })
  // Normalize legacy data where a slot might be a single object instead of an array
  const existingSlot = (plan.days[dayIndex].meals as any)[slot]
  const arr: IMealEntry[] = Array.isArray(existingSlot)
    ? existingSlot
    : (existingSlot ? [existingSlot] : [])
  if (action === 'clear') {
    (plan.days[dayIndex].meals as any)[slot] = []
  } else if (action === 'add') {
    const next = entry ? [...arr, entry] : arr
    ;(plan.days[dayIndex].meals as any)[slot] = next
  } else if (action === 'remove') {
    let next: IMealEntry[]
    if (typeof index === 'number' && index >= 0 && index < arr.length) {
      next = arr.filter((_, i) => i !== index)
    } else {
      next = arr.slice(0, Math.max(0, arr.length - 1))
    }
    (plan.days[dayIndex].meals as any)[slot] = next
  } else { // replace
    if (typeof index === 'number') {
      if (entry) {
        const next = index >= 0 && index < arr.length
          ? arr.map((it, i) => (i === index ? entry : it))
          : [...arr, entry]
        ;(plan.days[dayIndex].meals as any)[slot] = next
      } else {
        // replace with null => remove index
        const next = (index >= 0 && index < arr.length) ? arr.filter((_, i) => i !== index) : arr
        ;(plan.days[dayIndex].meals as any)[slot] = next
      }
    } else {
      ;(plan.days[dayIndex].meals as any)[slot] = entry ? [entry] : []
    }
  }
  plan.days[dayIndex].totals = computeTotals(plan.days[dayIndex] as any)
  await plan.save()
  return NextResponse.json(plan)
}
