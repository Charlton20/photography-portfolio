# Charlton Mapiye Photography

A single-page photography portfolio, rebuilt with **React**, **Vite**, and **Tailwind CSS**
(Assignment 2). The plain HTML/CSS version from Assignment 1 is in the git history.

## Run it

```bash
npm install
npm run dev
```

Then open the local address Vite prints (usually http://localhost:5173/photography-portfolio/).

**Live site:** https://charlton20.github.io/photography-portfolio/ — rebuilt and published
automatically by GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`.

## Project structure

```
src/
  main.jsx              Mounts <App /> into index.html
  App.jsx               Puts the page together from components
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
```

## Requirements checklist

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

## Credits

Placeholder photos from [Lorem Picsum](https://picsum.photos) (Unsplash photographers).
Fonts: Playfair Display and Inter from Google Fonts.
