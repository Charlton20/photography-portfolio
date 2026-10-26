import { Router } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { orderItems, orders } from '../db/schema.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const ordersRouter = Router()

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET /api/orders/:id – one order and its items, for the success page
ordersRouter.get('/:id', requireAuth, async (req, res) => {
  if (!UUID.test(req.params.id)) {
    return res.status(404).json({ error: 'Order not found' })
  }

  // Matching on userId too means you can only see your own orders
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, req.params.id), eq(orders.userId, req.user.id)))

  if (!order) {
    return res.status(404).json({ error: 'Order not found' })
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))

  res.json({ ...order, items })
})
