// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This proxies any request starting with '/api'
      '/api': {
        target: 'http://localhost:5000', // The backend server address
        changeOrigin: true,
      }
    }
  }
})