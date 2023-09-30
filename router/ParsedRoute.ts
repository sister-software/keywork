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

import type { IURLPattern } from 'keywork/utils'

import type { Fetcher } from './Fetcher.js'
import type { RouteRequestHandler } from './RouteRequestHandler.js'

/**
 * @ignore
 */
export interface ParsedRouteBase {
  urlPattern: IURLPattern
  displayName?: string
}

/**
 * @ignore
 */
export interface ParsedRouteFromRouteHandler<BoundAliases = {}> extends ParsedRouteBase {
  kind: 'routeHandler'
  fetch: RouteRequestHandler<BoundAliases, any, any, Response>
}

/**
 * @ignore
 */
export interface ParsedRouteFromFetcher<BoundAliases = {}> extends ParsedRouteBase {
  kind: 'fetcher'
  fetcher: Fetcher<BoundAliases>
}

export type ParsedRoute<BoundAliases = {}> =
  | ParsedRouteFromRouteHandler<BoundAliases>
  | ParsedRouteFromFetcher<BoundAliases>
