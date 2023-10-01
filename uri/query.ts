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

/**
 * A boolean-like query param that hints to the worker that client-side React
 * only needs the static props for an upcoming page transition.
 */
export const KEYWORK_STATIC_PROPS_QUERY_KEY = 'static-props'

/**
 * Predicate to determine if a URL is a static props request.
 */
export function isStaticPropsRequestURL(url: URL | string): boolean {
  if (typeof url === 'string') {
    url = new URL(url)
  }

  return url.searchParams.has(KEYWORK_STATIC_PROPS_QUERY_KEY)
}
