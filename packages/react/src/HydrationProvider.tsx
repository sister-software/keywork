/* eslint-disable @typescript-eslint/ban-types */
import { QueryParamKeys } from '@keywork/shared'
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { createNamedContextHook } from './createNamedContextHook.mjs'
import { SSRPropsByPath } from './props.mjs'

export interface HydrationProviderProps {
  ssrPropsByPath: SSRPropsByPath
  initialLocation: URL
}

interface HydrationProvider {
  propsByPath: SSRPropsByPath<unknown>
}

export const HydrationProvider: React.FC<HydrationProviderProps> = ({ ssrPropsByPath, initialLocation, children }) => {
  const lastRenderLocationRef = useRef(initialLocation)
  const [propsByPath, setPropsByPath] = useState<SSRPropsByPath<unknown>>(ssrPropsByPath)
  const location = useLocation()
  const fetchRouteData = useCallback(async () => {
    const url = new URL(location.pathname, window.location.origin)
    url.searchParams.set(QueryParamKeys.StaticProps, 'true')

    const response = await window.fetch(url.toString())

    if (!response.ok) {
      console.warn(response.status)
      console.error(new Error(`Could not request entry path ${url}`))
      return
    }

    const data = await response.json()
    const nextProps: SSRPropsByPath<unknown> = new Map([[location.pathname, data]])

    setPropsByPath(nextProps)
  }, [location.pathname])

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
