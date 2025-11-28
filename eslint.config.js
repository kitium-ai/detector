import baseConfig from '@kitiumai/config/eslint.config.base.js';

export default [
  ...baseConfig,
  {
    rules: {
      // Detector package specific rules
      complexity: ['warn', 25], // Detection logic can be complex
      'no-restricted-imports': 'off', // Detector needs relative imports
      '@typescript-eslint/no-explicit-any': 'warn', // Detection code often needs any
      '@typescript-eslint/naming-convention': 'off', // Detector has special naming (version numbers, API names)
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
];
