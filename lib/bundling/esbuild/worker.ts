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

import { BuildOptions } from 'esbuild'
import { BundledFileName } from '../common.ts'

/**
 * ESBuild options for the Worker bundle.
 *
 * @remarks
 * The Worker runtime on Cloudflare Pages may differ from a standard Worker deployment.
 *
 * If you're encountering runtime errors, consider adding the ReadableStream polyfill:
 *
 * ```js
 * import esbuild from 'esbuild'
 *
 * esbuild.build({
 *   ...workerBuildOptions,
 *   inject: [require.resolve('keywork/polyfills/ReadableStream')],
 * })
 * ```
 *
 * @public
 * @category ESBuild
 */
export function createWorkerBuildOptions(entryPoints: string[], outfile = BundledFileName): BuildOptions {
  return {
    bundle: true,
    entryPoints,
    format: 'esm',
    keepNames: true,
    outfile,
    // 'browser' is the most accurate platform for workers.
    platform: 'browser',
    banner: {
      js: `/**
* @file This bundle is generated to run in a V8 Isolate environment, such as Cloudflare Workers.
*/
/* eslint-disable */`,
    },
  }
}
