import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// React + Tailwind v4 SPA. The /api folder is handled by Vercel's serverless
// runtime in production; in local dev we point the proxy below at `vercel dev`
// (run separately) so the front-end can POST to /api/generate.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
