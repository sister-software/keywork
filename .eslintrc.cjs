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
const headerPath = path.resolve(__dirname, 'common', 'header.cjs')
const rawHeaderContent = fs.readFileSync(headerPath, 'utf8')
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
  extends: ['@sister.software/eslint-config'],
  env: {
    browser: true,
    node: true,
    worker: true,
  },
  rules: {
    'header/header': [1, 'block', headerLines, 1],
  },
}

module.exports = config
