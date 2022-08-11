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
/* eslint-disable no-restricted-globals */

import type { RouteMatch } from '../route/mod.ts'

/**
 * A function within the Worker that receives all incoming requests.
 *
 * Generally, this interface is exclusive to {@link KeyworkRouter#fetch},
 * or any object that implements the {@link KeyworkFetcher} interface
 *
 * This is nearly identical to `ExportedHandlerFetchHandler`
 * defined in the `@cloudflare/workers-types` package.
 * However, the `MiddlewareFetch` type includes Keywork-specific arguments.
 *
 * @see {ExportedHandlerFetchHandler} A near-identical type defined by Cloudflare.
 *
 * @category Request
 */
/**
 * Middleware implementation of `fetch`
 *
 * This type is similar to `typeof fetch` with the option to return `null` to fallthrough.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @category Request
 */
export type MiddlewareFetch<BoundAliases = {}> = (
  request: globalThis.Request,
  env?: BoundAliases,
  /**
   * An event-like object from the runtime.
   * Usually either `IsomorphicFetchEvent` or `ExecutionContext`
   *
   * @see {IsomorphicFetchEvent}
   * @see {ExecutionContext}
   */
  eventLike?: unknown,
  /**
   * When invoked, will execute a route handler defined after the current.
   *
   * This is similar to Express.js Middleware.
   * Providing a request argument will override the path param parsing within `KeyworkRouter`.
   */
  next?: (...args: Partial<Parameters<MiddlewareFetch<BoundAliases>>>) => null | Response | Promise<null | Response>,
  matchedRoutes?: RouteMatch<any>[]
) => Promise<Response>

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

/**
 * Checks if a given object is shaped like a KeyworkFetcher
 *
 * This fixes some weirdness where `instanceof` may get clobbered
 * by a user's ESBuild configuration.
 *
 * @internal
 * @ignore
 */
export function isKeyworkFetcher<BoundAliases = {}>(fetcherLike: unknown): fetcherLike is KeyworkFetcher<BoundAliases> {
  return Boolean(fetcherLike && typeof fetcherLike === 'object' && 'fetch' in fetcherLike)
}
