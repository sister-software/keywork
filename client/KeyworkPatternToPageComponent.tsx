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

import { URLPatternResultContext, normalizeURLPattern, normalizeURLPatternInit } from 'keywork/uri'
import { useMemo } from 'react'
import { useSSRProps } from './SSRPropsProvider.js'
import { useLocation } from './hooks.js'

/**
 * A **client-side** mapping of path patterns to their respective page components.
 * This is useful if your app bundles all React route handlers into a single Worker.
 * *
 * A collection of patterns to their respective React components.
 *
 * ```ts
 * // Order your routes from most to least specific:
 * export const routes = [
 *   ['/todos/:todoSlug/:subTaskSlug/', TodoSubTaskPage],
 *   ['/todos/:todoSlug/', TodoPage],
 *   ['/todos/', TodosIndexPage],
 *   ['/about/', AboutPage],
 *   ['/privacy/', PrivacyPage],
 *   ['/', IndexPage],
 *   ['*', NotFoundErrorPage],
 * ]
 * ```
 */
export type KeyworkRoutePatternEntry = [string, React.ComponentType<any>]

export interface KeyworkBrowserRouterProps {
  routes: Iterable<KeyworkRoutePatternEntry> | Map<string, React.ComponentType<any>>
}

/**
 * @beta
 * @ignore
 */
export const KeyworkPatternToPageComponent: React.FC<KeyworkBrowserRouterProps> = ({ routes }) => {
  const staticProps = useSSRProps()
  const location = useLocation()

  const routesMap = useMemo(() => new Map(routes), [routes])

  const possibleMatch = useMemo(() => {
    return matchRoute(routes, location)
  }, [routes, location])

  const Component = useMemo(() => {
    if (!possibleMatch) return FallbackComponent
    const _Component = routesMap.get(possibleMatch.pathname.input)

    return _Component || FallbackComponent
  }, [routes, possibleMatch])

  const pageStaticProps = staticProps.get(possibleMatch?.pathname.input!) || {}

  return (
    <URLPatternResultContext.Provider value={possibleMatch!}>
      <Component {...pageStaticProps} />
    </URLPatternResultContext.Provider>
  )
}

const FallbackComponent: React.FC = () => {
  return (
    <>
      <h1>Keywork Error</h1>
      <h2>Page not found</h2>
    </>
  )
}

FallbackComponent.displayName = 'KeyworkFallbackPage'

/**
 * @beta
 */
export function matchRoute(
  patternToPageComponent: Iterable<KeyworkRoutePatternEntry>,
  location: Pick<URL, 'pathname'>
) {
  for (const [pattern] of patternToPageComponent) {
    const urlPattern = normalizeURLPattern(pattern)
    const possibleMatch = urlPattern.exec(normalizeURLPatternInit(location.pathname))

    if (possibleMatch) return possibleMatch
  }

  return null
}
