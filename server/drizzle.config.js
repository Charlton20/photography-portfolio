import { defineConfig } from 'drizzle-kit'

// `npm run db:push` reads this and makes the database match src/db/schema.js
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.js',
  dbCredentials: { url: process.env.DATABASE_URL },
})
