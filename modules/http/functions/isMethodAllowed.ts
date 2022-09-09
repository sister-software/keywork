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

import { HTTPMethod } from '../types/mod.ts'

/**
 * Checks if the given method string is acceptable.
 *
 */
export function isMethodAllowed(
  givenMethod: string,
  allowedMethods: HTTPMethod | HTTPMethod[] | undefined
): givenMethod is HTTPMethod {
  if (givenMethod === '*') return true

  if (Array.isArray(allowedMethods)) {
    return allowedMethods.includes(givenMethod as HTTPMethod)
  }

  return givenMethod === allowedMethods
}
