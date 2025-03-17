import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// --host
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
})
