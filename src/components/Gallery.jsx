import { useState } from 'react'
import { photos } from '../data/photos'
import { PhotoCard } from './PhotoCard'

const categories = ['All', 'Landscape', 'Portrait', 'Travel']

export function Gallery() {
  // which category button is selected
  const [filter, setFilter] = useState('All')

  // worked out on every render from the state, not stored separately
  const filtered =
    filter === 'All' ? photos : photos.filter((photo) => photo.category === filter)

  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-3xl font-bold md:text-4xl">Selected Work</h2>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === cat
                  ? 'bg-accent text-bg'
                  : 'border border-line text-muted hover:border-accent hover:text-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {filtered.length} photos
      </p>

      {/* 1 column on phones, 2 from sm, 4 from lg. Every row is 16rem tall.
          grid-flow-row-dense fills gaps left by the wide and tall photos. */}
      <div className="grid auto-rows-[16rem] grid-cols-1 gap-4 sm:grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </section>
  )
}
