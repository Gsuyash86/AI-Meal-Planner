"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'

interface Recipe {
  _id: string
  title: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  tags?: string[]
  ingredients?: { name: string; quantity?: string }[]
  steps?: string[]
  imageUrl?: string
  youtubeUrl?: string
  sourceUrl?: string
}

type IngredientRow = { name: string; quantity: string }

export default function RecipesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  // Manual form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [calories, setCalories] = useState<number | ''>('')
  const [protein, setProtein] = useState<number | ''>('')
  const [carbs, setCarbs] = useState<number | ''>('')
  const [fat, setFat] = useState<number | ''>('')
  const [ingredientsRows, setIngredientsRows] = useState<IngredientRow[]>([
    { name: '', quantity: '' },
  ])
  const [stepsText, setStepsText] = useState('') // newline-separated steps
  const [manualYoutubeUrl, setManualYoutubeUrl] = useState('')
  const [editId, setEditId] = useState<string | null>(null)

  // AI ingestion form state
  const [ingestUrl, setIngestUrl] = useState('')
  const [ingestQuery, setIngestQuery] = useState('')
  const [ingestTags, setIngestTags] = useState('') // comma-separated
  const [ingestYoutubeUrl, setIngestYoutubeUrl] = useState('')
  const [ingesting, setIngesting] = useState(false)
  const [ingestError, setIngestError] = useState<string | null>(null)

  // Preview state (used for both manual and AI flows)
  const [preview, setPreview] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const previewRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(undefined, { callbackUrl: '/recipes' })
    }
  }, [status])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/recipes')
        if (!res.ok) return
        const data = await res.json()
        setRecipes(data)
      } finally {
        setLoading(false)
      }
    }
    if (status === 'authenticated') load()
  }, [status])

  // Scroll to preview when it appears
  useEffect(() => {
    if (preview && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [preview])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    setIngredientsRows([{ name: '', quantity: '' }])
    setStepsText('')
    setManualYoutubeUrl('')
    setEditId(null)
  }

  const upsertRecipe = async (e: React.FormEvent) => {
    e.preventDefault()
    const ingredients = ingredientsRows
      .map((r) => ({ name: r.name.trim(), quantity: r.quantity.trim() }))
      .filter((r) => r.name.length > 0)
      .map((r) => ({ name: r.name, quantity: r.quantity || undefined }))

    const payload: Partial<Recipe> = {
      title,
      description: description || undefined,
      calories: calories === '' ? undefined : Number(calories),
      protein: protein === '' ? undefined : Number(protein),
      carbs: carbs === '' ? undefined : Number(carbs),
      fat: fat === '' ? undefined : Number(fat),
      ingredients: ingredients.length ? ingredients : undefined,
      steps: stepsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      youtubeUrl: manualYoutubeUrl || undefined,
    }
    // Preview before saving
    setPreview({ ...payload })
  }

  const beginEdit = (recipe: Recipe) => {
    setEditId(recipe._id)
    setTitle(recipe.title)
    setDescription(recipe.description || '')
    setCalories(typeof recipe.calories === 'number' ? recipe.calories : '')
    setProtein(typeof recipe.protein === 'number' ? recipe.protein : '')
    setCarbs(typeof recipe.carbs === 'number' ? recipe.carbs : '')
    setFat(typeof recipe.fat === 'number' ? recipe.fat : '')
    const rows: IngredientRow[] = (recipe.ingredients || []).map((i) => ({ name: i.name, quantity: i.quantity || '' }))
    setIngredientsRows(rows.length ? rows : [{ name: '', quantity: '' }])
    setStepsText((recipe.steps || []).join('\n'))
    setManualYoutubeUrl(recipe.youtubeUrl || '')
  }

  const deleteRecipe = async (id: string) => {
    const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setRecipes((r) => r.filter((it) => it._id !== id))
      if (editId === id) resetForm()
    }
  }

  const submitIngest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ingestUrl && !ingestQuery) {
      setIngestError('Enter a URL or a search query')
      return
    }
    setIngestError(null)
    setIngesting(true)
    try {
      const res = await fetch('/api/ai/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceUrl: ingestUrl || undefined,
          query: ingestQuery || undefined,
          youtubeUrl: ingestYoutubeUrl || undefined,
          tags: ingestTags
            .split(',')
            .map(t => t.trim())
            .filter(Boolean),
          preview: true,
        }),
      })
      if (!res.ok) {
        if (res.status === 429) {
          setIngestError('Rate limited by AI provider. Please retry in ~30–60 seconds.')
          return
        }
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to ingest recipe')
      }
      const draft = await res.json()
      setPreview(draft)
    } catch (e: any) {
      setIngestError(e.message)
    } finally {
      setIngesting(false)
    }
  }

  const confirmSave = async () => {
    if (!preview) return
    setSaving(true)
    try {
      // Decide create vs update for manual edit flow
      if (editId) {
        const res = await fetch(`/api/recipes/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preview),
        })
        if (!res.ok) throw new Error('Failed to update recipe')
        const updated = await res.json()
        setRecipes((r) => r.map((it) => (it._id === updated._id ? updated : it)))
      } else {
        const res = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preview),
        })
        if (!res.ok) throw new Error('Failed to save recipe')
        const created = await res.json()
        setRecipes((r) => [created, ...r])
      }
      // Cleanup
      setPreview(null)
      resetForm()
      setIngestUrl('')
      setIngestQuery('')
      setIngestTags('')
      setIngestYoutubeUrl('')
    } catch (e) {
      console.error(e)
      alert((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const cancelPreview = () => setPreview(null)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Your Recipes</h1>
        <Link href="/" className="btn btn-ghost">Home</Link>
      </div>

      {/* AI Ingestion */}
      <section className="mb-8">
        <form onSubmit={submitIngest} className="grid gap-3 bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl shadow-cred-soft">
          <div>
            <label className="label" htmlFor="ingest-url">Paste Recipe URL (optional)</label>
            <input id="ingest-url" className="input w-full" placeholder="https://example.com/your-recipe" value={ingestUrl} onChange={(e) => setIngestUrl(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ingest-query">Or enter a search query</label>
            <input id="ingest-query" className="input w-full" placeholder="e.g., High protein vegan burrito" value={ingestQuery} onChange={(e) => setIngestQuery(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ingest-youtube">YouTube URL (optional, overrides auto-pick)</label>
            <input id="ingest-youtube" className="input w-full" placeholder="https://www.youtube.com/watch?v=..." value={ingestYoutubeUrl} onChange={(e) => setIngestYoutubeUrl(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ingest-tags">Tags (comma-separated)</label>
            <input id="ingest-tags" className="input w-full" placeholder="Vegan, High-Protein, Dinner" value={ingestTags} onChange={(e) => setIngestTags(e.target.value)} />
          </div>
          {ingestError && <p className="text-cred-red text-sm">{ingestError}</p>}
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary" disabled={ingesting} aria-busy={ingesting} aria-label="Ingest recipe">
              {ingesting ? 'Preparing preview…' : 'Preview with AI'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setIngestUrl(''); setIngestQuery(''); setIngestTags(''); setIngestYoutubeUrl(''); setIngestError(null) }}>Clear</button>
          </div>
        </form>
      </section>

      {/* Manual Add */}
      <section className="mb-8">
        <form onSubmit={upsertRecipe} className="grid gap-3 bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl shadow-cred-soft">
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input id="title" className="input w-full" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Chicken Salad" title="Recipe title" />
          </div>
          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" className="input w-full min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" title="Recipe description" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="label" htmlFor="calories">Calories</label>
              <input id="calories" className="input w-full" type="number" value={calories} onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 420" title="Calories (kcal)" />
            </div>
            <div>
              <label className="label" htmlFor="protein">Protein (g)</label>
              <input id="protein" className="input w-full" type="number" value={protein} onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 35" title="Protein in grams" />
            </div>
            <div>
              <label className="label" htmlFor="carbs">Carbs (g)</label>
              <input id="carbs" className="input w-full" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 40" title="Carbs in grams" />
            </div>
            <div>
              <label className="label" htmlFor="fat">Fat (g)</label>
              <input id="fat" className="input w-full" type="number" value={fat} onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 12" title="Fat in grams" />
            </div>
          </div>
          <div>
            <label className="label">Ingredients</label>
            <div className="space-y-2">
              {ingredientsRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="input col-span-6"
                    placeholder="Name (e.g., Chicken)"
                    value={row.name}
                    onChange={(e) => {
                      const v = e.target.value
                      setIngredientsRows((prev) => prev.map((r, i) => i === idx ? { ...r, name: v } : r))
                    }}
                    aria-label={`Ingredient ${idx + 1} name`}
                  />
                  <input
                    className="input col-span-4"
                    placeholder="Quantity (e.g., 200g)"
                    value={row.quantity}
                    onChange={(e) => {
                      const v = e.target.value
                      setIngredientsRows((prev) => prev.map((r, i) => i === idx ? { ...r, quantity: v } : r))
                    }}
                    aria-label={`Ingredient ${idx + 1} quantity`}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost col-span-2"
                    onClick={() => setIngredientsRows((prev) => prev.filter((_, i) => i !== idx))}
                    aria-label={`Remove ingredient ${idx + 1}`}
                    disabled={ingredientsRows.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIngredientsRows((prev) => [...prev, { name: '', quantity: '' }])}
                aria-label="Add ingredient"
              >
                Add ingredient
              </button>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="steps">Steps / Instructions (one per line)</label>
            <textarea id="steps" className="input w-full min-h-[120px]" value={stepsText} onChange={(e) => setStepsText(e.target.value)} placeholder="e.g.,\n1) Preheat oven to 180C\n2) Mix all ingredients\n3) Bake 20 minutes" />
          </div>
          <div>
            <label className="label" htmlFor="manual-youtube">YouTube URL (optional)</label>
            <input id="manual-youtube" className="input w-full" placeholder="https://www.youtube.com/watch?v=..." value={manualYoutubeUrl} onChange={(e) => setManualYoutubeUrl(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary w-full sm:w-auto" aria-label={editId ? 'Preview update' : 'Preview recipe'}>
              {editId ? 'Preview Update' : 'Preview Recipe'}
            </button>
            {editId && (
              <button type="button" className="btn btn-ghost" onClick={resetForm} aria-label="Cancel edit">Cancel</button>
            )}
          </div>
        </form>
      </section>

      {/* Preview Drawer */}
      {preview && (
        <section className="mb-8" ref={previewRef}>
          <div className="card p-5">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <div className="space-y-2 text-sm">
              {preview.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.imageUrl} alt={preview.title || 'Recipe image'} className="w-full max-h-64 object-cover rounded" />
              )}
              <p><strong>Title:</strong> {preview.title}</p>
              {preview.description && <p><strong>Description:</strong> {preview.description}</p>}
              <p className="text-text-tertiary">
                {(typeof preview.calories === 'number') && <span className="mr-2">{preview.calories} kcal</span>}
                {(typeof preview.protein === 'number') && <span className="mr-2">P: {preview.protein}g</span>}
                {(typeof preview.carbs === 'number') && <span className="mr-2">C: {preview.carbs}g</span>}
                {(typeof preview.fat === 'number') && <span>F: {preview.fat}g</span>}
              </p>
              {Array.isArray(preview.ingredients) && preview.ingredients.length > 0 && (
                <div>
                  <p className="font-medium">Ingredients</p>
                  <ul className="list-disc list-inside text-text-secondary">
                    {preview.ingredients.map((ing: any, idx: number) => (
                      <li key={idx}>{ing.name}{ing.quantity ? ` — ${ing.quantity}` : ''}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(preview.steps) && preview.steps.length > 0 && (
                <div>
                  <p className="font-medium">Steps</p>
                  <ol className="list-decimal list-inside text-text-secondary space-y-0.5">
                    {preview.steps.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}
              {preview.youtubeUrl && (
                <p><strong>YouTube:</strong> <a className="link" href={preview.youtubeUrl} target="_blank" rel="noreferrer">{preview.youtubeUrl}</a></p>
              )}
              {preview.sourceUrl && (
                <p><strong>Source:</strong> <a className="link" href={preview.sourceUrl} target="_blank" rel="noreferrer">{preview.sourceUrl}</a></p>
              )}
              {Array.isArray(preview.tags) && preview.tags.length > 0 && (
                <p><strong>Tags:</strong> {preview.tags.join(', ')}</p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn btn-primary" onClick={confirmSave} disabled={saving} aria-busy={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button className="btn btn-ghost" onClick={cancelPreview}>Cancel</button>
            </div>
          </div>
        </section>
      )}

      <section>
        {loading ? (
          <div className="skeleton h-20 rounded-xl" />
        ) : recipes.length === 0 ? (
          <p className="text-text-secondary">No recipes yet. Add your first recipe above.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((r) => (
              <li key={r._id} className="card p-5">
                <h3 className="text-lg font-medium mb-1">{r.title}</h3>
                {r.description && <p className="text-text-secondary text-sm mb-2">{r.description}</p>}
                {typeof r.calories === 'number' && (
                  <p className="text-xs text-text-tertiary">{r.calories} kcal</p>
                )}
                <div className="mt-2 text-xs text-text-tertiary space-x-2">
                  {typeof r.protein === 'number' && <span>P: {r.protein}g</span>}
                  {typeof r.carbs === 'number' && <span>C: {r.carbs}g</span>}
                  {typeof r.fat === 'number' && <span>F: {r.fat}g</span>}
                </div>
                {r.ingredients && r.ingredients.length > 0 && (
                  <ul className="mt-3 text-sm list-disc list-inside text-text-secondary space-y-0.5">
                    {r.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing.name}{ing.quantity ? ` — ${ing.quantity}` : ''}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex gap-2">
                  <button className="btn btn-ghost" onClick={() => beginEdit(r)} aria-label={`Edit ${r.title}`}>Edit</button>
                  <button className="btn btn-danger" onClick={() => deleteRecipe(r._id)} aria-label={`Delete ${r.title}`}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
