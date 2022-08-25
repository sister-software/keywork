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

import { createContext, useContext } from 'https://esm.sh/react@18.2.0'

/**
 * A convenience wrapper around `React.createContext` that
 * creates a context and hook for the child components within a Provider's context.
 *
 * ### Creating a named context Provider with a computed value.
 *
 * ```tsx title=WidgetsProvider.tsx
 * const [WidgetsContext, useWidgetsContext] = createNamedContextHook<WidgetsProvider>()
 * // Note that the `WidgetsContext` is not exported if the provider needs additional logic.
 * export { useWidgetsContext }
 *
 * // Instead, a component is declared to pass down a computed value.
 * export const WidgetProvider: React.FC<WidgetProviderProps> = ({children}) => {
 *   // Always use a memoized value to prevent rerenders.
 *   // Some combination of props go here...
 *   const value = useMemo<WidgetsProvider>(() => ({}), [dep1, dep2, depN])
 *
 *   return <WidgetsContext.Provider value={value}>{children}</WidgetsContext.Provider>
 * }
 * ```
 * @returns contextTuple
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
