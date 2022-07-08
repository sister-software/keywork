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

import { CompiledPath, PathMatch } from 'keywork/uri'
import { KeyworkFetcher } from './fetcher.ts'
import { IncomingRequestEvent, IncomingRequestEventData } from './request.ts'
import { ResponseLike } from './WorkerRouter/body.ts'

/**
 * A function or method that handles incoming requests and replies with a `Response`.
 *
 * @remarks
 * Generally, this is interface is assigned to a WorkerRouter method, such as `onRequestGet`
 * The `IncomingRequestEvent` argument is provided by the router's `fetch` method.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam ExpectedParams Optional string union of route path parameters. Only supported in Cloudflare Pages.
 * @typeParam Data Optional extra data to be passed to a route handler.
 *
 * @category Request Handler
 */
export type RouteRequestHandler<
  BoundAliases extends {} | null = null,
  ExpectedParams extends {} | null = null,
  Data extends Record<string, unknown> = Record<string, unknown>,
  ExpectedReturn extends ResponseLike = ResponseLike
> = (event: IncomingRequestEvent<BoundAliases, ExpectedParams, Data>) => Promise<ExpectedReturn> | ExpectedReturn

/**
 * @ignore
 */
export type RouteMethodDeclaration<
  BoundAliases extends {} | null = null,
  ExpectedParams extends {} | null = null,
  Data extends IncomingRequestEventData = IncomingRequestEventData
> = (
  /**
   * A `path-to-regexp` style pattern.
   *
   * @see {@link https://www.npmjs.com/package/path-to-regexp NPM Package}
   */
  paramPattern: string | RegExp,
  /**
   * One or more callback functions to handle an incoming request.
   */
  ...handlers: Array<RouteRequestHandler<BoundAliases, ExpectedParams, Data>>
) => void

/**
 * @ignore
 */
export interface ParsedRoute<BoundAliases extends {} | null = null> {
  compiledPath: CompiledPath
  fetcher: KeyworkFetcher<BoundAliases>
}

/**
 * @ignore
 */
export interface RouteMatch<ExpectedParams extends {} | null = null> {
  match: PathMatch<ExpectedParams>
  fetcher: KeyworkFetcher<any>
}
