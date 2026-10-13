const heroImage = 'https://picsum.photos/id/10/1600/900'

export function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-[80vh] items-center justify-center bg-cover bg-center px-4 py-16 text-center"
      // dark gradient on top of the photo keeps the text readable
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), var(--color-bg)), url(${heroImage})`,
      }}
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Landscape &middot; Portrait &middot; Travel
        </p>
        <h1 className="my-4 font-heading text-4xl leading-tight font-bold sm:text-5xl lg:text-7xl">
          Charlton Mapiye Photography
        </h1>
        <p className="mb-8 text-lg text-muted">
          Capturing quiet light, wild places, and honest faces.
        </p>
        <a
          href="#work"
          className="inline-block rounded-md bg-accent px-7 py-3.5 font-semibold text-bg transition-colors hover:bg-accent-hover"
        >
          View my work
        </a>
      </div>
    </section>
  )
}
