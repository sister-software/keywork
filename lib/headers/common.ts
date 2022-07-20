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
 * @ignore
 */
export const KeyworkHeaders = {
  'X-Powered-By': 'Keywork',
}

/**
 * @internal
 */
export const CookieHeaders = {
  Set: 'Set-Cookie',
  Read: 'Cookie',
} as const

/**
 * Merges the given source headers into the destination.
 *
 * @remarks
 * This mutates the `destination` headers.
 *
 */
export function mergeHeaders(destination: globalThis.Headers, ...sources: globalThis.Headers[]): void {
  for (const source of sources) {
    for (const [name, value] of source.entries()) {
      destination.set(name, value)
    }
  }
}
