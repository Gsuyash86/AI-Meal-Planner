'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Flame, Target, Plus, MoreHorizontal, Share, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { MealPlanDoc, DayEntry, MealSlot, MealEntry } from '@/types'
import { NUTRITION_GOALS } from '@/utils/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

function toMondayUTC(d = new Date()) {
  const copy = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const dow = copy.getUTCDay() // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow
  copy.setUTCDate(copy.getUTCDate() + diff)
  copy.setUTCHours(0,0,0,0)
  return copy
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

function addWeeks(date: Date, weeks: number) {
  return addDays(date, weeks * 7)
}

function pct(part: number, total: number) {
  if (!total || total <= 0) return 0
  return Math.min(100, Math.round((part / total) * 100))
}

export default function MealPlan() {
  const [plan, setPlan] = useState<MealPlanDoc | null>(null)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Week navigation
  const [weekStart, setWeekStart] = useState<Date>(toMondayUTC(new Date()))

  // Profile goals
  const [goalTargets, setGoalTargets] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null)

  // Recipe picker state
  const [pickerOpen, setPickerOpen] = useState<{ open: boolean; dayIndex: number | null; slot: MealSlot | null; action: 'add' | 'replace'; index?: number }>({ open: false, dayIndex: null, slot: null, action: 'add' })
  const [recipes, setRecipes] = useState<any[]>([])
  const [recipesLoading, setRecipesLoading] = useState(false)
  const [customEntry, setCustomEntry] = useState<MealEntry>({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 })

  // Calorie target prompt
  const [userCalTarget, setUserCalTarget] = useLocalStorage<number | null>('mealplan_cal_target', null)
  const [calPromptOpen, setCalPromptOpen] = useState(false)
  const [calPromptSeen, setCalPromptSeen] = useLocalStorage<boolean>('mealplan_cal_prompt_seen', false)

  // Load plan when weekStart changes
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/meal-plans?weekStart=${encodeURIComponent(weekStart.toISOString())}`)
        if (!res.ok) throw new Error('Failed to load meal plan')
        const data = await res.json()
        setPlan(data)
        setSelectedDayIndex(0)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [weekStart])

  // Load user profile to determine targets
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) return
        const profile = await res.json()
        // Map goal to constants
        const map: Record<string, keyof typeof NUTRITION_GOALS> = {
          lose_fat: 'WEIGHT_LOSS',
          build_muscle: 'MUSCLE_GAIN',
          maintain: 'MAINTENANCE',
          recomp: 'MAINTENANCE',
        }
        const key = map[profile.goal] || 'MAINTENANCE'
        const g = NUTRITION_GOALS[key]
        setGoalTargets(g)
      } catch {}
    }
    loadProfile()
  }, [])

  const currentDay = useMemo(() => plan?.days?.[selectedDayIndex] as DayEntry | undefined, [plan, selectedDayIndex])

  // No auto-open. Users can set target via the "Set Target" button; otherwise profile default is used.

  const openPicker = async (dayIndex: number, slot: MealSlot, action: 'add' | 'replace' = 'add', index?: number) => {
    setPickerOpen({ open: true, dayIndex, slot, action, index })
    if (recipes.length === 0) {
      setRecipesLoading(true)
      try {
        const res = await fetch('/api/recipes')
        if (res.ok) setRecipes(await res.json())
      } finally {
        setRecipesLoading(false)
      }
    }
  }

  const patchEntry = async (dayIndex: number, slot: MealSlot, entry: MealEntry | null, action: 'add' | 'replace' | 'remove' | 'clear' = 'replace', index?: number) => {
    const params = new URLSearchParams({ dayIndex: String(dayIndex), slot, weekStart: weekStart.toISOString(), action })
    if (typeof index === 'number') params.set('index', String(index))
    const res = await fetch(`/api/meal-plans?${params.toString()}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry }),
    })
    if (!res.ok) return null
    return await res.json()
  }

  const applyEntry = async (entry: MealEntry | null) => {
    if (!plan || !pickerOpen.open || pickerOpen.dayIndex == null || !pickerOpen.slot) return
    const updated = await patchEntry(pickerOpen.dayIndex, pickerOpen.slot, entry, pickerOpen.action, pickerOpen.index)
    if (updated) {
      setPlan(updated)
      setPickerOpen({ open: false, dayIndex: null, slot: null, action: 'add' })
      setCustomEntry({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 })
    }
  }

  const updateTime = async (slot: MealSlot, newTime: string) => {
    if (!currentDay) return
    const arr = currentDay.meals[slot] || []
    if (!arr.length) return
    const first = { ...arr[0], time: newTime }
    const updated = await patchEntry(selectedDayIndex, slot, first, 'replace', 0)
    if (updated) setPlan(updated)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="skeleton h-24 rounded-xl mb-6" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    )
  }
  if (error) {
    return <div className="max-w-4xl mx-auto text-red-400">{error}</div>
  }
  if (!plan) return null

  const weekTitle = new Date(plan.weekStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  const effectiveCalorieTarget = userCalTarget ?? goalTargets?.calories ?? 0

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-2 gradient-text">7-Day Meal Plan</h2>
        <div className="flex items-center justify-center gap-3 text-text-secondary">
          <button
            className="p-2 rounded-xl bg-dark-card border border-dark-border hover:border-cred-purple/50"
            onClick={() => setWeekStart((w) => addWeeks(w, -1))}
            aria-label="Previous week"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="inline-flex items-center gap-2"><Calendar size={16} /> Week of {weekTitle}</span>
          <button
            className="p-2 rounded-xl bg-dark-card border border-dark-border hover:border-cred-purple/50"
            onClick={() => setWeekStart((w) => addWeeks(w, 1))}
            aria-label="Next week"
          >
            <ChevronRight size={18} />
          </button>
          <button
            className="ml-4 px-3 py-1 rounded-xl border border-dark-border hover:border-cred-purple/50"
            onClick={() => setCalPromptOpen(true)}
          >
            Set Target
          </button>
        </div>
      </motion.div>

      {/* Day Selector */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {plan.days.map((d, i) => {
          const date = new Date(d.date)
          const dayName = date.toLocaleDateString(undefined, { weekday: 'long' })
          return (
            <button
              key={i}
              onClick={() => setSelectedDayIndex(i)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedDayIndex === i
                  ? 'bg-cred-purple text-white shadow-lg shadow-cred-purple/25'
                  : 'bg-dark-card border border-dark-border text-text-secondary hover:border-cred-purple/50 hover:text-white'
              }`}
            >
              <div className="text-sm">Day {i + 1}</div>
              <div className="text-xs opacity-75">{dayName}</div>
            </button>
          )
        })}
      </motion.div>

      {/* Daily Overview */}
      {currentDay && (
        <motion.div
          className="floating-card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Day {selectedDayIndex + 1} - {new Date(currentDay.date).toLocaleDateString(undefined, { weekday: 'long' })}
              </h3>
              <p className="text-text-secondary">Complete nutrition breakdown for the day</p>
            </div>
            <div className="flex items-center space-x-4">
              <button aria-label="Share day" className="p-2 bg-dark-card border border-dark-border rounded-xl hover:border-cred-purple/50 transition-all duration-300">
                <Share size={20} />
              </button>
              <button aria-label="More options" className="p-2 bg-dark-card border border-dark-border rounded-xl hover:border-cred-purple/50 transition-all duration-300">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Stat label="Total Calories" value={`${currentDay.totals.calories}`} icon={<Flame className="text-cred-red" size={24} />} bg="bg-cred-red/20" />
            <Stat label="Protein" value={`${currentDay.totals.protein}g`} icon={<Target className="text-cred-green" size={24} />} bg="bg-cred-green/20" />
            <Stat label="Carbs" value={`${currentDay.totals.carbs}g`} icon={<div className="w-6 h-6 bg-cred-cyan rounded-full" />} bg="bg-cred-cyan/20" />
            <Stat label="Fat" value={`${currentDay.totals.fat}g`} icon={<div className="w-6 h-6 bg-cred-orange rounded-full" />} bg="bg-cred-orange/20" />
          </div>

          {effectiveCalorieTarget > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Progress label={`Calories ${currentDay.totals.calories}/${effectiveCalorieTarget}`} percent={pct(currentDay.totals.calories, effectiveCalorieTarget)} color="bg-cred-red" />
              {goalTargets && (
                <>
                  <Progress label={`Protein ${currentDay.totals.protein}g/${goalTargets.protein}g`} percent={pct(currentDay.totals.protein, goalTargets.protein)} color="bg-cred-green" />
                  <Progress label={`Carbs ${currentDay.totals.carbs}g/${goalTargets.carbs}g`} percent={pct(currentDay.totals.carbs, goalTargets.carbs)} color="bg-cred-cyan" />
                  <Progress label={`Fat ${currentDay.totals.fat}g/${goalTargets.fat}g`} percent={pct(currentDay.totals.fat, goalTargets.fat)} color="bg-cred-orange" />
                </>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Meal Slots */}
      <div className="space-y-6">
        {(['breakfast','lunch','dinner','snack'] as MealSlot[]).map((slot) => {
          const entries = currentDay?.meals[slot] || []
          return (
            <motion.div
              key={slot}
              className="floating-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-3 mb-3">
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-dark-card border border-dark-border text-text-secondary">
                      {SLOT_LABELS[slot]}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-cred-cyan" />
                      <input
                        type="time"
                        className="bg-dark-card border border-dark-border rounded-lg px-2 py-1 text-sm"
                        aria-label={`Set ${SLOT_LABELS[slot]} time`}
                        placeholder="--:--"
                        value={(entries[0]?.time) || ''}
                        onChange={(e) => updateTime(slot, e.target.value)}
                      />
                    </div>
                  </div>
                  {entries.length === 0 ? (
                    <p className="text-text-secondary mb-4">Pick a recipe or add your own meal.</p>
                  ) : (
                    <div className="space-y-4">
                      {entries.map((entry, i) => (
                        <div key={i} className="border border-dark-border rounded-xl p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold mb-2">{entry?.name || `Item ${i+1}`}</h4>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                                <Macro label="cal" value={entry?.calories || 0} color="text-cred-red" />
                                <Macro label="protein" value={(entry?.protein || 0) + 'g'} color="text-cred-green" />
                                <Macro label="carbs" value={(entry?.carbs || 0) + 'g'} color="text-cred-cyan" />
                                <Macro label="fat" value={(entry?.fat || 0) + 'g'} color="text-cred-orange" />
                              </div>
                              {entry?.ingredients?.length ? (
                                <div className="bg-dark-card/50 rounded-xl p-3">
                                  <h5 className="font-semibold mb-2 text-sm text-text-secondary">Ingredients:</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {entry.ingredients.map((ing, k) => (
                                      <span key={k} className="px-2 py-1 bg-dark-border rounded-lg text-xs text-text-secondary">{typeof ing === 'string' ? ing : String(ing)}</span>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <div className="flex flex-col gap-2">
                              <button className="cred-button text-xs px-3 py-1" onClick={() => openPicker(selectedDayIndex, slot, 'replace', i)}>Substitute</button>
                              <button
                                className="px-3 py-1 border border-dark-border rounded-lg text-text-secondary hover:border-cred-purple/50 hover:text-white transition-all duration-300 text-xs"
                                onClick={async () => {
                                  const updated = await patchEntry(selectedDayIndex, slot, null, 'remove', i)
                                  if (updated) setPlan(updated)
                                }}
                              >Remove</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:ml-6 mt-4 lg:mt-0 flex flex-col space-y-2">
                  <button className="cred-button text-sm px-4 py-2" onClick={() => openPicker(selectedDayIndex, slot, 'add')}>
                    <span className="inline-flex items-center gap-1"><Plus size={16} /> Add</span>
                  </button>
                  {entries.length > 0 && (
                    <button
                      className="px-4 py-2 border border-dark-border rounded-xl text-text-secondary hover:border-cred-purple/50 hover:text-white transition-all duration-300 text-sm"
                      onClick={async () => {
                        const updated = await patchEntry(selectedDayIndex, slot, null, 'clear')
                        if (updated) setPlan(updated)
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      {/* Picker Modal */}
      {pickerOpen.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl p-4 relative">
            <button aria-label="Close picker" className="absolute right-3 top-3 text-text-secondary hover:text-white" onClick={() => setPickerOpen({ open: false, dayIndex: null, slot: null, action: 'add' })}>
              <X size={18} />
            </button>
            <h3 className="text-xl font-semibold mb-3">Choose a recipe or add custom</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 overflow-y-auto max-h-80">
                {recipesLoading ? (
                  <div className="text-text-secondary">Loading recipes…</div>
                ) : recipes.length ? (
                  recipes.map((r) => (
                    <div key={r._id} className="p-3 border border-dark-border rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.title}</div>
                        <div className="text-xs text-text-secondary">{r.calories || 0} cal • {r.protein || 0}g P • {r.carbs || 0}g C • {r.fat || 0}g F</div>
                      </div>
                      <button
                        className="cred-button text-sm"
                        onClick={() => applyEntry({
                          recipeId: r._id,
                          name: r.title,
                          calories: r.calories,
                          protein: r.protein,
                          carbs: r.carbs,
                          fat: r.fat,
                          ingredients: r.ingredients?.map((i: any) => (i.name ? `${i.name}${i.quantity ? ` (${i.quantity})` : ''}` : String(i))) || [],
                        })}
                      >
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-text-secondary text-sm">No recipes found. Create some in Recipes.</div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm text-text-secondary">Custom Meal</h4>
                <input className="input w-full" placeholder="Name" value={customEntry.name || ''} onChange={(e) => setCustomEntry((c) => ({ ...c, name: e.target.value }))} />
                <div className="grid grid-cols-2 gap-2">
                  <input className="input" type="number" placeholder="Calories" value={customEntry.calories ?? ''} onChange={(e) => setCustomEntry((c) => ({ ...c, calories: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                  <input className="input" type="number" placeholder="Protein (g)" value={customEntry.protein ?? ''} onChange={(e) => setCustomEntry((c) => ({ ...c, protein: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                  <input className="input" type="number" placeholder="Carbs (g)" value={customEntry.carbs ?? ''} onChange={(e) => setCustomEntry((c) => ({ ...c, carbs: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                  <input className="input" type="number" placeholder="Fat (g)" value={customEntry.fat ?? ''} onChange={(e) => setCustomEntry((c) => ({ ...c, fat: e.target.value === '' ? undefined : Number(e.target.value) }))} />
                </div>
                <button
                  className="cred-button w-full"
                  onClick={() => applyEntry(customEntry.name ? customEntry : null)}
                >
                  Add Custom Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calorie Target Modal */}
      {calPromptOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-dark-card border border-dark-border rounded-2xl p-4 relative">
            <button aria-label="Close calorie target modal" className="absolute right-3 top-3 text-text-secondary hover:text-white" onClick={() => setCalPromptOpen(false)}>
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-2">Set Daily Calorie Target</h3>
            <p className="text-sm text-text-secondary mb-3">We'll use this to show progress for calories.</p>
            <div className="space-y-2">
              <label className="text-xs text-text-secondary" htmlFor="calTarget">Calories (kcal)</label>
              <input id="calTarget" className="input w-full" type="number" placeholder="e.g., 2200" defaultValue={userCalTarget ?? ''} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-1 rounded-xl border border-dark-border text-text-secondary hover:border-cred-purple/50 hover:text-white" onClick={() => { setUserCalTarget(null as any); setCalPromptOpen(false) }}>Use Profile Default</button>
              <button className="cred-button px-4 py-2" onClick={() => {
                const input = (document.getElementById('calTarget') as HTMLInputElement)
                const val = input?.value ? Number(input.value) : NaN
                if (!Number.isFinite(val) || val <= 0) {
                  input?.focus()
                  return
                }
                setUserCalTarget(val)
                setCalPromptOpen(false)
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, icon, bg }: { label: string; value: string; icon: React.ReactNode; bg: string }) {
  return (
    <div className="text-center">
      <div className={`flex items-center justify-center w-12 h-12 ${bg} rounded-2xl mx-auto mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-text-secondary text-sm">{label}</div>
    </div>
  )
}

function Macro({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="flex items-center space-x-2">
      <span className={`text-xs ${color}`}>●</span>
      <span className="text-sm">{value} {label}</span>
    </div>
  )
}

function Progress({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-secondary">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-dark-border rounded">
        <div className={`h-2 ${color} rounded`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}