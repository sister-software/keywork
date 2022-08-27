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

import React, { FC, useMemo } from 'https://esm.sh/react@18.2.0'
import { useRequestRouter } from '../../components/RouteProvider.tsx'
import { useStaticProps } from '../../components/StaticPropsProvider.tsx'
import { createContextAndNamedHook } from '../../functions/createNamedContextHook.ts'
import { matchRoute, PatternToPageComponentMap } from '../functions/matchRoute.ts'

export interface KeyworkBrowserRouterProps {
  patternToPageComponent: PatternToPageComponentMap<any>
}

const [KeyworkRouteMatchContext, useMatch] = createContextAndNamedHook<URLPatternResult | null>(
  undefined,
  'KeyworkRouteMatchContext'
)
export { useMatch }

/**
 * @beta
 * @ignore
 */
export const KeyworkPatternToPageComponent: FC<KeyworkBrowserRouterProps> = ({ patternToPageComponent }) => {
  const staticProps = useStaticProps<any>()
  const { location } = useRequestRouter()

  const possibleMatch = useMemo(() => {
    return matchRoute(patternToPageComponent, location)
  }, [patternToPageComponent, location])

  const Component = useMemo(() => {
    if (!possibleMatch) return FallbackComponent
    const _Component = patternToPageComponent.get(possibleMatch.pathname.groups['0'])

    return _Component || FallbackComponent
  }, [patternToPageComponent, possibleMatch])

  return (
    <KeyworkRouteMatchContext.Provider value={possibleMatch}>
      <Component {...staticProps} />
    </KeyworkRouteMatchContext.Provider>
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
