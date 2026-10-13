import { StarRating } from './StarRating'

// Full class names (not built from strings) so Tailwind can find them.
// Spans only start at sm: a 2-column span on a 1-column phone grid
// would add an extra column and cause horizontal scrolling.
const layoutClasses = {
  wide: 'sm:col-span-2',
  tall: 'sm:row-span-2',
  normal: '',
}

export function PhotoCard({ photo, rating, onRate }) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-md bg-surface ${layoutClasses[photo.layout]}`}
    >
      {/* object-cover fills the cell and crops the edges instead of stretching */}
      <img
        src={photo.image}
        alt={photo.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-linear-to-t from-black/80 to-transparent px-4 pt-8 pb-3">
        <span className="text-sm font-semibold">{photo.title}</span>
        <StarRating value={rating} onChange={onRate} label={photo.title} />
      </figcaption>
    </figure>
  )
}
