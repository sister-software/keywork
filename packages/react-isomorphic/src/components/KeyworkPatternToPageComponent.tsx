/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remark Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import { PathMatch } from '@keywork/responder'
import React, { useMemo } from 'react'
import { createContextAndNamedHook } from '../hooks/createNamedContextHook.js'
import { matchRoute, PatternToPageComponentMap } from '../ssr/index.js'
import { useKeyworkRouter } from './KeyworkRouter.js'
import { useStaticProps } from './StaticPropsProvider.js'
export interface KeyworkBrowserRouterProps {
  patternToPageComponent: PatternToPageComponentMap<any>
}

const [KeyworkRouteMatchContext, useMatch] = createContextAndNamedHook<PathMatch<{} | null> | null>(
  undefined,
  'KeyworkRouteMatchContext'
)
export { useMatch }

export const KeyworkPatternToPageComponent: React.FC<KeyworkBrowserRouterProps> = ({ patternToPageComponent }) => {
  const staticProps = useStaticProps<any>()
  const { location } = useKeyworkRouter()

  const possibleMatch = useMemo(() => {
    return matchRoute(patternToPageComponent, location)
  }, [patternToPageComponent, location])

  const Component = useMemo(() => {
    if (!possibleMatch) return FallbackComponent
    const _Component = patternToPageComponent.get(possibleMatch.pattern.path)

    return _Component || FallbackComponent
  }, [patternToPageComponent, possibleMatch])

  return (
    <KeyworkRouteMatchContext.Provider value={possibleMatch}>
      <Component {...staticProps} />
    </KeyworkRouteMatchContext.Provider>
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
