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

import { WorkerEnvFetchBinding } from 'keywork/bindings'
import { KeyworkSession } from 'keywork/sessions'

/**
 * HTTP method verbs.
 * @ignore
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | '*'

/**
 * HTTP method normalized for the `WorkerRouter` methods.
 * @ignore
 */

export type NormalizedHTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options' | 'all'

/**
 * The incoming request sent received by the Worker.
 *
 * @remarks
 * Comments via Cloudflare:
 * >In addition to the properties on the standard Request object,
 * >the cf object contains extra information about the request provided by Cloudflare's edge.
 *
 * @public
 */
export interface RequestWithCFProperties extends Request {
  cf?: IncomingRequestCfProperties
}

/**
 * Additional data associated with the `IncomingRequestEvent`.
 *
 * @category Request
 * @public
 */
export interface IncomingRequestEventData extends Record<string, unknown> {
  session?: KeyworkSession
}

/**
 * An event object containing contextual data for a single and specific incoming HTTP request.
 *
 * @remarks
 * Generally, this interface is exclusive to {@link WorkerRouter#fetch}
 * and automatically passed to your subclass's route handlers.
 *
 * This is nearly identical to `EventContext` defined in the `@cloudflare/workers-types` package.
 * However, the `IncomingRequestContext` type includes Keywork-specific helpers.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam ExpectedParams URL parameters parsed from the incoming request's URL and the route's pattern.
 * @typeParam Data Optional extra data to be passed to a route handler.
 *
 * @category Request
 *
 * @public
 */
export interface IncomingRequestEvent<
  BoundAliases extends {} | null = null,
  ExpectedParams extends {} | null = null,
  Data extends Record<string, unknown> = Record<string, unknown>
> {
  request: RequestWithCFProperties
  /**
   * Extends the lifetime of the route handler even after a `Response` is sent to a client.
   */
  readonly waitUntil: (
    /**
     * The given promise argument will inform the Workers runtime to stay alive until the task completes.
     */
    nonBlockingTask: Promise<any>
  ) => void
  /**
   * When invoked, will execute a route handler defined after the current.
   *
   * @remarks
   * This is similar to Express.js Middleware.
   */
  next: MiddlewareFetch
  readonly env: BoundAliases

  /**
   * URL parameters parsed from the incoming request's URL and the route's pattern.
   */
  params: ExpectedParams
  /**
   * Optional extra data to be passed to a route handler.
   */
  data: Data
}

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
 * Middleware implementation of `fetch`
 *
 * This type is identical to `typeof fetch` with optional arguments.
 *
 * @category Request
 */
export type MiddlewareFetch = (
  /**
   * An optional override of the `Request` provided in the route handler's `IncomingRequestContext`
   */
  requestOrUrl?: Request | string,
  /**
   * An optional override of the `Request` provided in the route handler's `IncomingRequestContext`
   */
  requestInit?: RequestInit | Request
) => Response | Promise<Response>

/**
 * @deprecated This will likely be removed in a future Keywork version.
 * @ignore
 */
export const _defaultFetcher: WorkerEnvFetchBinding = {
  fetch: (requestOrUrl, requestInit) => {
    if (!requestOrUrl || typeof requestOrUrl === 'string') {
      return Promise.resolve(new Response(requestOrUrl, requestInit))
    }

    return fetch(requestOrUrl.clone())
  },
}
