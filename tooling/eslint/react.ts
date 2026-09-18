import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';

import { baseConfig } from './base';

export const reactConfig = defineConfig(baseConfig, {
  files: ['**/*.ts', '**/*.tsx'],
  extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
});
