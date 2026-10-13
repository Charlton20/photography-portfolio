import { photos } from '../data/photos'
import { PhotoCard } from './PhotoCard'

export function Gallery() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-8 font-heading text-3xl font-bold md:text-4xl">Selected Work</h2>

      {/* 1 column on phones, 2 from sm, 4 from lg. Every row is 16rem tall.
          grid-flow-row-dense fills gaps left by the wide and tall photos. */}
      <div className="grid auto-rows-[16rem] grid-cols-1 gap-4 sm:grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-4">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </section>
  )
}
