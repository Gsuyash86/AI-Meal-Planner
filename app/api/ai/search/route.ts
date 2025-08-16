import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import Recipe from '@/models/Recipe'

// Minimal Gemini client
class GeminiClient {
  constructor(private apiKey: string, private model = process.env.GEMINI_MODEL || 'gemini-1.5-flash') {}

  async searchMeals(query: string): Promise<any[]> {
    const prompt = `Generate 3 meal based on real sources, verified sources, verified recipe with youtube url and source url and verified image url: ${query}. For each meal, return JSON with:
    - name: string (creative meal name)
    - description: string (1-2 sentences)
    - calories: number
    - protein: number (in grams)
    - carbs: number (in grams)
    - fat: number (in grams)
    - cookTime: number (in minutes)
    - steps: string[] (list of steps)
    - difficulty: 'Easy' | 'Medium' | 'Hard'
    - rating: number (1-5 with 1 decimal)
    - ingredients: string[] (list of ingredients)
    - sourceUrl: string (URL of the recipe)
    - imageUrl: string (URL of the recipe image)
    - youtubeUrl: string (URL of the recipe video)
    - tags: string[] (e.g., ['vegetarian', 'high-protein', 'low-carb'])
    
    Return only a JSON array of meal objects, no other text or markdown formatting.`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: prompt }]
          }],
          generationConfig: { 
            temperature: 0.5, // Reduced temperature for more consistent results
            maxOutputTokens: 2000,
            topP: 0.9,
            topK: 40
          }
        }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!res.ok) {
        const error = await res.json()
        console.error('Gemini API error:', error)
        throw new Error(error?.error?.message || 'Failed to fetch from Gemini API')
      }

      const data = await res.json()
      console.log('Gemini raw response:', JSON.stringify(data, null, 2))
      
      // Extract text from response
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (!text) {
        console.error('No text content in Gemini response:', data)
        throw new Error('No content from Gemini')
      }

      // Clean up the response text
      // 1. Remove markdown code blocks if present
      text = text.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/g, '$1')
      // 2. Remove any leading/trailing whitespace
      text = text.trim()
      // 3. Remove any non-JSON content before or after the JSON array
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s)
      if (jsonMatch) {
        text = jsonMatch[0]
      }

      console.log('Processed text before JSON parse:', text)

      // Parse the JSON
      let result
      try {
        result = JSON.parse(text)
      } catch (parseError) {
        console.error('Failed to parse JSON:', text)
        throw new Error(`Failed to parse Gemini response: ${parseError.message}`)
      }

      if (!Array.isArray(result)) {
        console.error('Expected array but got:', result)
        throw new Error('Invalid response format from Gemini: expected an array of meals')
      }

      // Validate and transform the results
      return result.map((meal, index) => ({
        id: index + 1, // Generate a simple ID if not present
        name: meal.name || `Meal ${index + 1}`,
        description: meal.description || '',
        calories: Number(meal.calories) || 0,
        protein: Number(meal.protein) || 0,
        carbs: Number(meal.carbs) || 0,
        fat: Number(meal.fat) || 0,
        steps: Array.isArray(meal.steps) ? meal.steps : [],
        sourceUrl: meal.sourceUrl || null,
        imageUrl: meal.imageUrl || null,
        youtubeUrl: meal.youtubeUrl || null,
        cookTime: Number(meal.cookTime) || 15,
        difficulty: ['Easy', 'Medium', 'Hard'].includes(meal.difficulty) 
          ? meal.difficulty 
          : 'Medium',
        rating: Math.min(5, Math.max(1, Number(meal.rating) || 4.0)).toFixed(1),
        ingredients: Array.isArray(meal.ingredients) 
          ? meal.ingredients 
          : [],
        tags: Array.isArray(meal.tags) 
          ? meal.tags
          : [],
      }))

    } catch (error) {
      console.error('Error in Gemini search:', error)
      throw error
    }
  }
}

export async function POST(req: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { query } = await req.json()
    if (!query || typeof query !== 'string') {
      return new NextResponse(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Search database first
    const dbResults = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      isPublic: true
    }).limit(5).lean()


    // Search AI if needed or if no DB results
    const geminiApiKey = process.env.GEMINI_API_KEY
    let aiResults: any[] = []

    if (geminiApiKey && (dbResults.length < 3 || query.length > 5)) {
      try {
        const gemini = new GeminiClient(geminiApiKey)
        aiResults = await gemini.searchMeals(query)
        // Add source and format AI results
        aiResults = aiResults.map(meal => ({
          ...meal,
          _id: `ai-${Math.random().toString(36).substr(2, 9)}`,
          source: 'ai',
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      } catch (error) {
        console.error('AI search failed, falling back to DB results only:', error)
      }
    }

    // Combine and deduplicate results (favor DB results)
    const combinedResults = [
      ...dbResults.map(r => ({ ...r, source: 'database' })),
      ...aiResults.filter(ai => 
        !dbResults.some(db => 
          db.title.toLowerCase() === ai.name.toLowerCase()
        )
      )
    ]

    return NextResponse.json({
      results: combinedResults,
      meta: {
        total: combinedResults.length,
        fromDatabase: dbResults.length,
        fromAI: aiResults.length
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to process search',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    )
  }
}
