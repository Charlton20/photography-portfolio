import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/index.js'
import * as schema from './db/schema.js'

// The site lives on GitHub Pages and the server somewhere else, so in
// production the login cookie has to be allowed on cross-site requests.
const isProduction = process.env.NODE_ENV === 'production'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: { enabled: true },
  // only the front end is allowed to call the auth routes
  trustedOrigins: [new URL(process.env.CLIENT_URL).origin],
  advanced: isProduction
    ? { defaultCookieAttributes: { sameSite: 'none', secure: true } }
    : {},
})
