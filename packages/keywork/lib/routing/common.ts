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

import { SSRPropsLike } from 'keywork/react'
import { KeyworkSession } from '../sessions'

/**
 * HTTP method verbs.
 * @ignore
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/**
 * The incoming request sent received by the Worker.
 *
 * @remarks
 * Comments via Cloudflare:
 * >In addition to the properties on the standard Request object,
 * >the cf object contains extra information about the request provided by Cloudflare's edge.
 * @public
 */
export interface RequestWithCFProperties extends Request {
  cf: IncomingRequestCfProperties
}

/**
 * A value that may be returned wrapped in a Promise
 * @public
 */
export type PossiblePromise<T> = T | Promise<T>

/**
 * A function within the Worker that receives all incoming requests.

 * @remarks
 * Generally, this interface is exclusive to {@link KeyworkRequestHandler#fetch}
 * and passed to your subclass' `onRequest` method.
 *
 * This is nearly identical to `ExportedHandlerFetchHandler`
 * defined in the `@cloudflare/workers-types` package.
 * However, the `WorkerRequestHandler` type includes Keywork-specific helpers.
 *
 * :::note
 * This method should not be used with Cloudflare Pages unless you've disabled function routing
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
 * @category Routing
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
  context: Omit<ExecutionContext, 'passThroughOnException'>
) => PossiblePromise<Response>

/**
 * Additional data associated with the request.
 */
export interface KeyworkPageFunctionData extends Record<string, unknown> {
  session?: KeyworkSession
}

/**
 * A function or method that handles incoming requests and replies with a `Response`.
 *
 * @remarks
 * Generally, this is interface is assigned to a KeyworkRouter method, such as `onRequestGet`
 * The `EventContext` argument is provided by the router's `fetch` method.
 *
 * @typeDef BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeDef ParamKeys Optional string union of route path parameters. Only supported in Cloudflare Pages.
 * @typeDef Data Optional extra data to be passed to a route handler.
 *
 * @category Routing
 */
export type RouteRequestHandler<
  BoundAliases extends {} | null = null,
  ParamKeys extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: EventContext<BoundAliases, ParamKeys, Data>) => PossiblePromise<Response>

/**
 * A method used to fetch static props for rendering React apps in your worker.
 *
 * @typeDef BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeDef StaticProps Optional static props returned by `getStaticProps`
 * @typeDef ParamKeys Optional string union of route path parameters. Only supported in Cloudflare Pages.
 * @typeDef Data Optional extra data to be passed to a route handler.
 */
export type GetStaticProps<
  BoundAliases extends {} | null = null,
  StaticProps extends SSRPropsLike = {},
  ParamKeys extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: EventContext<BoundAliases, ParamKeys, Data>) => PossiblePromise<StaticProps>
