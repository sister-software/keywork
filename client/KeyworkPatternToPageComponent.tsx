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

import { useMemo } from 'react'
import { useRequest } from '../http/RequestContext.js'
import { PatternRouteComponentMap, RoutePatternsProps, URLPatternResultContext } from '../uri/index.js'
import { useSSRPropsByPath } from './SSRPropsProvider.js'

/**
 * @beta
 * @ignore
 */
export const KeyworkPatternToPageComponent: React.FC<RoutePatternsProps> = ({ routes }) => {
  const request = useRequest()

  const staticPropsByPath = useSSRPropsByPath()
  const patternRouteComponentMap = useMemo(() => new PatternRouteComponentMap(routes), [routes])
  const result = useMemo(() => patternRouteComponentMap.match(request.url), [patternRouteComponentMap, request.url])

  if (!result) {
    return <FallbackComponent />
  }

  const { Component, match } = result
  const staticProps = staticPropsByPath.get(location.pathname)

  return (
    <URLPatternResultContext.Provider value={match}>
      <Component {...staticProps} />
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
