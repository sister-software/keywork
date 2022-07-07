/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remarks Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-ignore Node
const path = require('path')
// @ts-ignore Node
const fs = require('fs')

// @ts-ignore Node
const headerPath = path.resolve(__dirname, 'build', 'header.js')
const rawHeaderContent = fs.readFileSync(headerPath, 'utf8')
const headerLines = rawHeaderContent.replace('/**', '*').replace('*/\n', '').split('\n')

const config = {
  root: true,
  ignorePatterns: ['./packages/*/dist/**/*', './node_modules/**/*'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', 'header'],
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
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    node: true,
    worker: true,
  },
  rules: {
    'header/header': [2, 'block', headerLines, 2],
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

module.exports = config
