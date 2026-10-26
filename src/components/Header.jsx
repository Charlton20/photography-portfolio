import { useState } from 'react'

// BASE_URL in front so the links also work from the order page
const home = import.meta.env.BASE_URL
const links = [
  { href: `${home}#work`, label: 'Work' },
  { href: `${home}#about`, label: 'About' },
  { href: `${home}#contact`, label: 'Contact' },
]

export function Header({ user, onSignIn, onSignOut }) {
  // true when the phone menu is open
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href={`${home}#top`} className="font-heading text-xl font-bold text-ink">
          Charlton Mapiye
        </a>

        {/* Desktop links: hidden on phones, a row from md up */}
        <ul className="hidden gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-semibold uppercase tracking-widest text-muted transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-muted sm:inline">Hi, {user.name}</span>
              <button type="button" onClick={onSignOut} className="text-sm font-semibold text-accent hover:underline">
                Sign out
              </button>
            </>
          ) : (
            <button type="button" onClick={onSignIn} className="text-sm font-semibold text-accent hover:underline">
              Sign in
            </button>
          )}

          {/* Hamburger: the three bars turn into an X when open */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`h-0.5 w-6 bg-ink transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-ink transition ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-ink transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Phone menu: only rendered while open */}
      {open && (
        <ul id="mobile-menu" className="flex flex-col border-t border-line px-4 pb-2 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-3 text-sm font-semibold uppercase tracking-widest text-muted hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
