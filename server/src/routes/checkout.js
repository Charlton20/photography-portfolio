import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { orderItems, orders, prints } from '../db/schema.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { CURRENCY, stripe } from '../stripe.js'

export const checkoutRouter = Router()

// POST /api/checkout   body: { printId: 'alpine-ridge', quantity: 1 }
// Creates a pending order and sends back the Stripe checkout page URL.
checkoutRouter.post('/', requireAuth, async (req, res) => {
  const { printId, quantity = 1 } = req.body ?? {}

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return res.status(400).json({ error: 'Quantity must be a whole number from 1 to 10' })
  }

  // The browser only tells us WHICH print. The price always comes from the
  // database, so nobody can change it in dev tools and pay $0.01.
  const [print] = await db.select().from(prints).where(eq(prints.id, printId ?? ''))
  if (!print) {
    return res.status(404).json({ error: 'Print not found' })
  }

  // Save the order and its item together: either both rows are written or neither is
  const order = await db.transaction(async (tx) => {
    const [newOrder] = await tx
      .insert(orders)
      .values({
        userId: req.user.id,
        totalCents: print.priceCents * quantity,
        currency: CURRENCY,
      })
      .returning()

    await tx.insert(orderItems).values({
      orderId: newOrder.id,
      printId: print.id,
      title: print.title,
      quantity,
      unitPriceCents: print.priceCents,
    })

    return newOrder
  })

  // Where Stripe sends the user back to, e.g. .../photography-portfolio/?order=<id>
  const successUrl = new URL(process.env.CLIENT_URL)
  successUrl.searchParams.set('order', order.id)
  const cancelUrl = new URL('#work', process.env.CLIENT_URL)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity,
        price_data: {
          currency: CURRENCY,
          unit_amount: print.priceCents,
          product_data: { name: `${print.title} – fine art print` },
        },
      },
    ],
    customer_email: req.user.email,
    // the webhook uses this to find which order was paid
    metadata: { orderId: order.id },
    success_url: successUrl.href,
    cancel_url: cancelUrl.href,
  })

  await db.update(orders).set({ stripeSessionId: session.id }).where(eq(orders.id, order.id))

  res.json({ url: session.url })
})
