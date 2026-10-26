import { useEffect, useState } from 'react'
import { photos } from '../data/photos'
import { getPrints, startCheckout } from '../api'
import { PhotoCard } from './PhotoCard'

const categories = ['All', 'Landscape', 'Portrait', 'Travel']

export function Gallery({ user, onSignInNeeded }) {
  // which category button is selected
  const [filter, setFilter] = useState('All')

  // star rating for each photo, keyed by id, e.g. { 'alpine-ridge': 4 }.
  // Kept here (not in each card) so ratings survive when the filter
  // hides a card and shows it again.
  const [ratings, setRatings] = useState({})

  function handleRate(id, value) {
    // copy the old object and change one key – never edit state directly
    setRatings({ ...ratings, [id]: value })
  }

  // print prices from the server, keyed by photo id, e.g. { 'alpine-ridge': 4500 }.
  // Stays empty if the server can't be reached, which hides the buy buttons.
  const [prices, setPrices] = useState({})
  // id of the photo whose checkout is starting, so its button can say so
  const [buyingId, setBuyingId] = useState(null)
  const [buyError, setBuyError] = useState('')

  useEffect(() => {
    getPrints()
      .then((prints) => setPrices(Object.fromEntries(prints.map((p) => [p.id, p.priceCents]))))
      .catch(() => {})
  }, [])

  async function handleBuy(id) {
    // every order belongs to a user, so ask them to sign in first
    if (!user) {
      onSignInNeeded()
      return
    }

    setBuyingId(id)
    setBuyError('')
    try {
      const { url } = await startCheckout(id)
      // leave the site for Stripe's hosted checkout page
      window.location.assign(url)
    } catch (err) {
      setBuyError(err.message)
      setBuyingId(null)
    }
  }

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

      {buyError && (
        <p role="alert" className="mb-4 rounded-md border border-red-400/40 p-3 text-sm text-red-400">
          Couldn't start checkout: {buyError}
        </p>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {filtered.length} photos
      </p>

      {/* 1 column on phones, 2 from sm, 4 from lg. Every row is 16rem tall.
          grid-flow-row-dense fills gaps left by the wide and tall photos. */}
      <div className="grid auto-rows-[16rem] grid-cols-1 gap-4 sm:grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            rating={ratings[photo.id] ?? 0}
            onRate={(value) => handleRate(photo.id, value)}
            price={prices[photo.id]}
            buying={buyingId === photo.id}
            onBuy={() => handleBuy(photo.id)}
          />
        ))}
      </div>
    </section>
  )
}
