import React from 'react'
import { useMatch } from 'react-router'
import { useHydrationContext } from './HydrationProvider.js'

export interface RouteWithSSRProps {
  // component: React.ElementType<any>
  component: any
  path: string
}

export const RouteWithSSR: React.FC<RouteWithSSRProps> = ({ path, component: Component }) => {
  const { propsByPath } = useHydrationContext()
  const match = useMatch(path)

  if (!match) return null
  const pageProps = propsByPath.get(match.pathname)

  if (pageProps) {
    return <Component {...pageProps} />
  }

  return null
}
