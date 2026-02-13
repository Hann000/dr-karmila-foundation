import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Hanya tampilkan error
  // Vercel: base '/'. GitHub Pages: base '/dr-karmila-foundation/'. Bisa paksa pakai env BASE_PATH
  base: process.env.BASE_PATH || (process.env.VERCEL === '1' || process.env.VERCEL_URL ? '/' : (process.env.NODE_ENV === 'production' ? '/dr-karmila-foundation/' : '/')),
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});