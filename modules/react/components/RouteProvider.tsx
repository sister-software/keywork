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

import React, { FC, ReactNode, useMemo } from 'https://esm.sh/react@18.2.0'
import { createContextAndNamedHook } from '../functions/createNamedContextHook.ts'

export interface RequestRouterProvider {
  location: URL
}

const [RouteContext, useRequestRouter] = createContextAndNamedHook<RequestRouterProvider>(undefined, 'RouteContext')
export { useRequestRouter }

export interface RequestRouterProps {
  initialLocation: URL
  children: ReactNode
}

export const RouteProvider: FC<RequestRouterProps> = ({ initialLocation, children }) => {
  const value = useMemo<RequestRouterProvider>(
    () => ({
      location: initialLocation,
    }),
    [initialLocation]
  )

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
}
