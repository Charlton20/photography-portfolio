import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema.js'

// One shared connection pool for the whole server
export const db = drizzle(process.env.DATABASE_URL, { schema })
