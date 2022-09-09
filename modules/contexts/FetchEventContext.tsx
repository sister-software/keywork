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
import { IsomorphicFetchEvent } from '../events/mod.ts'

export interface FetchEventContext {}

export const FetchEventContext = createContext<IsomorphicFetchEvent>(undefined as any)
FetchEventContext.displayName = 'FetchEventContext'

export function useFetchEvent() {
  return useContext(FetchEventContext)
}

interface FetchEventProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

export const FetchEventProvider: React.FC = ({ children }) => {
  return <FetchEventContext.Provider value={}>{children}</FetchEventContext.Provider>
}
