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

import { IURLPattern, type URLPatternResult } from 'keywork/uri'
import { createContext, useContext } from 'react'

/**
 * Context for injecting a URL pattern.
 *
 * @internal
 */
export const URLPatternContext = createContext<IURLPattern>(undefined as any)
URLPatternContext.displayName = 'URLPatternContext'

/**
 * Context for URL matching.
 *
 * This is the result of matching the current URL against a URL pattern.
 *
 * @internal
 */
export const URLPatternResultContext = createContext<URLPatternResult>(undefined as any)
URLPatternResultContext.displayName = 'URLMatchContext'

/**
 * Hook for URL matching.
 * @returns The URL pattern result.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URLPatternResult
 */
export function useURLPatternResult() {
  return useContext(URLPatternResultContext)
}

/**
 * Hook for consuming the matched URL parameters.
 * @returns The URL parameters.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URLPatternResult/parameters
 */
export function useParams<ExpectedParams = Record<string, string>>() {
  const match = useURLPatternResult()
  return match.pathname.groups as unknown as ExpectedParams
}
