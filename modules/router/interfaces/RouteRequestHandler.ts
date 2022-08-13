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

import type { ResponseLike } from '../../http/response/mod.ts'
import type { IsomorphicFetchEvent } from '../../events/mod.ts'
import { MiddlewareFetch } from './MiddlewareFetch.ts'

/**
 * A function or method that handles incoming requests and replies with a `Response`.
 *
 * Generally, this is interface is assigned to a KeyworkRouter method, such as `onRequestGet`
 * The `IsomorphicFetchEvent` argument is provided by the router's `fetch` method.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam ExpectedParams Optional string union of route path parameters. Only supported in Cloudflare Pages.
 * @typeParam Data Optional extra data to be passed to a route handler.
 *
 * @category Request Handler
 */
export interface RouteRequestHandler<
  BoundAliases = {},
  ExpectedParams = {},
  Data extends {} = Record<string, unknown>,
  ExpectedReturn extends ResponseLike = ResponseLike
> {
  (event: IsomorphicFetchEvent<BoundAliases, ExpectedParams, Data>, next: MiddlewareFetch<BoundAliases>):
    | Promise<ExpectedReturn>
    | ExpectedReturn
}
