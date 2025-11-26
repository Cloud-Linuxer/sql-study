import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['sql.js']
  },
  server: {
    host: true,
    allowedHosts: [
      'holes-earning-falling-inputs.trycloudflare.com',
      'proceeding-riders-chose-til.trycloudflare.com',
      '.trycloudflare.com'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});
