import { Router } from 'express'
import { db } from '../db/index.js'
import { prints } from '../db/schema.js'

export const printsRouter = Router()

// GET /api/prints – public list of prints and prices, for the gallery buttons
printsRouter.get('/', async (req, res) => {
  res.json(await db.select().from(prints))
})
