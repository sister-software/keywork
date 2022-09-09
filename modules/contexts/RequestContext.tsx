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
 * Context for consuming the current request.
 */
export const RequestContext = createContext<Request>(undefined as any)

RequestContext.displayName = 'RequestContext'

/**
 * Hook for consuming the current request.
 */
export function useRequest() {
  return useContext(RequestContext)
}
