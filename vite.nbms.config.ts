/**
 * Standalone build config for the Uganda National Bridge Management System.
 *   npx vite build --config vite.nbms.config.ts
 * Outputs the preserved public NBMS entry for the /roads/ GitHub Pages site.
 * The HTML entry remains index.nbms.html so the default NRMS entry is not
 * replaced.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'node:fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'finalise-nbms-html-name',
      closeBundle() {
        const source = path.resolve(__dirname, 'dist-nbms/index.nbms.source.html');
        const target = path.resolve(__dirname, 'dist-nbms/index.nbms.html');
        if (!fs.existsSync(source)) throw new Error(`Expected NBMS build output was not found: ${source}`);
        if (fs.existsSync(target)) fs.unlinkSync(target);
        fs.renameSync(source, target);
      },
    },
  ],
  base: process.env.NODE_ENV === 'production' ? '/roads/' : '/',
  define: {
    'import.meta.env.VITE_STANDALONE': JSON.stringify('1'),
    'import.meta.env.VITE_APP_ID': JSON.stringify('nbms'),
  },
  build: {
    outDir: 'dist-nbms',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.nbms.source.html'),
    },
  },
});
