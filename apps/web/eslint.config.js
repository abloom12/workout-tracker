import pluginQuery from '@tanstack/eslint-plugin-query';
import pluginRouter from '@tanstack/eslint-plugin-router';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

import { reactConfig } from '@acme/eslint-config/react';

export default defineConfig([
  reactConfig,
  globalIgnores(['src/routeTree.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...pluginQuery.configs['flat/recommended-strict'],
      ...pluginRouter.configs['flat/recommended'],
    ],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    rules: {
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allow: [
            {
              from: 'package',
              package: '@tanstack/router-core',
              name: 'Redirect',
            },
            {
              from: 'package',
              package: '@tanstack/router-core',
              name: 'NotFoundError',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
]);
