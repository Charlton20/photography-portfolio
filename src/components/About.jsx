export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16">
      {/* Phone: photo above text. md and up: side by side */}
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <img
          src="https://picsum.photos/id/91/600/700"
          alt="Photographer holding a vintage twin-lens camera"
          loading="lazy"
          className="aspect-[6/7] w-full max-w-sm rounded-md object-cover md:w-2/5 md:flex-none"
        />
        <div className="md:flex-1">
          <h2 className="mb-8 font-heading text-3xl font-bold md:text-4xl">About Me</h2>
          <p className="mb-4 text-muted">
            I'm Charlton, a photographer who loves early mornings, big landscapes, and
            natural-light portraits. I keep my edits simple so every photo feels true to the
            moment.
          </p>
          <p className="text-muted">Available for portraits, events, and travel commissions.</p>
        </div>
      </div>
    </section>
  )
}
