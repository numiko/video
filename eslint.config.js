/**
 * This file is used for the purposes of linting the package codebase during development.
 */
import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default [
  // Base recommended config
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Custom configuration for your files
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-undef': 'warn',
      // 'off' because it does not work with TypeScript and function signatures
      'no-unused-vars': 'off',
      'no-shadow': 'warn',
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/keyword-spacing': 'warn',
    }
  }
];
