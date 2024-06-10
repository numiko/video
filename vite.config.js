import path from 'path';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [eslint()],
  test: {
    environment: 'happy-dom',
    coverage: {
      include: ['lib/']
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/Package.js'),
      name: 'Package',
      fileName: (format) => `Package.${format}.js`
    },
  }
});
