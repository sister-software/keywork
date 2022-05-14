/* eslint-disable @typescript-eslint/ban-types */
import React from 'react'
import { useMatch } from 'react-router'
import { useHydrationContext } from './HydrationProvider'

interface RouteWithSSRProps {
  component: React.ElementType<any>
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
