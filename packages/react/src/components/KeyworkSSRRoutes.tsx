import React from 'react'
import { SSRRouteRecords, useSSRRoutes } from '../ssr/props.js'

export interface ProviderWrapperProps {
  children: React.ReactNode
  initialLocation: URL
}

/**
 * A component which wraps the current SSR routes.
 * Use this if you need to inject a provider into the SSR pipeline.
 */
export type KeyworkProvidersComponent = React.FC<ProviderWrapperProps>

export interface KeyworkSSRRoutesProps {
  routeRecords: SSRRouteRecords
  initialLocation: URL
  ProviderWrapper?: KeyworkProvidersComponent
}

export const KeyworkSSRRoutes: React.FC<KeyworkSSRRoutesProps> = ({
  routeRecords,
  ProviderWrapper,
  initialLocation,
}) => {
  const ssrRoutes = useSSRRoutes(routeRecords)

  if (ProviderWrapper) {
    return <ProviderWrapper initialLocation={initialLocation}>{ssrRoutes}</ProviderWrapper>
  }

  return ssrRoutes
}
