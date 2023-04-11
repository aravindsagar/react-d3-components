module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { project: ['./tsconfig.json'] },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-empty-interface': 'off',
    'react-hooks/exhaustive-deps': 'error',
  },
  ignorePatterns: [
    '.eslintrc.js',
    'rollup.config.js',
    'node_modules',
    'build',
    'storybook-static',
    'src/**/*.stories.tsx',
    'src/**/*.test.tsx',
    'jest.config.js',
    'jest.setup.ts',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
