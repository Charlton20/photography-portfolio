import Stripe from 'stripe'

// This project only ever takes fake payments. Refuse to start with a live
// key so real money can't be charged by mistake.
if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')) {
  throw new Error('STRIPE_SECRET_KEY is a live key – use your test-mode key (sk_test_...)')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Every price in the prints table is in this currency
export const CURRENCY = 'usd'
