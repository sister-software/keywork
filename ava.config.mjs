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

import { packagesList } from './build/utils/packages.mjs'

const rewritePaths = Object.fromEntries(
  packagesList.map((pkgName) => [`packages/${pkgName}/test/`, `packages/${pkgName}/dist/test/`])
)

export default {
  nonSemVerExperiments: {
    nextGenConfig: true,
  },
  files: ['packages/*/test/**/*.spec.ts'],
  timeout: '5m',
  nodeArguments: ['--no-warnings', '--experimental-vm-modules'],
  typescript: {
    compile: false,
    rewritePaths,
  },
}
