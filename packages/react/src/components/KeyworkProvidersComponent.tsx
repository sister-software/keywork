import React from 'react'

export interface ProviderWrapperProps {
  children: React.ReactNode
}

/**
 * A component which wraps the current SSR routes.
 * Use this if you need to inject a provider into the SSR pipeline.
 */
export type KeyworkProvidersComponent = React.FC<ProviderWrapperProps>

export const KeyworkProviders: KeyworkProvidersComponent = ({ children }) => {
  return <>{children}</>
}
