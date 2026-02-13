import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Hanya tampilkan error
  // Untuk GitHub Pages; development lokal tetap di root (/)
  base: process.env.NODE_ENV === 'production' ? '/dr-karmila-foundation/' : '/',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});