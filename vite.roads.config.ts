import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'node:fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'finalise-roads-html-name',
      closeBundle() {
        const source = path.resolve(__dirname, 'dist-roads/index.roads.source.html');
        const target = path.resolve(__dirname, 'dist-roads/index.html');
        if (!fs.existsSync(source)) throw new Error(`Expected Roads build output was not found: ${source}`);
        if (fs.existsSync(target)) fs.unlinkSync(target);
        fs.renameSync(source, target);
      },
    },
  ],
  base: process.env.NODE_ENV === 'production' ? '/roads/' : '/',
  build: {
    outDir: 'dist-roads',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.roads.source.html'),
    },
  },
});
