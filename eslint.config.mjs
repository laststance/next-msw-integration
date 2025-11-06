// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import nextNext from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'
import tsPreFixer from 'eslint-config-ts-prefixer'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default defineConfig([
  ...tsPreFixer,
  {
    ignores: [
      '**/.vscode/**',
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/.github/**',
      '**/.git/**',
      '**/.idea/**',
      '.next/**',
      'next-env.d.ts',
      '**/storybook-static/**',
      '**/mockServiceWorker.js',
      '**/tests-examples/**',
      './playwright-report/**',
      './test-results/**',
      './e2e/tablet/**',
      './e2e/tablet-landscape/**',
      '.storybook/**',
      '**/.husky/**',
      'eslint.config.mjs',
      'postcss.config.mjs',
      '**/*.config.{js,mjs,cjs,ts}',
    ],
  },
  {
    plugins: {
      '@next/next': nextNext,
    },
    rules: {
      '@next/next/google-font-display': 'warn',
      '@next/next/google-font-preconnect': 'warn',
      '@next/next/inline-script-id': 'error',
      '@next/next/no-assign-module-variable': 'error',
      '@next/next/no-async-client-component': 'error',
      '@next/next/no-before-interactive-script-outside-document': 'warn',
      '@next/next/no-css-tags': 'warn',
      '@next/next/no-document-import-in-page': 'error',
      '@next/next/no-duplicate-head': 'error',
      '@next/next/no-head-element': 'warn',
      '@next/next/no-head-import-in-document': 'error',
      '@next/next/no-html-link-for-pages': 'warn',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-page-custom-font': 'warn',
      '@next/next/no-script-component-in-head': 'error',
      '@next/next/no-styled-jsx-in-document': 'warn',
      '@next/next/no-sync-scripts': 'warn',
      '@next/next/no-title-in-document-head': 'warn',
      '@next/next/no-typos': 'warn',
      '@next/next/no-unwanted-polyfillio': 'warn',
    },
  },
  jsxA11y.flatConfigs.recommended,
])
