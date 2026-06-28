import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Port configurations for the frontend server
    port: 3000,
    // Proxy configuration. Whenever the frontend calls a path starting with '/api',
    // Vite will forward the request to our backend server on port 5000.
    // This resolves development CORS and matches the production relative path setup.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
