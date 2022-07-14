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

import { createContextAndNamedHook } from 'keywork/react/hooks'
import { FC, ReactNode, useMemo } from 'react'

export interface KeyworkRouterProvider {
  location: URL
}

const [RouteContext, useKeyworkRouter] = createContextAndNamedHook<KeyworkRouterProvider>(undefined, 'RouteContext')
export { useKeyworkRouter }

export interface KeyworkRouterProps {
  initialLocation: URL
  children: ReactNode
}

export const RouteProvider: FC<KeyworkRouterProps> = ({ initialLocation, children }) => {
  const value = useMemo<KeyworkRouterProvider>(
    () => ({
      location: initialLocation,
    }),
    [initialLocation]
  )

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
}
