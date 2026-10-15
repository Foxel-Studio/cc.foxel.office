import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    outDir: 'frontend',
    emptyOutDir: false,
    sourcemap: false,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 2500,
    lib: {
      entry: 'src/index.ts',
      formats: ['iife'],
      name: 'FoxelOffice',
      fileName: () => 'index.js',
      cssFileName: 'player',
    },
  },
});
