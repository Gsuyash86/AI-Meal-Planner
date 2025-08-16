"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'

interface Measurements {
  chest?: number
  waist?: number
  hips?: number
  neck?: number
  biceps?: number
  thighs?: number
}

export default function ProfilePage() {
  const { status } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isEdit, setIsEdit] = useState(true)
  const [initialProfile, setInitialProfile] = useState<{
    name: string
    avatarUrl: string
    heightCm: number | ''
    weightKg: number | ''
    measurements: Measurements
    goal: 'lose_fat' | 'build_muscle' | 'maintain' | 'recomp' | ''
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | ''
  }>({ name: '', avatarUrl: '', heightCm: '', weightKg: '', measurements: {}, goal: '', activityLevel: '' })

  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [heightCm, setHeightCm] = useState<number | ''>('')
  const [weightKg, setWeightKg] = useState<number | ''>('')
  const [measurements, setMeasurements] = useState<Measurements>({})
  const [goal, setGoal] = useState<'lose_fat' | 'build_muscle' | 'maintain' | 'recomp' | ''>('')
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | ''>('')

  const handleCancel = () => {
    setName(initialProfile.name)
    setAvatarUrl(initialProfile.avatarUrl)
    setHeightCm(initialProfile.heightCm)
    setWeightKg(initialProfile.weightKg)
    setMeasurements(initialProfile.measurements)
    setGoal(initialProfile.goal)
    setActivityLevel(initialProfile.activityLevel)
    setIsEdit(false)
  }

  const onAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const file = input.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed')
      }
      const data = await res.json()
      if (data?.url) setAvatarUrl(data.url)
    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      // clear file input value so same file can be re-selected if needed
      if (input) input.value = ''
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(undefined, { callbackUrl: '/profile' })
    }
  }, [status])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          const loadedName = data.name || ''
          const loadedAvatar = data.avatarUrl || ''
          const loadedHeight = typeof data.heightCm === 'number' ? data.heightCm : ''
          const loadedWeight = typeof data.weightKg === 'number' ? data.weightKg : ''
          const loadedMeasurements = data.measurements || {}
          const loadedGoal = data.goal || ''
          const loadedActivity = data.activityLevel || ''
          setName(loadedName)
          setAvatarUrl(loadedAvatar)
          setHeightCm(loadedHeight)
          setWeightKg(loadedWeight)
          setMeasurements(loadedMeasurements)
          setGoal(loadedGoal)
          setActivityLevel(loadedActivity)
          setInitialProfile({
            name: loadedName,
            avatarUrl: loadedAvatar,
            heightCm: loadedHeight,
            weightKg: loadedWeight,
            measurements: loadedMeasurements,
            goal: loadedGoal,
            activityLevel: loadedActivity,
          })
          const hasCore = !!(data.heightCm || data.weightKg || data.goal || data.activityLevel)
          setIsEdit(!hasCore) // if core data present, default to view mode
        }
      } catch (_) {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    if (status === 'authenticated') load()
  }, [status])

  const bmi = useMemo(() => {
    if (typeof heightCm !== 'number' || typeof weightKg !== 'number' || heightCm <= 0) return ''
    const h = heightCm / 100
    return Number((weightKg / (h * h)).toFixed(1))
  }, [heightCm, weightKg])

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          avatarUrl: avatarUrl || undefined,
          heightCm: heightCm === '' ? undefined : Number(heightCm),
          weightKg: weightKg === '' ? undefined : Number(weightKg),
          bmi: typeof bmi === 'number' ? bmi : undefined,
          measurements,
          goal: goal || undefined,
          activityLevel: activityLevel || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save profile')
      }
      const saved = await res.json()
      const sName = saved.name || ''
      const sAvatar = saved.avatarUrl || ''
      const sHeight = typeof saved.heightCm === 'number' ? saved.heightCm : ''
      const sWeight = typeof saved.weightKg === 'number' ? saved.weightKg : ''
      const sMeasurements = saved.measurements || {}
      const sGoal = saved.goal || ''
      const sActivity = saved.activityLevel || ''
      setName(sName)
      setAvatarUrl(sAvatar)
      setHeightCm(sHeight)
      setWeightKg(sWeight)
      setMeasurements(sMeasurements)
      setGoal(sGoal)
      setActivityLevel(sActivity)
      setInitialProfile({
        name: sName,
        avatarUrl: sAvatar,
        heightCm: sHeight,
        weightKg: sWeight,
        measurements: sMeasurements,
        goal: sGoal,
        activityLevel: sActivity,
      })
      setIsEdit(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-10">
        <div className="skeleton h-24 rounded-xl" />
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">{isEdit ? 'Edit your profile' : 'Your profile'}</h1>
        <div className="flex gap-2">
          {!isEdit && (
            <button className="btn btn-primary" onClick={() => setIsEdit(true)} type="button">Edit Profile</button>
          )}
          {!isEdit && (
            <button className="btn btn-ghost" type="button" onClick={() => router.push('/')}>Home</button>
          )}
          {isEdit && (
            <button className="btn btn-ghost" type="button" onClick={handleCancel}>Cancel</button>
          )}
        </div>
      </div>

      {!isEdit && (
        <section className="space-y-4 bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl shadow-cred-soft">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-card border border-dark-border">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={`${name || 'User'} avatar`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">No photo</div>
              )}
            </div>
            <div>
              <p className="text-text-tertiary text-xs">Profile Photo</p>
              <p className="text-sm break-all text-text-secondary">{avatarUrl || '-'}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-text-tertiary text-xs">Name</p>
              <p className="text-lg">{name || '-'}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-xs">Goal</p>
              <p className="text-lg capitalize">{goal?.replace('_', ' ') || '-'}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-xs">Height (cm)</p>
              <p className="text-lg">{heightCm || '-'}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-xs">Weight (kg)</p>
              <p className="text-lg">{weightKg || '-'}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-xs">BMI</p>
              <p className="text-lg">{bmi || '-'}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-xs">Activity level</p>
              <p className="text-lg capitalize">{activityLevel?.replace('_', ' ') || '-'}</p>
            </div>
          </div>
          <div>
            <p className="text-text-tertiary text-xs mb-1">Measurements (cm)</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-dark-card border border-dark-border rounded-xl p-3">
                <p className="text-xs text-text-tertiary">Chest</p>
                <p>{measurements.chest ?? '-'}</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-3">
                <p className="text-xs text-text-tertiary">Waist</p>
                <p>{measurements.waist ?? '-'}</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-3">
                <p className="text-xs text-text-tertiary">Hips</p>
                <p>{measurements.hips ?? '-'}</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-3">
                <p className="text-xs text-text-tertiary">Neck</p>
                <p>{measurements.neck ?? '-'}</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-3">
                <p className="text-xs text-text-tertiary">Biceps</p>
                <p>{measurements.biceps ?? '-'}</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-3">
                <p className="text-xs text-text-tertiary">Thighs</p>
                <p>{measurements.thighs ?? '-'}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {isEdit && (
      <form onSubmit={onSave} className="space-y-5 bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl shadow-cred-soft">
        <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label className="label" htmlFor="avatar">Profile photo URL</label>
            <input id="avatar" className="input w-full" placeholder="https://..." value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            <div className="mt-2 flex items-center gap-3">
              <label className="btn btn-secondary" htmlFor="avatarFile">
                <input id="avatarFile" type="file" accept="image/*" className="hidden" onChange={onAvatarFileChange} />
                {uploading ? 'Uploading…' : 'Upload from device'}
              </label>
              {uploadError && <span className="text-red-400 text-xs">{uploadError}</span>}
            </div>
          </div>
          <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-card border border-dark-border justify-self-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">No photo</div>
            )}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" className="input w-full" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label" htmlFor="height">Height (cm)</label>
            <input id="height" className="input w-full" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 175" />
          </div>
          <div>
            <label className="label" htmlFor="weight">Weight (kg)</label>
            <input id="weight" className="input w-full" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 70" />
          </div>
          <div>
            <label className="label" htmlFor="bmi">BMI</label>
            <input id="bmi" className="input w-full" value={bmi} readOnly placeholder="Auto-calculated" title="Body Mass Index" />
          </div>
        </div>

        <fieldset className="grid sm:grid-cols-3 gap-3">
          <legend className="label mb-2">Measurements (cm)</legend>
          <input className="input" placeholder="Chest" type="number" value={measurements.chest ?? ''} onChange={(e) => setMeasurements((m) => ({ ...m, chest: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="input" placeholder="Waist" type="number" value={measurements.waist ?? ''} onChange={(e) => setMeasurements((m) => ({ ...m, waist: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="input" placeholder="Hips" type="number" value={measurements.hips ?? ''} onChange={(e) => setMeasurements((m) => ({ ...m, hips: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="input" placeholder="Neck" type="number" value={measurements.neck ?? ''} onChange={(e) => setMeasurements((m) => ({ ...m, neck: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="input" placeholder="Biceps" type="number" value={measurements.biceps ?? ''} onChange={(e) => setMeasurements((m) => ({ ...m, biceps: e.target.value === '' ? undefined : Number(e.target.value) }))} />
          <input className="input" placeholder="Thighs" type="number" value={measurements.thighs ?? ''} onChange={(e) => setMeasurements((m) => ({ ...m, thighs: e.target.value === '' ? undefined : Number(e.target.value) }))} />
        </fieldset>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="goal">Goal</label>
            <select id="goal" className="input w-full" value={goal} onChange={(e) => setGoal(e.target.value as any)}>
              <option value="">Select goal</option>
              <option value="lose_fat">Lose fat</option>
              <option value="build_muscle">Build muscle</option>
              <option value="maintain">Maintain</option>
              <option value="recomp">Recomp</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="activity">Activity level</label>
            <select id="activity" className="input w-full" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value as any)}>
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button className="btn btn-primary" disabled={saving} aria-busy={saving}>
            {saving ? 'Saving...' : 'Save & Continue'}
          </button>
          <button type="button" className="btn" onClick={handleCancel}>Cancel</button>
          <button type="button" className="btn btn-ghost" onClick={() => router.push('/')}>Skip for now</button>
        </div>
      </form>
      )}
    </main>
  )
}
