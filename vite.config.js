import dts from 'vite-plugin-dts';
import path from 'path';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    eslint(),
    dts({
      outDir: 'dist',
      rollupTypes: true
    }),
  ],
  server: {
    watch: {
      include: ['src/**', 'lib/**']
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/Video.ts'),
      name: 'Video',
      fileName: (format) => `Video.${format}.js`
    },
  }
});
