import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/common': path.resolve(__dirname, './src/common'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/test': path.resolve(__dirname, './src/test'),
      // Shadcn aliases (from components.json)
      '@/components': path.resolve(__dirname, './src/common'),
      '@/utils': path.resolve(__dirname, './src/common/utils/shadcn.util'),
      '@/ui': path.resolve(__dirname, './src/common/ui'),
      '@/lib': path.resolve(__dirname, './src/common/utils'),
      '@/hooks': path.resolve(__dirname, './src/common/hooks'),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173, // you can replace this port with any port
  },
});
