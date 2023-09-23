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

import type { RouteMatch } from 'keywork/router/interfaces/RouteMatch'

/** @ignore */
export type MiddlewareReturnTypes = null | Response | Promise<null | Response>

/**
 * A function within the Worker that receives all incoming requests.
 *
 * Generally, this interface is exclusive to {@link RequestRouter#fetch},
 * or any object that implements the {@link Keywork#Router.Fetcher `Fetcher`} interface
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
export interface MiddlewareFetch<BoundAliases = {}, ExpectedReturn extends MiddlewareReturnTypes = Promise<Response>> {
  (
    request?: Request,
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
     * Providing a request argument will override the path param parsing within `RequestRouter`.
     */
    next?: (
      ...args: Partial<Parameters<MiddlewareFetch<BoundAliases, MiddlewareReturnTypes>>>
    ) => MiddlewareReturnTypes,
    matchedRoutes?: RouteMatch<any>[]
  ): ExpectedReturn
}
