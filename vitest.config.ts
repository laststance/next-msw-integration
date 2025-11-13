import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],

    // Test matching patterns (same as Jest)
    include: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/e2e/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/dist/**',
    ],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'text-summary'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{js,jsx,ts,tsx}',
        'src/**/__tests__/**',
      ],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
