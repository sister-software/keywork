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

import React, { createContext, useContext } from 'https://esm.sh/react@18.2.0'
import { useRequest } from './RequestContext.tsx'
import { ResponseContext } from './ResponseContext.tsx'
import { ServerEffectQueueContext } from './ServerEffectContext.ts'
import { useMiddleware } from './ServerEffectStack.ts'

export interface MiddlewareProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

/**
 * Context for consuming the current middleware.
 */
export const MiddlewareProvider: React.FC<MiddlewareProviderProps> = ({ children }) => {
  const request = useRequest()
  const { serverEffectQueue, responseContextValue } = useMiddleware(() => {
    ;<ServerEffectQueueContext.Provider value={serverEffectQueue}>
      <ResponseContext.Provider value={responseContextValue}>{children}</ResponseContext.Provider>
    </ServerEffectQueueContext.Provider>
  })

  return null
}
