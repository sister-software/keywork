import React, { useMemo } from 'react'
import { createContextAndNamedHook } from '../hooks/createNamedContextHook.js'

export interface KeyworkRouterProvider {
  location: URL
}

const [KeyworkBrowserRouterContext, useKeyworkRouter] = createContextAndNamedHook<KeyworkRouterProvider>(
  undefined,
  'KeyworkRouter'
)
export { useKeyworkRouter }

export interface KeyworkRouterProps {
  initialLocation: URL
  children: React.ReactNode
}

export const KeyworkRouter: React.FC<KeyworkRouterProps> = ({ initialLocation, children }) => {
  const value = useMemo<KeyworkRouterProvider>(
    () => ({
      location: initialLocation,
    }),
    [initialLocation]
  )

  return <KeyworkBrowserRouterContext.Provider value={value}>{children}</KeyworkBrowserRouterContext.Provider>
}
