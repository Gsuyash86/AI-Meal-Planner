import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import Recipe from '@/models/Recipe'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const recipes = await Recipe.find({ userId: (session.user as any).id }).sort({ createdAt: -1 })
  return NextResponse.json(recipes)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  const body = await req.json()
  const payload: any = {
    userId: (session.user as any).id,
    title: body.title,
    description: body.description,
    calories: body.calories,
    protein: body.protein,
    carbs: body.carbs,
    fat: body.fat,
    ingredients: body.ingredients || [],
    steps: body.steps || [],
    tags: body.tags || [],
  }
  if (body.imageUrl) payload.imageUrl = body.imageUrl
  if (body.youtubeUrl) payload.youtubeUrl = body.youtubeUrl
  if (body.sourceUrl) payload.sourceUrl = body.sourceUrl

  const created = await Recipe.create(payload)
  return NextResponse.json(created, { status: 201 })
}
