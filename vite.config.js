import dts from 'vite-plugin-dts';
import path from 'path';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    eslint(),
    dts({
      tsconfigPath: './tsconfig.dts.json',
      entryRoot: 'lib',
      outDir: 'dist',
      rollupTypes: true
    })
  ],
  server: {
    watch: {
      include: ['src/**', 'lib/**']
    }
  },
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'lib/Video.ts'),
      name: 'Video',
      fileName: (format) => `Video.${format}.js`
    },
  }
});
