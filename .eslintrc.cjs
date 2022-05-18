// @ts-check

// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  ignorePatterns: ['./**/dist/**/*'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.mts', '.tsx'],
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  env: {
    browser: true,
    node: true,
    worker: true,
  },
  rules: {
    'import/no-unresolved': 'off',
    'import/extensions': 1,
    'react/prop-types': 'off',
    'no-undef': 'off',
    'no-extra-semi': 'off',
    '@typescript-eslint/no-extra-semi': ['warn'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        varsIgnorePattern: 'logger',
      },
    ],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-ts-comment': [
      'warn',
      {
        'ts-ignore': 'allow-with-description',
      },
    ],
  },
}
