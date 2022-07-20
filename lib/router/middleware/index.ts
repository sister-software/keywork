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

import { RouteMatch } from '../route/parsed.ts'
import type { CloudflareWorkerEventContext } from 'keywork/request/cloudflare'

/**
 * A function within the Worker that receives all incoming requests.
 *
 * @remarks
 * Generally, this interface is exclusive to {@link WorkerRouter#fetch},
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
export type MiddlewareFetch<BoundAliases extends {} | null = null> = (
  request: globalThis.Request,
  env?: BoundAliases,
  eventContext?: CloudflareWorkerEventContext,
  /**
   * When invoked, will execute a route handler defined after the current.
   *
   * @remarks
   * This is similar to Express.js Middleware.
   * Providing a request argument will override the path param parsing within `WorkerRouter`.
   */
  next?: (...args: Partial<Parameters<MiddlewareFetch<BoundAliases>>>) => null | Response | Promise<null | Response>,
  matchedRoutes?: RouteMatch<any>[]
) => Response | Promise<Response>

/**
 * @see {WorkerEnvFetchBinding}
 * @see {WorkerRouter#fetch}
 */
export interface KeyworkFetcher<BoundAliases extends {} | null = null> {
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
export function isKeyworkFetcher<BoundAliases extends {} | null = null>(
  fetcherLike: unknown
): fetcherLike is KeyworkFetcher<BoundAliases> {
  return Boolean(fetcherLike && typeof fetcherLike === 'object' && 'fetch' in fetcherLike)
}
