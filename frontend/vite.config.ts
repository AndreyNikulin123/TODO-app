import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },

  test: {
    globals: true, // Глобальные describe, it, expect
    environment: 'jsdom', // Симуляция браузера
    setupFiles: ['./src/tests/setup.ts'], // Файл настройки
  },

  build: {
    target: 'es2020',
    minify: 'esbuild',
    chunkSizeWarningLimit: 500,
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }

            if (id.includes('react-router')) {
              return 'router-vendor';
            }

            return 'vendor';
          }
        },

        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
