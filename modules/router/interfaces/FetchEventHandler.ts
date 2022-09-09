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

import type { IsomorphicFetchEvent } from '../../events/mod.ts'

/**
 * This call-signature is similar to [`ExportedHandlerFetchHandler`](https://developers.cloudflare.com/workers/learning/  migrating-to-module-workers/)
 * defined in the [`@cloudflare/workers-types`](https://github.com/cloudflare/workers-types) package.
 * However, the `FetchHandler` type includes Keywork-specific arguments.
 */
export interface FetchEventHandler<BoundAliases = {}> {
  (request: Request, env?: BoundAliases, event?: IsomorphicFetchEvent): Response | Promise<Response>

  displayName?: string
}
