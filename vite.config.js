import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://<user>.github.io/8-bit-football/ — assets must resolve
// against that subpath, otherwise Pages returns a blank page.
export default defineConfig({
  base: '/8-bit-football/',
  plugins: [react()],
  build: { outDir: 'dist', assetsDir: 'assets' },
})
