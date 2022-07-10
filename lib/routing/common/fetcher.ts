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

import { ResponseLike } from './body.ts'
import type { IncomingRequestEvent, RequestWithCFProperties } from './request.ts'
import type { RouteRequestHandler } from './RouteRequestHandler.ts'

/**
 * A function within the Worker that receives all incoming requests.
 *
 * @remarks
 * Generally, this interface is exclusive to {@link WorkerRouter#fetch}
 * and passed to your subclass' route handlers.
 *
 * This is nearly identical to `ExportedHandlerFetchHandler`
 * defined in the `@cloudflare/workers-types` package.
 * However, the `WorkerRequestHandler` type includes Keywork-specific helpers.
 *
 * :::note
 * This interface should not be used with Cloudflare Pages unless you've disabled function routing
 * with [advanced mode](https://developers.cloudflare.com/pages/platform/functions/#advanced-mode)
 * :::
 *
 * :::note
 * `WorkerRequestHandler` shouldn't be confused with [`PagesFunction`](https://github.com/cloudflare/workers-types/blob/master/manual-ts/pages.d.ts)
 *
 * Cloudflare **Pages** instead uses named exports e.g. `export const onRequest = ...`
 * :::
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 *
 * @see {ExportedHandlerFetchHandler} A near-identical type defined by Cloudflare.
 *
 * @category Request
 */
export type WorkerRequestHandler<BoundAliases extends {} | null = null> = (
  request: RequestWithCFProperties,
  env: BoundAliases,
  /**
   * The Worker context object.
   *
   * @remarks
   * `passThroughOnException` is not available as it does not apply to Cloudflare Pages
   */
  context: IncomingRequestEvent<BoundAliases, any, any>
) => Promise<Response> | Response

/**
 * An interface that accepts both a r
 * @see {WorkerRouter#fetch}
 * @see {WorkerEnvFetchBinding}
 */
export interface KeyworkFetcher<BoundAliases extends {} | null = null> {
  /**
   * A display name used for debugging and log messages.
   * @category Debug
   */
  displayName?: string

  fetch: {
    (...args: Parameters<RouteRequestHandler<BoundAliases, any, any>>): ResponseLike | Promise<ResponseLike>
    (...args: Parameters<WorkerRequestHandler<BoundAliases>>): ResponseLike | Promise<ResponseLike>
  }
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
