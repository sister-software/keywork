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

import React, { useMemo } from 'https://esm.sh/react@18.2.0'
import { URLMatchContext } from '../contexts/mod.ts'
import { HTTPMethod, isMethodAllowed, ResponseLike, useResponseHandler } from '../http/mod.ts'

export interface MatchRequestProps extends URLPatternInit {
  /**
   * The HTTP method(s) to match against the request.
   *
   * If a value is not provided, the request will match regardless of the request method.
   * If an array is provided, the request will match if the request method is in the array.
   */
  allowedMethods?: HTTPMethod | HTTPMethod[]

  /**
   * Alias for `'pathname'`.
   */
  path?: string

  children?: ResponseLike
}

// const Match

export type MatchRequestChildren = React.ReactElement<MatchRequestProps>[] | React.ReactElement<MatchRequestProps>
export type MatchRequestParent = React.ReactElement<{ children: MatchRequestChildren }>

/**
 * Reduces a given array of `MatchRequest` components to the first matching the current request.
 *
 * @category HTTP Request
 */
export function matchRoute(
  children: MatchRequestChildren,
  request: Request,
  fallbackRoute: React.ReactElement
): React.ReactElement {
  const routeChildren = React.Children.toArray(children) as React.ReactElement<MatchRequestProps>[]

  for (const child of routeChildren) {
    const { allowedMethods = '*', path, ...patternInit } = child.props
    const pattern = new URLPattern(patternInit)

    if (isMethodAllowed(request.method, allowedMethods)) {
      const match = pattern.exec(request.url)

      if (match) {
        return <URLMatchContext.Provider value={match}>{child}</URLMatchContext.Provider>
      }
    }
  }

  return fallbackRoute
}

/**
 * Memoized hook to reduce a given array of `MatchRequest` components to the first matching the current request.
 *
 * @category HTTP Request
 */
export function useMatchedRoute(
  children: MatchRequestChildren,
  request: Request,
  fallbackRoute: React.ReactElement
): React.ReactElement {
  const MatchedRoute = useMemo<React.ReactElement>(() => {
    return matchRoute(children, request, fallbackRoute)
  }, [children, fallbackRoute, request])

  return MatchedRoute
}

export const RequestPattern: React.FC<MatchRequestProps> = ({ children }) => {
  const responseHandler = useResponseHandler()
  responseHandler.convert(children)
  return null
}
