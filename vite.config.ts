import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages hosts project sites below the repository name.
  // Local development continues to use the root URL.
  base:
    process.env.GITHUB_ACTIONS === "true" ? "/working-hours-calculator/" : "/",
  plugins: [react()],
})
