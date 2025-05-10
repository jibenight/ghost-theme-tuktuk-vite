import { defineConfig } from 'vite';
import path from 'path';
import lightningcss from 'vite-plugin-lightningcss';

export default defineConfig({
  root: 'assets',
  plugins: [
    lightningcss({
      browsers: 'defaults',
      drafts: {
        nesting: true,
      },
      minify: true,
    }),
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        style: path.resolve(__dirname, 'assets/styles/main.css'),
        script: path.resolve(__dirname, 'assets/js/main.js'),
      },
    },
  },
});
