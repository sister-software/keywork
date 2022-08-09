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

import { SSRPropsLike } from '../isomorphic/mod.ts'
import { normalizeURLPattern, normalizeURLPatternInput } from '../../uri/mod.ts'
/**
 * A **client-side** mapping of path patterns to their respective page components.
 * This is useful if your app bundles all React route handlers into a single Worker.
 * *
 * @example
 * A collection of patterns to their respective React components.
 *
 * ```ts
 * // Order your routes from most to least specific:
 * export const routeRecords = new PatternToPageComponentMap<any>([
 *   ['/todos/:todoSlug/:subTaskSlug/', TodoSubTaskPage],
 *   ['/todos/:todoSlug/', TodoPage],
 *   ['/todos/', TodosIndexPage],
 *   ['/about/', AboutPage],
 *   ['/privacy/', PrivacyPage],
 *   ['/', IndexPage],
 *   ['*', NotFoundErrorPage],
 * ])
 * ```
 *
 */
export class PatternToPageComponentMap<StaticProps extends SSRPropsLike> extends Map<
  string,
  React.ComponentType<StaticProps>
> {}

/**
 * @beta
 */
export function matchRoute(patternToPageComponent: PatternToPageComponentMap<any>, location: URL) {
  for (const pattern of patternToPageComponent.keys()) {
    const urlPattern = normalizeURLPattern(pattern)
    const possibleMatch = urlPattern.exec(normalizeURLPatternInput(location.pathname))

    if (possibleMatch) return possibleMatch
  }

  return null
}
