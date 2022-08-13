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

import { MiddlewareFetch } from './MiddlewareFetch.ts'

/**
 * ### Cloudflare Usage
 * Events are handled by defining and exporting an object with
 * method handlers that correspond to event names:
 *
 * ```ts
 * export default {
 *  fetch(request, env, context) {
 *    return new Response('Hello')
 *  },
 *}
 * ```
 *
 * In this setup, all incoming requests are classified as `'fetch'` events.
 * The fetch handler receives the Request and replies with a Response.
 *
 * @see {WorkerEnvFetchBinding}
 * @see {KeyworkRouter#fetch}
 */
export interface KeyworkFetcher<BoundAliases = {}> {
  /**
   * A display name used for debugging and log messages.
   * @category Debug
   */
  displayName?: string

  fetch: MiddlewareFetch<BoundAliases>
}
