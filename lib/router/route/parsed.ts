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

import type { CompiledPath, PathMatch } from 'keywork/uri'
import type { KeyworkFetcher } from 'keywork/router/middleware'
import type { RouteRequestHandler } from './RouteRequestHandler.ts'

/**
 * @ignore
 */
export interface ParsedRouteBase {
  compiledPath: CompiledPath
  displayName?: string
}

/**
 * @ignore
 */
export interface ParsedRouteFromRouteHandler<BoundAliases extends {} | null = null> extends ParsedRouteBase {
  kind: 'routeHandler'
  fetch: RouteRequestHandler<BoundAliases, any, any, globalThis.Response>
}

/**
 * @ignore
 */
export interface ParsedRouteFromFetcher<BoundAliases extends {} | null = null> extends ParsedRouteBase {
  kind: 'fetcher'
  fetcher: KeyworkFetcher<BoundAliases>
}

export type ParsedRoute<BoundAliases extends {} | null = null> =
  | ParsedRouteFromRouteHandler<BoundAliases>
  | ParsedRouteFromFetcher<BoundAliases>

/**
 * @ignore
 */
export interface RouteMatch<BoundAliases extends {} | null = null, ExpectedParams extends {} | null = null> {
  match: PathMatch<ExpectedParams>
  parsedRoute: ParsedRoute<BoundAliases>
}
