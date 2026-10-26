import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the site from /photography-portfolio/, not the domain root
  base: '/photography-portfolio/',
  server: {
    // In development, send /api requests to the Express server in server/.
    // The browser sees one address, so the login cookie just works.
    proxy: { '/api': 'http://localhost:3000' },
  },
})
