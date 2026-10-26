import { useEffect, useState } from 'react'
import { formatPrice, getOrder } from '../api'

// How many times to ask the server, and how long to wait between asks
const MAX_CHECKS = 5
const CHECK_EVERY_MS = 2000

// The page Stripe sends people back to after paying.
// It only READS the order. The webhook is what marks it as paid, and that
// can arrive a second or two after Stripe redirects here, so if the order
// is still pending we ask again a few times.
export function OrderStatus({ orderId }) {
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  // true once we've stopped checking
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    let stopped = false
    let timer

    async function check(attempt) {
      try {
        const data = await getOrder(orderId)
        if (stopped) return
        setOrder(data)

        if (data.status === 'pending' && attempt < MAX_CHECKS) {
          timer = setTimeout(() => check(attempt + 1), CHECK_EVERY_MS)
        } else {
          setFinished(true)
        }
      } catch (err) {
        if (!stopped) setError(err.message)
      }
    }

    check(1)

    // stop checking if the page goes away
    return () => {
      stopped = true
      clearTimeout(timer)
    }
  }, [orderId])

  return (
    <section className="mx-auto max-w-2xl px-4 py-24">
      {error && (
        <>
          <h1 className="mb-4 font-heading text-3xl font-bold">We couldn't load your order</h1>
          <p className="text-muted">{error}</p>
        </>
      )}

      {!error && !order && <p className="text-muted">Loading your order…</p>}

      {order && (
        <>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Order {order.id.slice(0, 8)}
          </p>
          <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
            {order.status === 'paid' && 'Thank you – your payment went through'}
            {order.status === 'pending' && !finished && 'Confirming your payment…'}
            {order.status === 'pending' && finished && 'Your payment is still processing'}
            {order.status === 'cancelled' && 'This order was cancelled'}
          </h1>

          <p className="mb-8 text-muted" aria-live="polite">
            {order.status === 'paid' && `Paid on ${new Date(order.paidAt).toLocaleString()}. I'll be in touch about delivery.`}
            {order.status === 'pending' && !finished && 'This usually takes a few seconds.'}
            {order.status === 'pending' && finished && "Stripe hasn't confirmed it yet. Refresh this page in a minute."}
            {order.status === 'cancelled' && 'No payment was taken.'}
          </p>

          <div className="rounded-md border border-line bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Order summary</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                  order.status === 'paid' ? 'bg-accent text-bg' : 'border border-line text-muted'
                }`}
              >
                {order.status}
              </span>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-3">
                  <span>
                    {item.title} print{item.quantity > 1 && ` × ${item.quantity}`}
                  </span>
                  <span>{formatPrice(item.unitPriceCents * item.quantity, order.currency)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.totalCents, order.currency)}</span>
            </p>
          </div>
        </>
      )}

      <a
        href={import.meta.env.BASE_URL}
        className="mt-8 inline-block rounded-md bg-accent px-7 py-3.5 font-semibold text-bg transition-colors hover:bg-accent-hover"
      >
        Back to the gallery
      </a>
    </section>
  )
}
