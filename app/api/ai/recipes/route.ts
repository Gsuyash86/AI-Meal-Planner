import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import Recipe from '@/models/Recipe'

// Minimal Gemini client
class GeminiClient {
  constructor(private apiKey: string, private model = process.env.GEMINI_MODEL || 'gemini-1.5-flash') {}
  async chat(prompt: string): Promise<string> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `Respond ONLY with minified JSON.\n\n${prompt}` }]
          }
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 800 }
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) {
      let detail: any = null
      try { detail = await res.json() } catch { try { detail = await res.text() } catch {} }
      const msg = typeof detail === 'string' ? detail : (detail?.error?.message || `Gemini API error: ${res.status}`)
      throw new Error(msg)
    }
    const data = await res.json()
    const parts = data?.candidates?.[0]?.content?.parts
    const text = Array.isArray(parts) ? parts.map((p: any) => p?.text).filter(Boolean).join('\n') : undefined
    if (!text) throw new Error('No content from Gemini')
    return text
  }
}

// Free path: parse schema.org JSON-LD Recipe from a URL
async function extractRecipeFromUrl(sourceUrl: string) {
  try {
    const res = await fetch(sourceUrl, { redirect: 'follow' })
    if (!res.ok) return null
    const html = await res.text()
    const scripts = Array.from(html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)).map(m => m[1])
    for (const script of scripts) {
      let json: any
      try {
        json = JSON.parse(script.trim())
      } catch {
        // Some LD+JSON blocks contain multiple JSON objects; try to recover by finding first { ... }
        continue
      }
      const candidates: any[] = Array.isArray(json) ? json : (json['@graph'] ? json['@graph'] : [json])
      for (const obj of candidates) {
        const types = ([] as string[]).concat(obj['@type'] || [])
        const isRecipe = types.includes('Recipe') || String(obj['@type'] || '').toLowerCase() === 'recipe'
        if (!isRecipe) continue
        // Map common fields
        const title = obj.name || obj.headline || ''
        const description = obj.description || ''
        const image = Array.isArray(obj.image) ? obj.image[0] : (typeof obj.image === 'string' ? obj.image : (obj.image?.url || null))
        const ingredients = (obj.recipeIngredient || obj.ingredients || []).map((s: any) => ({ name: String(s), quantity: undefined }))
        let steps: string[] = []
        if (Array.isArray(obj.recipeInstructions)) {
          steps = obj.recipeInstructions.map((st: any) => {
            if (typeof st === 'string') return st
            if (st?.text) return String(st.text)
            if (st?.name) return String(st.name)
            return ''
          }).filter(Boolean)
        } else if (typeof obj.recipeInstructions === 'string') {
          steps = obj.recipeInstructions.split(/\n+/).map((s: string) => s.trim()).filter(Boolean)
        }
        // Nutrition
        const nut = obj.nutrition || {}
        const calories = nut.calories ? Number(String(nut.calories).replace(/[^0-9.]/g, '')) : undefined
        const protein = nut.proteinContent ? Number(String(nut.proteinContent).replace(/[^0-9.]/g, '')) : undefined
        const carbs = nut.carbohydrateContent ? Number(String(nut.carbohydrateContent).replace(/[^0-9.]/g, '')) : undefined
        const fat = nut.fatContent ? Number(String(nut.fatContent).replace(/[^0-9.]/g, '')) : undefined

        return {
          title,
          description,
          imageUrl: image || undefined,
          ingredients,
          steps,
          calories,
          protein,
          carbs,
          fat,
          sourceUrl,
        }
      }
    }
    return null
  } catch {
    return null
  }
}

async function searchYouTube(query: string): Promise<string | undefined> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) return undefined
  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('q', query)
  url.searchParams.set('type', 'video')
  url.searchParams.set('maxResults', '1')
  url.searchParams.set('key', key)
  const res = await fetch(url.toString())
  if (!res.ok) return undefined
  const data = await res.json()
  const vid = data.items?.[0]?.id?.videoId
  return vid ? `https://www.youtube.com/watch?v=${vid}` : undefined
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const { query, sourceUrl, youtubeUrl: inYoutubeUrl, tags = [], enrich = false, preview = false } = await req.json()
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  await connectToDatabase()

  // Prefer free URL extraction when a URL is provided
  let aiJson: any = null
  let extracted: any = null
  if (sourceUrl) {
    extracted = await extractRecipeFromUrl(sourceUrl)
  }

  // If we still don't have data or if enrich is true, optionally use AI
  if (!extracted || enrich) {
    const task = sourceUrl
      ? `Extract a structured recipe from this URL: ${sourceUrl}`
      : `Find a typical recipe for this meal: ${query}`
    const format = `Return JSON with keys: {
      "title": string,
      "description": string,
      "calories": number | null,
      "protein": number | null,
      "carbs": number | null,
      "fat": number | null,
      "ingredients": [{"name": string, "quantity": string|null}],
      "steps": [string],
      "imageUrl": string | null,
      "youtubeUrl": string | null,
      "sourceUrl": string | null
    }`;
    const prompt = `${task}\n${format}\nRules:\n- Recipe must have macros and verified source.\n- Prefer concise steps.\n- imageUrl should be a representative image if available.`

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: sourceUrl ? 'Could not parse recipe from URL and no AI key configured.' : 'Provide GEMINI_API_KEY or a recipe URL.' }, { status: 400 })
    }
    const client = new GeminiClient(GEMINI_API_KEY)
    try {
      const text = await client.chat(prompt)
      if (typeof text !== 'string') throw new Error('Gemini API did not return a string')
      if (text) aiJson = JSON.parse(text)
    } catch (e: any) {
      const msg = e?.message || 'Gemini error'
      return NextResponse.json({ error: msg }, { status: 502 })
    }
  }

  // Merge AI output with extracted data without overwriting non-empty values with null/empty
  const mergedJson = extracted ? { ...extracted, ...aiJson } : aiJson

  // Fallback YouTube search if missing and we have a query/title
  let youtubeUrl = mergedJson.youtubeUrl || inYoutubeUrl;
  if (!youtubeUrl) {
    const q = query || mergedJson.title;
    if (q) youtubeUrl = await searchYouTube(`${q} recipe`)
  }

  const payload: any = {
    userId,
    title: mergedJson.title,
    description: mergedJson.description,
    calories: mergedJson.calories ?? undefined,
    protein: mergedJson.protein ?? undefined,
    carbs: mergedJson.carbs ?? undefined,
    fat: mergedJson.fat ?? undefined,
    ingredients: Array.isArray(mergedJson.ingredients) ? mergedJson.ingredients.map((i: any) => ({ name: i.name, quantity: i.quantity || undefined })) : [],
    steps: Array.isArray(mergedJson.steps) ? mergedJson.steps : [],
    tags,
    imageUrl: mergedJson.imageUrl || undefined,
    youtubeUrl: youtubeUrl || undefined,
    sourceUrl: mergedJson.sourceUrl || sourceUrl || undefined,
  }

  // In preview mode, just return the computed object without persisting
  if (preview) {
    return NextResponse.json(payload, { status: 200 })
  }
  try {
    const doc = new Recipe(payload)
    const created = await doc.save()
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
