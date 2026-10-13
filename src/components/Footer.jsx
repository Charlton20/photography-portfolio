const columns = [
  {
    heading: 'Explore',
    links: [
      { href: '#work', label: 'Work' },
      { href: '#about', label: 'About' },
      { href: '#contact', label: 'Book a shoot' },
    ],
  },
  {
    heading: 'Contact',
    links: [{ href: 'mailto:charltonmapiye18@gmail.com', label: 'charltonmapiye18@gmail.com' }],
    note: 'Available for travel',
  },
  {
    heading: 'Follow',
    links: [
      { href: 'https://www.instagram.com/', label: 'Instagram', external: true },
      { href: 'https://github.com/Charlton20', label: 'GitHub', external: true },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface text-sm text-muted">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-8">
        {/* 1 column on phones, 2 from sm, 4 from lg */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#top" className="font-heading text-xl font-bold text-ink">
              Charlton Mapiye
            </a>
            <p className="mt-2">Landscape, portrait, and travel photography.</p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink">
                {col.heading}
              </h2>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      // only open outside sites in a new tab
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="break-all transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {col.note && <li>{col.note}</li>}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-line pt-8">
          <p>&copy; {year} Charlton Mapiye. All photos used for demo purposes.</p>
          <a href="#top" className="text-accent hover:text-accent-hover">
            Back to top &uarr;
          </a>
        </div>
      </div>
    </footer>
  )
}
