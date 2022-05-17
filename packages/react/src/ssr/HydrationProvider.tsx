import { KeyworkQueryParamKeys } from '@keywork/shared'
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { createNamedContextHook } from '../hooks/createNamedContextHook.mjs'
import { SSRPropsByPath } from './props.mjs'

export interface HydrationProviderProps {
  ssrPropsByPath: SSRPropsByPath
  initialLocation: URL
  origin: string
  children: React.ReactNode
}

export interface HydrationProvider {
  propsByPath: SSRPropsByPath<null>
}

export const HydrationProvider: React.FC<HydrationProviderProps> = ({
  origin,
  ssrPropsByPath,
  initialLocation,
  children,
}) => {
  const lastRenderLocationRef = useRef(initialLocation)
  const [propsByPath, setPropsByPath] = useState<SSRPropsByPath<null>>(ssrPropsByPath)
  const location = useLocation()

  const fetchRouteData = useCallback(async () => {
    // @ts-expect-error Multiple contexts.
    if (typeof window === 'undefined') {
      throw new Error('HydrationProvider must only be used in the browser.')
    }

    const url = new URL(location.pathname, origin)
    url.searchParams.set(KeyworkQueryParamKeys.StaticProps, 'true')

    const response = await fetch(url.toString())

    if (!response.ok) {
      console.warn(response.status)
      console.error(new Error(`Could not request entry path ${url}`))
      return
    }

    const data = await response.json()
    const nextProps: SSRPropsByPath<any> = new Map([[location.pathname, data]])

    setPropsByPath(nextProps)
  }, [location.pathname, origin])

  useEffect(() => {
    if (lastRenderLocationRef.current.pathname !== location.pathname) {
      lastRenderLocationRef.current = new URL(location.pathname, lastRenderLocationRef.current.origin)
      fetchRouteData()
    }
  }, [fetchRouteData, location])

  const value = useMemo<HydrationProvider>(
    () => ({
      propsByPath,
    }),
    [propsByPath]
  )

  return <HydrationContext.Provider value={value}>{children}</HydrationContext.Provider>
}

export const HydrationContext = createContext<HydrationProvider | undefined>(undefined)
export const useHydrationContext = createNamedContextHook(HydrationContext)
