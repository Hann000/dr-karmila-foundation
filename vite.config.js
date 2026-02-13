import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Hanya tampilkan error
  // Vercel set VERCEL=1 → base '/'. GitHub Pages → base '/dr-karmila-foundation/'. Dev → '/'
  base: process.env.VERCEL ? '/' : (process.env.NODE_ENV === 'production' ? '/dr-karmila-foundation/' : '/'),
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});