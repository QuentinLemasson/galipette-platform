import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// Removed tsConfigPaths - using explicit aliases instead

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Core aliases
      '@': '/app/galipette-portal/src',
      '@/app': '/app/galipette-portal/src/app',
      '@/common': '/app/galipette-portal/src/common',
      '@/features': '/app/galipette-portal/src/features',
      '@/assets': '/app/galipette-portal/src/assets',
      '@/test': '/app/galipette-portal/src/test',

      // Shadcn aliases (essential for shadcn to work)
      '@/components': '/app/galipette-portal/src/common',
      '@/utils': '/app/galipette-portal/src/common/utils/shadcn.util',
      '@/ui': '/app/galipette-portal/src/common/ui',
      '@/lib': '/app/galipette-portal/src/common/utils',
      '@/hooks': '/app/galipette-portal/src/common/hooks',

      // Shared library alias (absolute path from container root)
      '@shared': '/app/galipette-shared-lib/types',
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173,
  },
});
