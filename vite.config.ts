import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // use '/' if hosted at root, './' if deployed as static files
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
