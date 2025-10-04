import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
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
});
