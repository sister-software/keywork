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

import { createContext, useContext } from 'react'

/**
 * Context for consuming the current location.
 * This is the URL of the current page and should be used
 * when hydrating the application.
 *
 * @see {KeyworkApp}
 * @internal
 */
export const LocationContext = createContext<URL>(undefined as any)
LocationContext.displayName = 'LocationContext'

/**
 * Hook for consuming the current location during hydration.
 * @internal
 */
export function useLocation() {
  return useContext(LocationContext)
}
