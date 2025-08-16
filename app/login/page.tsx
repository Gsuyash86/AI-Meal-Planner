"use client"

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await signIn('credentials', { email, password, redirect: true, callbackUrl: '/profile' })
    if (res?.error) setError(res.error)
    setLoading(false)
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Welcome back</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-[rgba(255,255,255,0.03)] p-6 rounded-2xl shadow-cred-soft">
        <label className="label" htmlFor="email">Email</label>
        <input id="email" className="input w-full" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label" htmlFor="password">Password</label>
        <input id="password" className="input w-full" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading} aria-busy={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <div className="my-4 text-center text-text-tertiary text-xs">or</div>
      <button
        className="btn btn-outline w-full"
        onClick={() => signIn('google', { callbackUrl: '/profile' })}
      >
        Continue with Google
      </button>
      <p className="mt-4 text-text-secondary text-sm">
        New here? <Link href="/register" className="underline hover:text-white">Create an account</Link>
      </p>
    </main>
  )
}
