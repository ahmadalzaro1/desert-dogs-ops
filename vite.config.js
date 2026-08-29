import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';
import tailwindcss from '@tailwindcss/vite';

// base must match the GitHub Pages project path.
export default defineConfig({
  base: '/desert-dogs-ops/',
  plugins: [
    react(),
    cesium(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 4000,
  },
});
