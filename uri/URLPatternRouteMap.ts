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

import {
  IURLPattern,
  KeyworkRouteComponent,
  URLPathnameInput,
  URLPatternLike,
  URLPatternResult,
  isKeyworkRouteComponent,
  normalizeURLPattern,
  normalizeURLPatternInput,
} from './URLPattern.js'

export type RoutePatternEntry = [string, KeyworkRouteComponent<any>]

export type RoutePatternEntries = Iterable<RoutePatternEntry> | Map<string, KeyworkRouteComponent<any>>
export type PatternRouteComponentMapInput = RoutePatternEntries | KeyworkRouteComponent<any>[]
/**
 * Predicate for determining if a value is a `RoutePatternEntries`.
 */
export function isRoutePatternEntries(input: any): input is RoutePatternEntries {
  return Boolean(input && (input instanceof Map || (Array.isArray(input) && input.every(isRoutePatternEntry))))
}

/**
 * Predicate for determining if a value is a `RoutePatternEntry`.
 */
export function isRoutePatternEntry(input: any): input is RoutePatternEntry {
  return Array.isArray(input) && input.length === 2 && typeof input[0] === 'string' && typeof input[1] === 'function'
}

export interface RoutePatternsProps {
  routes: PatternRouteComponentMapInput
}

/**
 * A **client-side** mapping of path patterns to their respective page components.
 * This is useful if your app bundles all React route handlers into a single Worker.
 * *
 * A collection of patterns to their respective React components.
 *
 * ```ts
 * // Order your routes from most to least specific:
 * export const routes = new PatternRouteComponentMap([
 *   ['/todos/:todoSlug/:subTaskSlug/', TodoSubTaskPage],
 *   ['/todos/:todoSlug/', TodoPage],
 *   ['/todos/', TodosIndexPage],
 *   ['/about/', AboutPage],
 *   ['/privacy/', PrivacyPage],
 *   ['/', IndexPage],
 *   ['*', NotFoundErrorPage],
 * ])
 * ```
 */
export class PatternRouteComponentMap extends Map<string, React.ComponentType<any>> {
  constructor(input?: PatternRouteComponentMapInput) {
    let normalizedInput: RoutePatternEntries | undefined

    if (Array.isArray(input) && input.every(isKeyworkRouteComponent)) {
      normalizedInput = input.map((component): RoutePatternEntry => [component.pathname!, component])
    } else {
      normalizedInput = input
    }

    super(normalizedInput)
  }

  public get(input: URLPathnameInput | string): React.ComponentType<any> | undefined {
    const pathnamePattern = typeof input === 'string' ? input : input.pathname

    return super.get(pathnamePattern)
  }

  public match(input: URLPatternLike): LocationPatternResult | null {
    for (const [patternLike, Component] of this.entries()) {
      // TODO: Consider submapping of this to avoid recompiling patterns.
      const pattern = normalizeURLPattern(patternLike)
      const match = pattern.exec(normalizeURLPatternInput(input))

      if (!match) continue

      return {
        Component,
        match,
        pattern,
      }
    }

    return null
  }
}

interface LocationPatternResult {
  match: URLPatternResult
  pattern: IURLPattern
  Component: React.ComponentType<any>
}
