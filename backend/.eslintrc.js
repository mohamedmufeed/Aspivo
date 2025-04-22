import js from '@eslint/js';
import globals from 'globals';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  js.configs?.recommended,

  {
    ignores: ['dist', 'node_modules'],
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node,
      parser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
    },
  },
];
