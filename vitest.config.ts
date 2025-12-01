import { createKitiumVitestConfig } from '@kitiumai/vitest-helpers/config';
import { defineConfig } from 'vitest/config';

export default defineConfig(
  createKitiumVitestConfig({
    preset: 'library',
    environment: 'jsdom', // For browser detection
    overrides: {
      resolve: {
        alias: {
          '@kitiumai/error': '@kitiumai/error',
        },
      },
      test: {
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        deps: {
          inline: ['@kitiumai/error', '@kitiumai/logger'],
        },
        coverage: {
          exclude: ['**/*.test.ts', '**/*.spec.ts', 'dist/**', 'node_modules/**', '**/index.ts'],
          thresholds: {
            lines: 80,
            functions: 80,
            branches: 60,
            statements: 80,
          },
        },
      },
    },
  })
);
