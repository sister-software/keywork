import { Context, useContext } from 'react'

/**
 * Creates createContext
 * @param baseCtx
 * @returns
 */
export function createNamedContextHook<C>(baseCtx: Context<C>): () => NonNullable<C> {
  const displayName = baseCtx.displayName || baseCtx.Provider.name

  return () => {
    const val = useContext(baseCtx)

    if (!val) {
      throw new Error(`Context Provider not found: ${displayName}`)
    }

    return val as NonNullable<C>
  }
}
