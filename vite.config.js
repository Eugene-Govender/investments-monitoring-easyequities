import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './', // relative base so assets load perfectly on GitHub Pages, Vercel, or file preview
  server: {
    port: 5173,
    open: false,
    host: true
  }
});
