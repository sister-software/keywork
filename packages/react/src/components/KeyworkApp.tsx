import React from 'react'
import { SSRRouteRecords, useSSRRoutes } from '../ssr/props.mjs'

export interface KeyworkAppProps {
  children: React.ReactNode
}

/**
 * A component which wraps the current SSR routes.
 * Use this if you need to inject a provider into the SSR pipeline.
 */
export type ProviderWrapper = React.FC<KeyworkAppProps>

export interface KeyworkReactAppProps {
  routeRecords: SSRRouteRecords
  ProviderWrapper?: ProviderWrapper
}

export const KeyworkReactSSRRoutes: React.FC<KeyworkReactAppProps> = ({ routeRecords, ProviderWrapper }) => {
  const ssrRoutes = useSSRRoutes(routeRecords)

  if (ProviderWrapper) {
    return <ProviderWrapper>{ssrRoutes}</ProviderWrapper>
  }

  return ssrRoutes
}
