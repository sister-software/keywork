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

export const runtimePattern = /runtime="([\w]+)"/

export type Runtime = 'cloudflare' | 'deno' | 'browser' | 'node'

const runtimeLabels = {
  cloudflare: 'Cloudflare Workers',
  deno: 'Deno',
  browser: 'Browser/ESM',
  node: 'Node',
} as const

/**
 *
 * @param {string} runtime
 */
export function runtimeToTabLabel(runtime: Runtime) {
  return runtimeLabels[runtime] || runtime
}
