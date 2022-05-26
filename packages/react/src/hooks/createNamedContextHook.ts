import { createContext, useContext } from 'react'

/**
 * A convenience wrapper around `React.createContext` that creates a context and hook for the child components within a Provider's context.
 *
 * @example <caption>Creating a named context Provider with a computed value.</caption>
 *           ```tsx
 *           const [WidgetsContext, useWidgetsContext] = createNamedContextHook<WidgetsProvider>()
 *           // Note that the `WidgetsContext` is not exported if the provider needs additional logic.
 *           export { useWidgetsContext }
 *
 *           // Instead, a component is declared to pass down a computed value.
 *           export const WidgetProvider: React.FC<WidgetProviderProps> = ({children}) => {
 *             // Always use a memoized value to prevent rerenders.
 *             const value = useMemo<WidgetsProvider>(
 *               () => ({
 *                 // Some combination of props go here...
 *               }),
 *               [dep1, dep2, depN]
 *               )
 *
 *               return <WidgetsContext.Provider value={value}>{children}</WidgetsContext.Provider>
 *             }
 * ```
 * @param defaultValue
 * @returns {[React.Context<T | undefined>, () => NonNullable<T>]} contextTuple
 */
export function createContextAndNamedHook<T>(
  /** The initial computed value, usually left as `undefined` */
  defaultValue: T | undefined = undefined,
  /** An optional display name for debugging. This is somewhat inferred from the Context's name. */
  displayName?: string
): readonly [React.Context<T | undefined>, <V = T>() => NonNullable<V>] {
  const Context = createContext<T | undefined>(defaultValue)
  const _displayName = displayName || Context.displayName || Context.Provider.name || 'Unknown'

  const useNamedContextHook = <V = T>() => {
    const val = useContext(Context)

    if (!val) {
      throw new Error(`Context Provider not found: ${_displayName}`)
    }

    return val as unknown as NonNullable<V>
  }

  const contextTuple = [Context, useNamedContextHook] as const

  return contextTuple
}
