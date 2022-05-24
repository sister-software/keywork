import React from 'react'
import { HelmetData } from '../components/helmet/types.js'
import { createContextAndNamedHook } from '../hooks/createNamedContextHook.js'

export interface KeyworkHeadProviderProps {
  helmetData: HelmetData
  children: React.ReactNode
}

export interface KeyworkHeadProvider {}

const [KeyworkHeadContext, useKeyworkHead] = createContextAndNamedHook<HelmetData>()
export { useKeyworkHead }

export const KeyworkHeadProvider: React.FC<KeyworkHeadProviderProps> = ({ helmetData, children }) => {
  return <KeyworkHeadContext.Provider value={helmetData}>{children}</KeyworkHeadContext.Provider>
}
