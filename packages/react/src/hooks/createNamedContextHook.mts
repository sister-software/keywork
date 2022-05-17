import { Context, useContext } from 'react'

/**
 * A convenience helper that creates a hook for the child components within a Provider's context.
 *
 * @example This is especially useful when creating a Provider.
 *
 * ```tsx
 * export const WidgetsContext = createContext<WidgetsProvider | undefined>(undefined)
 * export const useWidgetsContext = createNamedContextHook(WidgetsContext)
 *
 * export const WidgetProvider: React.FC<WidgetProviderProps> = ({children}) => {
 *   // Always use a memoized value to prevent rerenders.
 *   const value = useMemo<WidgetsProvider>(
 *     () => ({
 *       // Some combination of props go here...
 *     }),
 *     [dep1, dep2, depN]
 *     )
 *
 *     return <HydrationContext.Provider value={value}>{children}</HydrationContext.Provider>
 *   }
 * ```
 * @param baseCtx
 * @returns
 */
export function createNamedContextHook<C>(baseCtx: Context<C>): () => NonNullable<C> {
  const displayName = baseCtx.displayName || baseCtx.Provider.name

  const useNamedContextHook = () => {
    const val = useContext(baseCtx)

    if (!val) {
      throw new Error(`Context Provider not found: ${displayName}`)
    }

    return val as NonNullable<C>
  }

  return useNamedContextHook
}
