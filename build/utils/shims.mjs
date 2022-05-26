/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remark Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import { createRequire } from 'module'
import stdLibBrowser from 'node-stdlib-browser'
import plugin from 'node-stdlib-browser/helpers/esbuild/plugin'
const require = createRequire(import.meta.url)

export const createNodeEnvShim = () => {
  return {
    inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
    define: {
      global: 'global',
      // Buffer: 'Buffer',
    },
    plugins: [
      plugin({
        path: stdLibBrowser.path,
      }),
    ],
  }
}

export const createBuildEnvInjections = () => {
  return {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.BUILD_ID': JSON.stringify(process.env.BUILD_ID || Date.now()),
  }
}
