import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/go/', // Deploy under /go path
  server: {
    port: 5175
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
