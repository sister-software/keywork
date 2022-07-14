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

import type { Request, Response } from 'keywork/platform/http'

/**
 * Middleware implementation of `fetch`
 *
 * This type is similar to `typeof fetch` with the option to return `null` to fallthrough.
 *
 * @category Request
 */
export type MiddlewareFetch = (
  /**
   * An optional override of the `Request` provided in the route handler's `IncomingRequestContext`
   */
  requestOrUrl?: Request | string,
  /**
   * An optional override of the `Request` provided in the route handler's `IncomingRequestContext`
   */
  requestInit?: RequestInit
) => (Response | null) | Promise<Response | null>
