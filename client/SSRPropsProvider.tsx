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

import { useKeyworkLogger } from 'keywork/logging'
import { KEYWORK_STATIC_PROPS_QUERY_KEY } from 'keywork/uri'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from './hooks.js'

/**
 * A mapping of static props to a given path.
 *
 * @internal
 */
export type SSRPropsByPath = Map<string, {} | undefined>

const SSRPropsContext = createContext<SSRPropsByPath>(undefined as any)
export const useSSRPropsByPath = () => useContext(SSRPropsContext)

export interface SSRPropsProviderProps {
  initialPropsByPath: SSRPropsByPath
  initialLocation: URL
  children: React.ReactNode
}

export const SSRPropsProvider: React.FC<SSRPropsProviderProps> = ({
  initialPropsByPath,
  initialLocation,
  children,
}) => {
  const lastRenderLocationRef = useRef(initialLocation)
  const [propsByPath, setPropsByPath] = useState(initialPropsByPath)
  const location = useLocation()
  const logger = useKeyworkLogger()

  const fetchRouteData = useCallback(async () => {
    const url = new URL(location.pathname, (globalThis as any).location.origin)
    url.searchParams.set(KEYWORK_STATIC_PROPS_QUERY_KEY, 'true')

    const response = await fetch(url)

    if (!response.ok) {
      console.warn(response.status)
      logger.error(new Error(`Could not request entry path ${url}`))
      return
    }

    const data = await response.json()

    setPropsByPath(new Map([[location.pathname, data]]))
  }, [location.pathname, logger])

  useEffect(() => {
    if (lastRenderLocationRef.current.pathname !== location.pathname) {
      lastRenderLocationRef.current = new URL(location.pathname, lastRenderLocationRef.current.origin)
      fetchRouteData()
    }
  }, [fetchRouteData, location])

  return <SSRPropsContext.Provider value={propsByPath}>{children}</SSRPropsContext.Provider>
}
