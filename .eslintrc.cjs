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

const rawHeaderContent = `/**
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
`

const headerLines = rawHeaderContent
  //
  .replace('/**', '*')
  .replace('*/\n', '')
  .split('\n')

/** @type {import('eslint').ESLint.ConfigData} */
const config = {
  root: true,
  ignorePatterns: ['./packages/*/dist/**/*', './node_modules/**/*'],
  parser: '@typescript-eslint/parser',
  extends: ['@sister.software/eslint-config', 'plugin:react/jsx-runtime'],
  env: {
    browser: true,
    node: true,
    worker: true,
  },
  rules: {
    'header/header': [1, 'block', headerLines, 1],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        varsIgnorePattern: 'logger|React',
      },
    ],
  },
}

module.exports = config
