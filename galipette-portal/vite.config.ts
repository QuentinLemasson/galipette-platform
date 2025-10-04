import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsConfigPaths()],
  resolve: {
    alias: {
      '@': './src',
      '@/app': './src/app',
      '@/common': './src/common',
      '@/features': './src/features',
      '@/assets': './src/assets',
      '@/test': './src/test',
      // Shadcn aliases (from components.json)
      '@/components': './src/common',
      '@/utils': './src/common/utils/shadcn.util',
      '@/ui': './src/common/ui',
      '@/lib': './src/common/utils',
      '@/hooks': './src/common/hooks',
      // Shared library alias
      '@shared': '../galipette-shared-lib/types',
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
