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
 * # `@keywork/polyfills`
 *
 * Polyfills for building Keywork apps on Cloudflare Workers
 *
 * ## `ReadableStream`
 * Polyfill for building Keywork apps on Cloudflare Pages.
 *
 * ### Usage with ESBuild
 *
 * ```js
 * import esbuild from 'esbuild'
 * import { createRequire } from 'module'
 * const require = createRequire(import.meta.url)
 *
 * esbuild.build({
 *   format: 'esm',
 *   entryPoints,
 *   keepNames: true,
 *   inject: [ require.resolve('keywork/polyfills/ReadableStream') ]
 * })
 * ```
 *
 * :::note
 * Make sure to set `keepNames` to preserve the polyfill's class names during minification.
 *
 * :::
 *
 * @packageDocumentation
 * @module polyfills
 */
export * from './ReadableStream.js'
