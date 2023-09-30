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

import { ImmutableMap } from 'keywork/utils'
import type { HTTPMethod } from './HTTPMethod.js'
import type { RouterMethod } from './RouterMethod.js'

/**
 * Given a standard uppercase HTTP method verb such as `GET`, return the router method name.
 */
export const methodVerbToRouterMethod = new ImmutableMap<HTTPMethod, RouterMethod>([
  ['GET', 'get'],
  ['POST', 'post'],
  ['PUT', 'put'],
  ['PATCH', 'patch'],
  ['DELETE', 'delete'],
  ['HEAD', 'head'],
  ['OPTIONS', 'options'],
  ['*', 'all'],
])
