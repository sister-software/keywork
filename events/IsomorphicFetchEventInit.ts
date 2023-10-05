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

import type { IURLPattern, URLPatternResult } from 'keywork/uri'
import type { SSRDocument } from './SSRDocument.js'

/**
 * @internal
 */
export interface IsomorphicFetchEventInit<BoundAliases = {}, Data = {}> {
  /**
   * The incoming request received by the Keywork router.
   *
   * Both the request's `url` property and the parent `IsomorphicFetchEvent` will reflect
   * the current parsed route handler of `RequestRouter`.
   * @see {IsomorphicFetchEvent#originalURL}
   */
  request?: Request

  originalURL: string

  env?: BoundAliases
  data?: Data

  match?: URLPatternResult

  urlPattern?: IURLPattern

  waitUntil?(promise: Promise<any>): void
  passThroughOnException?(): void
  document?: SSRDocument
}
