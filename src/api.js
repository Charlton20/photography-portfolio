// Every call to the server goes through here.
// In development this is '' and Vite forwards /api to the server (vite.config.js).
// On GitHub Pages it's the deployed server's address, set when the site is built.
const API_URL = import.meta.env.VITE_API_URL ?? ''

async function api(path, options = {}) {
  const res = await fetch(API_URL + path, {
    ...options,
    // send the login cookie with every request
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    // our routes send { error }, Better Auth sends { message }
    throw new Error(data?.error ?? data?.message ?? `Request failed (${res.status})`)
  }
  return data
}

// Login (Better Auth routes)
export const getSession = () => api('/api/auth/get-session')
export const signIn = (email, password) =>
  api('/api/auth/sign-in/email', { method: 'POST', body: JSON.stringify({ email, password }) })
export const signUp = (name, email, password) =>
  api('/api/auth/sign-up/email', { method: 'POST', body: JSON.stringify({ name, email, password }) })
export const signOut = () => api('/api/auth/sign-out', { method: 'POST', body: '{}' })

// Shop
export const getPrints = () => api('/api/prints')
// Only the print id is sent. The server looks up the price itself.
export const startCheckout = (printId) =>
  api('/api/checkout', { method: 'POST', body: JSON.stringify({ printId }) })
export const getOrder = (orderId) => api(`/api/orders/${orderId}`)

// 4500 -> "$45.00"
export function formatPrice(cents, currency = 'usd') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100)
}
