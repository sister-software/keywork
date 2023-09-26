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

import type { Fetcher } from 'keywork/router/Fetcher'

/**
 * Checks if a given object is shaped like a KeyworkFetcher
 *
 * This fixes some weirdness where `instanceof` may get clobbered
 * by a user's ESBuild configuration.
 *
 * @internal
 * @ignore
 */
export function isFetcher<BoundAliases = {}>(fetcherLike: unknown): fetcherLike is Fetcher<BoundAliases> {
  return Boolean(fetcherLike && typeof fetcherLike === 'object' && 'fetch' in fetcherLike)
}
