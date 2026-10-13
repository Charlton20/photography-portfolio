// Shared classes for every input, so they aren't repeated five times
const inputClasses =
  'w-full rounded-md border border-line bg-bg p-3 text-ink [color-scheme:dark] focus:outline-2 focus:outline-accent'

// Each field starts at 14rem and grows; two fit side by side on wider screens
const fieldClasses = 'flex flex-[1_1_14rem] flex-col gap-1.5'

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">Book a Shoot</h2>
      <p className="mb-8 text-muted">
        Tell me what you have in mind and I'll get back to you within two days.
      </p>

      <form
        action="mailto:charltonmapiye18@gmail.com"
        method="post"
        encType="text/plain"
        className="flex max-w-3xl flex-col gap-4 rounded-md border border-line bg-surface p-6 md:p-8"
      >
        <div className="flex flex-wrap gap-4">
          <div className={fieldClasses}>
            <label htmlFor="name" className="text-sm font-semibold">Name</label>
            <input type="text" id="name" name="name" autoComplete="name" required className={inputClasses} />
          </div>
          <div className={fieldClasses}>
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input type="email" id="email" name="email" autoComplete="email" required className={inputClasses} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className={fieldClasses}>
            <label htmlFor="shoot-type" className="text-sm font-semibold">Type of shoot</label>
            <select id="shoot-type" name="shoot-type" className={inputClasses}>
              <option>Portrait</option>
              <option>Event</option>
              <option>Landscape / travel</option>
              <option>Other</option>
            </select>
          </div>
          <div className={fieldClasses}>
            <label htmlFor="date" className="text-sm font-semibold">Preferred date</label>
            <input type="date" id="date" name="date" className={inputClasses} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-semibold">Message</label>
          <textarea id="message" name="message" rows="5" required className={`${inputClasses} resize-y`} />
        </div>

        <button
          type="submit"
          className="self-start rounded-md bg-accent px-7 py-3.5 font-semibold text-bg transition-colors hover:bg-accent-hover"
        >
          Send request
        </button>
      </form>
    </section>
  )
}
