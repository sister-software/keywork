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

import { IncomingRequestContext, KeyworkPageFunctionData } from './common.js'

/**
 * A function or method that handles incoming requests and replies with a `Response`.
 *
 * @remarks
 * Generally, this is interface is assigned to a KeyworkRouter method, such as `onRequestGet`
 * The `EventContext` argument is provided by the router's `fetch` method.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam ExpectedParams Optional string union of route path parameters. Only supported in Cloudflare Pages.
 * @typeParam Data Optional extra data to be passed to a route handler.
 *
 * @category Routing
 */
export type RouteRequestHandler<
  BoundAliases extends {} | null = null,
  ExpectedParams extends {} | null = null,
  Data extends Record<string, unknown> = Record<string, unknown>
> = (context: IncomingRequestContext<BoundAliases, ExpectedParams, Data>) => Promise<Response> | Response

export type RouteMethodDeclaration<
  BoundAliases extends {} | null = null,
  ExpectedParams extends {} | null = null,
  Data extends KeyworkPageFunctionData = KeyworkPageFunctionData
> = (
  /**
   * A `path-to-regexp` style pattern.
   *
   * @see {@link https://www.npmjs.com/package/path-to-regexp NPM Package}
   */
  paramPattern: string,
  /**
   * One or more callback functions to handle an incoming request.
   */
  ...handlers: Array<RouteRequestHandler<BoundAliases, ExpectedParams, Data>>
) => void

export interface ParsedRoute<
  BoundAliases extends {} | null = null,
  Data extends KeyworkPageFunctionData = KeyworkPageFunctionData
> {
  pathPattern: string
  handler: RouteRequestHandler<BoundAliases, any, Data>
}
