import express, { Router } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { orders } from '../db/schema.js'
import { stripe } from '../stripe.js'

export const webhookRouter = Router()

// POST /api/webhooks/stripe – Stripe calls this, not the browser.
// This is the ONLY place an order is marked as paid. The success page just
// reads the status; landing on it doesn't prove anything was paid.
//
// express.raw keeps the body as the exact bytes Stripe sent. The signature
// check fails if the body has been parsed to JSON and back first.
webhookRouter.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  let event
  try {
    // Proves the request really came from Stripe: it's signed with our webhook secret
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    return res.status(400).send(`Webhook signature check failed: ${err.message}`)
  }

  const session = event.data.object

  if (event.type === 'checkout.session.completed' && session.payment_status === 'paid') {
    // Only a pending order whose session and amount match what Stripe charged
    await db
      .update(orders)
      .set({ status: 'paid', paidAt: new Date() })
      .where(
        and(
          eq(orders.id, session.metadata.orderId),
          eq(orders.stripeSessionId, session.id),
          eq(orders.totalCents, session.amount_total),
          eq(orders.status, 'pending'),
        ),
      )
  }

  if (event.type === 'checkout.session.expired') {
    // The user left the Stripe page without paying and the session timed out
    await db
      .update(orders)
      .set({ status: 'cancelled' })
      .where(and(eq(orders.id, session.metadata.orderId), eq(orders.status, 'pending')))
  }

  // Tell Stripe we got it, otherwise it keeps retrying
  res.json({ received: true })
})
