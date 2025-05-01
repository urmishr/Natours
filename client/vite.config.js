import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Allows access from the network
    port: 3000,
    allowedHosts: [
      '0149-116-74-93-138.ngrok-free.app',
      'certainly-intimate-terrier.ngrok-free.app',
    ], // You can specify any port you want
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/img': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
