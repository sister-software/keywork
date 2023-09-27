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

/**
 * A special file name that sets Cloudflare Pages to advanced mode.
 *
 * When using a `_worker.js` file, Cloudflare Pages will be in "advanced mode".
 * Advanced mode disables the dyanmic aspects of the platform:
 *
 * - The `_worker.js` file is deployed as is and must be written using the Module Worker syntax.
 * - Your `/functions` directory will be ignored.
 * - All incoming requests will be sent to your bundled worker file.
 * - You will have parse incoming request URLS with a router such as `PatternToPageComponentMap`
 *
 * @see {PatternToPageComponentMap}
 *
 * @public
 */
export const BundledFileName = '_worker'

import type { BuildOptions } from 'esbuild'

/**
 * ESBuild options for the browser bundle.
 *
 * @public
 * @category ESBuild
 */
export function createBrowserBuildOptions(entryPoints: string[], outdir: string): BuildOptions {
  return {
    bundle: true,
    entryPoints,
    format: 'esm',
    keepNames: true,
    outdir,
    platform: 'browser',
    banner: {
      js: `/**
* @file This bundle is generated to run in browser environment.
*/
/* eslint-disable */`,
    },
  }
}

/**
 * ESBuild options for the Worker bundle.
 *
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
