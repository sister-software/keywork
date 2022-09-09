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

import { RequestMiddleware } from './RequestMiddleware.ts'

/**
 * Middleware declaration in shape compatible with the `Map` constructor.
 *
 * @typeParam PathPatternPrefix A path prefix defining where the middleware should be mounted. Combines with the given router's routes.
 *
 * @internal
 */
export type MiddlewareDeclaration<PathPatternPrefix extends string = string> = readonly [
  PathPatternPrefix,
  RequestMiddleware<any>
]
