"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [heightCm, setHeightCm] = useState<number | ''>('')
  const [weightKg, setWeightKg] = useState<number | ''>('')
  const [measurements, setMeasurements] = useState<{ chest?: number, waist?: number, hips?: number, neck?: number, biceps?: number, thighs?: number }>({})
  const [goal, setGoal] = useState<'lose_fat' | 'build_muscle' | 'maintain' | 'recomp' | ''>('')
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const passwordScore = (() => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return Math.min(score, 4)
  })()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          avatarUrl,
          heightCm: heightCm === '' ? undefined : Number(heightCm),
          weightKg: weightKg === '' ? undefined : Number(weightKg),
          bmi: undefined,
          measurements,
          goal: goal || undefined,
          activityLevel: activityLevel || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to register')
      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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
      e.currentTarget.value = ''
    }
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Create your account</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl shadow-cred-soft">
        <label className="label" htmlFor="name">Name</label>
        <input id="name" className="input w-full" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" title="Full name" />
        <label className="label" htmlFor="email">Email</label>
        <input id="email" className="input w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" title="Email address" />
        <label className="label" htmlFor="password">Password</label>
        <input id="password" className="input w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" title="Password" />
        <div className="h-2 w-full bg-dark-muted rounded overflow-hidden" aria-hidden="true">
          <div
            className={`h-full ${passwordScore >= 3 ? 'bg-green-500' : passwordScore === 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${(passwordScore + 1) * 20}%` }}
          />
        </div>
        <p className="text-xs text-text-tertiary">Use at least 8 characters with a mix of letters, numbers, and symbols.</p>
        <label className="label" htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" className="input w-full" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter password" title="Confirm password" />

        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <label className="label" htmlFor="avatar">Profile photo URL (optional)</label>
            <input id="avatar" className="input w-full" placeholder="https://... or /uploads/..." value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
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
            <label className="label" htmlFor="goal">Goal</label>
            <select id="goal" className="input w-full" value={goal} onChange={(e) => setGoal(e.target.value as any)}>
              <option value="">Select...</option>
              <option value="lose_fat">Lose Fat</option>
              <option value="build_muscle">Build Muscle</option>
              <option value="maintain">Maintain</option>
              <option value="recomp">Recomp</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label" htmlFor="activity">Activity Level</label>
            <select id="activity" className="input w-full" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value as any)}>
              <option value="">Select...</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="chest">Chest</label>
            <input id="chest" className="input w-full" type="number" value={measurements.chest ?? ''} onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="cm" />
          </div>
          <div>
            <label className="label" htmlFor="waist">Waist</label>
            <input id="waist" className="input w-full" type="number" value={measurements.waist ?? ''} onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="cm" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label" htmlFor="hips">Hips</label>
            <input id="hips" className="input w-full" type="number" value={measurements.hips ?? ''} onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="cm" />
          </div>
          <div>
            <label className="label" htmlFor="neck">Neck</label>
            <input id="neck" className="input w-full" type="number" value={measurements.neck ?? ''} onChange={(e) => setMeasurements({ ...measurements, neck: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="cm" />
          </div>
          <div>
            <label className="label" htmlFor="biceps">Biceps</label>
            <input id="biceps" className="input w-full" type="number" value={measurements.biceps ?? ''} onChange={(e) => setMeasurements({ ...measurements, biceps: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="cm" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="thighs">Thighs</label>
          <input id="thighs" className="input w-full" type="number" value={measurements.thighs ?? ''} onChange={(e) => setMeasurements({ ...measurements, thighs: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="cm" />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading} aria-busy={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-text-secondary text-sm">
        Already have an account? <Link href="/login" className="underline hover:text-white">Sign in</Link>
      </p>
    </main>
  )
}
