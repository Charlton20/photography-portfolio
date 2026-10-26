import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import { printsRouter } from './routes/prints.js'
import { checkoutRouter } from './routes/checkout.js'
import { ordersRouter } from './routes/orders.js'
import { webhookRouter } from './routes/webhooks.js'

// Fail straight away with a clear message instead of a confusing error later
const required = [
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'CLIENT_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
]
const missing = required.filter((name) => !process.env[name])
if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')} (see .env.example)`)
}

const app = express()

// Let the front end call this server and send its login cookie along
app.use(cors({ origin: new URL(process.env.CLIENT_URL).origin, credentials: true }))

// These two read the raw request body themselves, so they go BEFORE express.json()
app.all('/api/auth/*splat', toNodeHandler(auth))
app.use('/api/webhooks/stripe', webhookRouter)

app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/prints', printsRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/orders', ordersRouter)

// Any error thrown in a route ends up here (Express spots it by the 4
// parameters, so _next has to stay even though it's unused). Log the details,
// but don't send a stack trace to the browser.
app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
