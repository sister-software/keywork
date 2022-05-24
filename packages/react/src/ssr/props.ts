import { IncomingRequestData } from '@keywork/responder'
import React, { useMemo } from 'react'
import { RouteObject, useRoutes } from 'react-router'
import { RouteWithSSR } from './RouteWithSSR.js'

export type SSRPropsLike = {} | undefined | null

export type SSRPropsByPath<SSRP extends SSRPropsLike = null> = Map<string, SSRP>

export interface WindowAndKeyworkSSRProps {
  __ssr_props_by_path: SSRPropsByPath
}

/**
 * A mapping of React Router route patterns to their React component handlers.
 */
export type SSRRouteRecords<P = any> = Map<string, React.ElementType<P>>

export function useSSRRoutes(routeRecords?: SSRRouteRecords) {
  const routeObjects = useMemo((): RouteObject[] => {
    if (!routeRecords) return []
    return Array.from(routeRecords.entries(), ([path, Component]): RouteObject => {
      return {
        path,
        element: React.createElement(RouteWithSSR, { path, component: Component }),
      }
    })
  }, [routeRecords])

  const routes = useRoutes(routeObjects)

  return routes
}

/**
 * A request handler that fetches static props for a server-side rendered React component.
 */
export type GetStaticPropsHandler<
  /** The static props returned by the handler. */
  StaticProps,
  BoundAliases extends {} | null = null,
  AdditionalData extends {} | null = null
> = (
  /** Data parsed from the incoming request. */
  data: IncomingRequestData<BoundAliases>,
  /**
   * An optional argument for sending additional data to the handler.
   * This can be useful when a handler is invoked manually.
   */
  additionalData?: AdditionalData
) => StaticProps | Promise<StaticProps>
