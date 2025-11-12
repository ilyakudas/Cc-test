import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../public',
    emptyOutDir: false, // Don't delete existing files in public
    rollupOptions: {
      input: resolve(__dirname, 'src/main.js'),
      output: {
        entryFileNames: 'breeding-game.js',
        assetFileNames: 'assets/[name].[ext]',
        format: 'iife', // Immediately Invoked Function Expression for browser
        name: 'ChromaWing'
      }
    },
    minify: 'terser',
    sourcemap: true
  },
  server: {
    open: '/breeding-game.html'
  }
});
