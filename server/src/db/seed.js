// Puts one print per gallery photo into the prints table.
// Safe to run again: existing prints get their title and price updated.
import { db } from './index.js'
import { prints } from './schema.js'
import { photos } from '../../../src/data/photos.js'

// Wide panoramas are printed bigger, so they cost more
const priceFor = (photo) => (photo.layout === 'wide' ? 6500 : 4500)

for (const photo of photos) {
  const row = { id: photo.id, title: photo.title, priceCents: priceFor(photo) }
  await db
    .insert(prints)
    .values(row)
    .onConflictDoUpdate({ target: prints.id, set: { title: row.title, priceCents: row.priceCents } })
}

console.log(`Seeded ${photos.length} prints`)
await db.$client.end()
