// Controlled component: it doesn't store the rating itself.
// The parent passes the current `value` in, and the component
// calls `onChange` with the new value when a star is clicked.
export function StarRating({ value, onChange, label, max = 5 }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1) // [1, 2, 3, 4, 5]

  return (
    <div className="flex" role="group" aria-label={`Rate ${label}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          // clicking the current rating again clears it back to 0
          onClick={() => onChange(star === value ? 0 : star)}
          aria-label={`${star} out of ${max} stars`}
          aria-pressed={star === value}
          className={`p-0.5 text-lg leading-none transition-colors ${
            star <= value ? 'text-accent' : 'text-white/40 hover:text-accent-hover'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
