# Charlton Mapiye Photography

A single-page photography portfolio built with **React**, **Vite**, and **Tailwind CSS**
(Assignment 2), with print sales through **Stripe Checkout** in test mode (Assignment 4).
The plain HTML/CSS version from Assignment 1 is in the git history.

- `/` (repo root): the React site
- `server/`: the Express API (sign-in, checkout, Stripe webhook, orders)

## Run it

The site on its own, without the shop (the buy buttons stay hidden):

```bash
npm install
npm run dev
```

Then open the local address Vite prints (usually http://localhost:5173/photography-portfolio/).
To run the shop as well, follow **Setting up payments** below.

**Live site:** https://charlton20.github.io/photography-portfolio/ — rebuilt and published
automatically by GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`.

## Project structure

```
src/
  main.jsx              Mounts <App /> into index.html
  App.jsx               Puts the page together; holds the signed-in user
  api.js                Every fetch to the server in one place
  index.css             Tailwind import + my theme colors and fonts (@theme)
  data/photos.js        All 12 photos as one array of objects
  components/
    Header.jsx          Sticky nav + hamburger menu (useState)
    Hero.jsx            Background photo, h1, call to action
    Gallery.jsx         Category filter + ratings state (useState), photo grid
    PhotoCard.jsx       One photo in the grid
    StarRating.jsx      Controlled component reused on every photo
    About.jsx           Short about section
    Contact.jsx         Book-a-shoot form
    Footer.jsx          Link columns built from an array
    AuthDialog.jsx      Sign in / create account pop-up
    OrderStatus.jsx     Page Stripe returns to; shows the order and rechecks while pending

server/
  src/index.js          Express app: middleware order and routes
  src/auth.js           Better Auth (email + password sign-in)
  src/stripe.js         Stripe client, refuses live keys
  src/db/schema.js      All tables
  src/db/seed.js        Fills the prints table from src/data/photos.js
  src/middleware/requireAuth.js
  src/routes/           prints, checkout, webhooks, orders
```

## Assignment 2 checklist

| Requirement | Where |
| --- | --- |
| Vite + React in the existing repo | `package.json`, `vite.config.js`, `src/main.jsx` |
| Componentized | Header, Hero, Gallery (main content), About, Contact, Footer |
| Items in one data file | `src/data/photos.js`, rendered with `.map()` |
| Tailwind wired in, old CSS removed | `@tailwindcss/vite` plugin, `src/index.css`; `css/style.css` deleted |
| Real filter with useState | `Gallery.jsx`: `filter` state + `.filter()` by category |
| Reusable controlled component | `StarRating.jsx`: takes `value` + `onChange`, used on all 12 cards |
| Mobile-first responsive classes | e.g. `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| No horizontal scroll | Tested at 360px, 768px, and 1440px |

## Payments with Stripe (Assignment 4)

### How a purchase works

```
 Browser                      Express server (server/)              Stripe
 ───────                      ────────────────────────              ──────
 1. Click "Buy print"  ──►  POST /api/checkout
                             requireAuth: signed in? (else 401)
                             look up the price in the prints table
                             insert orders (pending) + order_items
                             create Checkout Session  ─────────────►
 2. Redirect to Stripe ◄──  { url }
 3. Pay with 4242 4242 4242 4242  ─────────────────────────────────►
                                                    payment succeeds
                             POST /api/webhooks/stripe  ◄────────────  4. webhook
                             check Stripe's signature
                             order pending -> paid
 5. Back to ?order=<id> ◄──────────────────────────────────────────── redirect
    GET /api/orders/<id>     (asks up to 5 times, 2s apart,
    shows "paid"              in case the webhook is slower than the redirect)
```

Three rules hold it together:

- **The browser never sends a price.** It sends only the print id; `server/src/routes/checkout.js` reads
  the price from the database.
- **Only the webhook marks an order paid.** `server/src/routes/webhooks.js` checks that the request is
  signed by Stripe, and only updates an order that is still `pending` and whose session id and amount match.
  Landing on the success page proves nothing, so the page only reads the status.
- **Every order belongs to a user.** `server/src/middleware/requireAuth.js` returns 401 to anyone who isn't
  signed in, and `GET /api/orders/:id` only returns your own orders.

### Database tables (`server/src/db/schema.js`)

| Table | What it holds |
| --- | --- |
| `prints` | One row per photo: id, title, `price_cents`. Filled by `npm run db:seed` from `src/data/photos.js` |
| `orders` | One row per purchase: `user_id`, `status` (`pending` / `paid` / `cancelled`), `total_cents`, `currency`, `stripe_session_id`, `created_at`, `paid_at` |
| `order_items` | What was bought: `order_id`, `print_id`, and `title`, `quantity`, `unit_price_cents` copied in at purchase time, so a later price change doesn't rewrite old orders |
| `user`, `session`, `account`, `verification` | Sign-in tables used by Better Auth |

Prices are whole cents (`4500` = $45.00) to avoid rounding errors.

### Setting up payments

You need Node 20.12+, a free [Neon](https://neon.tech) Postgres database, a free
[Stripe](https://dashboard.stripe.com/register) account, and the
[Stripe CLI](https://docs.stripe.com/stripe-cli).

1. **Configure the server**

   ```bash
   cd server
   npm install
   cp .env.example .env
   ```

   Fill in `.env`:
   - `DATABASE_URL`: Neon dashboard > Connect.
   - `BETTER_AUTH_SECRET`: the output of `openssl rand -base64 32`.
   - `STRIPE_SECRET_KEY`: Stripe dashboard with **Test mode** on > Developers > API keys > Secret key.
     It starts with `sk_test_`. The server refuses to start with a live key.

2. **Create the tables and add the prints**

   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Forward Stripe's webhooks to your machine** (in a second terminal)

   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Copy the `whsec_...` secret it prints into `STRIPE_WEBHOOK_SECRET` in `.env`.

4. **Start the server, then the site** (third terminal for the site)

   ```bash
   npm run dev          # in server/, http://localhost:3000
   npm run dev          # in the repo root, http://localhost:5173/photography-portfolio/
   ```

   Vite forwards `/api` to the server (`vite.config.js`), so locally everything is on one address.

5. **Try it:** Sign in > create an account > Buy print > pay with `4242 4242 4242 4242`, any future
   date, and any CVC > you land back on the order page, which shows **Paid**. The `stripe listen` terminal
   shows `checkout.session.completed` arriving with a `200`.

### Deploying the server

GitHub Pages only serves static files, so the server runs on [Render](https://render.com) (free plan):

1. New > Web Service > this repo. **Root directory:** `server`. **Build command:** `npm ci`.
   **Start command:** `npm start`.
2. Environment variables: the same as `.env`, except:
   - `BETTER_AUTH_URL` is the Render address, e.g. `https://photography-portfolio-api.onrender.com`.
   - `CLIENT_URL` is `https://charlton20.github.io/photography-portfolio/`.
   - Add `NODE_ENV=production`. It makes the login cookie work across the two domains.
3. Stripe dashboard (Test mode) > Developers > Webhooks > Add endpoint:
   `https://<render address>/api/webhooks/stripe`, with the events `checkout.session.completed` and
   `checkout.session.expired`. Put its signing secret in Render's `STRIPE_WEBHOOK_SECRET`. It's a
   different secret from the `stripe listen` one.
4. GitHub repo > Settings > Secrets and variables > Actions > **Variables** > `VITE_API_URL` = the Render
   address. The next push to `main` rebuilds the site pointing at it.

The site and the server are on different domains, so the login cookie is a cross-site cookie. Chrome
allows it. Safari blocks it by default, so demo in Chrome. Render's free plan sleeps when idle; open
`<render address>/api/health` a minute before demoing to wake it.

### Assignment 4 checklist

| Requirement | Where |
| --- | --- |
| `orders` and `orderItems` tables | `server/src/db/schema.js`, created with `npm run db:push` |
| Stripe secret key in the server's `.env` | `server/.env` (not committed), template in `server/.env.example` |
| Login check blocks checkout | `server/src/middleware/requireAuth.js`, used in `checkout.js` and `orders.js` |
| Checkout route uses the database price | `server/src/routes/checkout.js` |
| Webhook is the only thing that marks orders paid | `server/src/routes/webhooks.js` |
| Buy button sends you to Stripe | `src/components/PhotoCard.jsx` > `Gallery.jsx` `handleBuy` |
| Order lookup + success page that rechecks | `server/src/routes/orders.js`, `src/components/OrderStatus.jsx` |
| Works in production | **Deploying the server** above |

## Credits

Placeholder photos from [Lorem Picsum](https://picsum.photos) (Unsplash photographers).
Fonts: Playfair Display and Inter from Google Fonts.
