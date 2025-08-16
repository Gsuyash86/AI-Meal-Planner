import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import Recipe from '@/models/Recipe'
import mongoose from 'mongoose'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const recipe = await Recipe.findOne({ _id: params.id, userId: (session.user as any).id })
  if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(recipe)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const body = await req.json()
  const update: any = { ...body }
  delete update._id
  delete update.userId
  const updated = await Recipe.findOneAndUpdate(
    { _id: params.id, userId: (session.user as any).id },
    update,
    { new: true }
  )
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectToDatabase()
  if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const res = await Recipe.findOneAndDelete({ _id: params.id, userId: (session.user as any).id })
  if (!res) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
