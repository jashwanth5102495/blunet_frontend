import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 5173,
    strictPort: true,
    host: 'localhost',
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kb (default is 500kb)
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'google-oauth': ['@react-oauth/google'],
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});