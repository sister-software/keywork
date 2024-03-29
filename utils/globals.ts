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

import { KeyworkResourceError, Status } from '../errors/index.js'

/**
 * @internal
 */
export function readGlobalScope(this: any): typeof globalThis {
  if (typeof globalThis !== 'undefined') return globalThis
  // @ts-ignore global
  if (typeof window !== 'undefined') return window
  // @ts-ignore global
  if (typeof self !== 'undefined') return self
  // @ts-ignore global
  if (typeof global !== 'undefined') return global
  if (typeof this !== 'undefined') return this

  throw new KeyworkResourceError('Could not identify global scope', Status.FailedDependency)
}
