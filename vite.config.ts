import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), cloudflare()],
  base: process.env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5176,
    strictPort: false,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
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
          'ogl': ['ogl'],
        }
      }
    }
  },
  esbuild: mode === 'production'
    ? { drop: ['console', 'debugger'] }
    : {},
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));