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

import { useRequestURL } from 'keywork/http'
import { URLPatternResultContext, normalizeURLPattern, normalizeURLPatternInit } from 'keywork/uri'
import { FC, useMemo } from 'react'
import { useSSRProps } from './SSRPropsProvider.js'

export interface KeyworkBrowserRouterProps {
  patternToPageComponent: PatternToPageComponentMap<any>
}

/**
 * @beta
 * @ignore
 */
export const KeyworkPatternToPageComponent: FC<KeyworkBrowserRouterProps> = ({ patternToPageComponent }) => {
  const staticProps = useSSRProps() as any
  const location = useRequestURL()

  const possibleMatch = useMemo(() => {
    return matchRoute(patternToPageComponent, location)
  }, [patternToPageComponent, location])

  const Component = useMemo(() => {
    if (!possibleMatch) return FallbackComponent
    const _Component = patternToPageComponent.get(possibleMatch.pathname.groups['0']!)

    return _Component || FallbackComponent
  }, [patternToPageComponent, possibleMatch])

  return (
    <URLPatternResultContext.Provider value={possibleMatch!}>
      <Component {...staticProps} />
    </URLPatternResultContext.Provider>
  )
}

const FallbackComponent: FC = () => {
  return (
    <>
      <h1>Keywork Error</h1>
      <h2>Page not found</h2>
    </>
  )
}

/**
 * A **client-side** mapping of path patterns to their respective page components.
 * This is useful if your app bundles all React route handlers into a single Worker.
 * *
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
 * @beta
 * @ignore
 */
export class PatternToPageComponentMap<StaticProps extends {}> extends Map<string, React.ComponentType<StaticProps>> {}

/**
 * @beta
 */
export function matchRoute(patternToPageComponent: PatternToPageComponentMap<any>, location: URL) {
  for (const pattern of patternToPageComponent.keys()) {
    const urlPattern = normalizeURLPattern(pattern)
    const possibleMatch = urlPattern.exec(normalizeURLPatternInit(location.pathname))

    if (possibleMatch) return possibleMatch
  }

  return null
}
