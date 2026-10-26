import { useState } from 'react'
import { signIn, signUp } from '../api'

const inputClasses =
  'w-full rounded-md border border-line bg-bg p-3 text-ink focus:outline-2 focus:outline-accent'

// Pop-up form for signing in or creating an account
export function AuthDialog({ onClose, onSignedIn }) {
  // 'sign-in' or 'sign-up'
  const [mode, setMode] = useState('sign-in')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const isSignUp = mode === 'sign-up'

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.target)
    setBusy(true)
    setError('')

    try {
      const data = isSignUp
        ? await signUp(form.get('name'), form.get('email'), form.get('password'))
        : await signIn(form.get('email'), form.get('password'))
      onSignedIn(data.user)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    // Dark backdrop: clicking it or pressing Escape closes the dialog
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        // stop clicks inside the box from reaching the backdrop
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-md border border-line bg-surface p-6"
      >
        <h2 id="auth-title" className="mb-1 font-heading text-2xl font-bold">
          {isSignUp ? 'Create an account' : 'Sign in'}
        </h2>
        <p className="mb-6 text-sm text-muted">You need an account to buy a print.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-name" className="text-sm font-semibold">Name</label>
              <input id="auth-name" name="name" autoComplete="name" required className={inputClasses} />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-email" className="text-sm font-semibold">Email</label>
            <input id="auth-email" name="email" type="email" autoComplete="email" required autoFocus className={inputClasses} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className="text-sm font-semibold">Password</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={8}
              required
              className={inputClasses}
            />
          </div>

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-accent px-7 py-3 font-semibold text-bg transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {busy ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <button
            type="button"
            onClick={() => {
              setMode(isSignUp ? 'sign-in' : 'sign-up')
              setError('')
            }}
            className="text-accent hover:underline"
          >
            {isSignUp ? 'I already have an account' : 'Create an account'}
          </button>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
