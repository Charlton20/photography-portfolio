import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// ---------------------------------------------------------------------------
// Login tables. Better Auth reads and writes these; the column names must
// match what it expects, so don't rename them.
// ---------------------------------------------------------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  // hashed by Better Auth, never the plain password
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// Shop tables
// ---------------------------------------------------------------------------

// One printable photo. The id matches the photo ids in src/data/photos.js.
// Prices are whole cents (4500 = $45.00) so there are no rounding errors.
export const prints = pgTable('prints', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  priceCents: integer('price_cents').notNull(),
})

// An order can only ever be in one of these states
export const orderStatus = pgEnum('order_status', ['pending', 'paid', 'cancelled'])

// One row per purchase. Starts as 'pending' when checkout begins;
// only the Stripe webhook may change it to 'paid'.
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  status: orderStatus('status').notNull().default('pending'),
  totalCents: integer('total_cents').notNull(),
  currency: text('currency').notNull(),
  // filled in once Stripe has created the checkout session
  stripeSessionId: text('stripe_session_id').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  paidAt: timestamp('paid_at'),
})

// What was bought in an order. Title and price are copied in at the time of
// purchase, so changing a print's price later doesn't rewrite old orders.
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  printId: text('print_id')
    .notNull()
    .references(() => prints.id),
  title: text('title').notNull(),
  quantity: integer('quantity').notNull(),
  unitPriceCents: integer('unit_price_cents').notNull(),
})
