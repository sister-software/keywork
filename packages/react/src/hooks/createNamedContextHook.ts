import { createContext, useContext } from 'react'

/**
 * A convenience wrapper around `React.createContext` that creates a context and hook for the child components within a Provider's context.
 *
 * @example This is especially useful when creating a Provider.
 *
 * ```tsx
 * const [WidgetsContext, useWidgetsContext] = createNamedContextHook<WidgetsProvider>()
 * export { useWidgetsContext }
 *
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
 * @param defaultValue
 * @returns {[React.Context<T | undefined>, () => NonNullable<T>]} contextTuple
 */
export function createContextAndNamedHook<T>(
  defaultValue: T | undefined = undefined,
  displayName?: string
): readonly [React.Context<T | undefined>, () => NonNullable<T>] {
  const Context = createContext<T | undefined>(defaultValue)
  const _displayName = displayName || Context.displayName || Context.Provider.name

  const useNamedContextHook = () => {
    const val = useContext(Context)

    if (!val) {
      throw new Error(`Context Provider not found: ${_displayName}`)
    }

    return val as NonNullable<T>
  }

  const contextTuple = [Context, useNamedContextHook] as const

  return contextTuple
}
