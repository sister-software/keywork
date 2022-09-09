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

import type { ResponseLike } from '../../http/mod.ts'
import type { RequestRouter } from '../classes/RequestRouter.ts'
import type { FetchEventHandler, RequestHandler, WorkerServiceBinding } from '../interfaces/mod.ts'

/**
 * Keywork's [`RequestRouter`](https://keywork.app/modules/router/classes/RequestRouter) class
 * can respond to an incoming HTTP(S) request using either...
 *
 * - A function that implements the [`RequestHandler`](https://keywork.app/modules/router/interfaces/RequestHandler) interface.
 * - A class instance or object that implements the [`RouterLike`](https://keywork.app/modules/router/types/RouterLike) interface.
 *
 * [Keywork Router Module Documentation](https://keywork.app/modules/router)
 */
export type RequestMiddleware<
  BoundAliases = {},
  ExpectedParams = {},
  Data = {},
  ExpectedReturn extends ResponseLike = ResponseLike
> =
  | RequestHandler<BoundAliases, ExpectedParams, Data, ExpectedReturn>
  | WorkerServiceBinding
  | FetchEventHandler<BoundAliases>
  | RequestRouter<BoundAliases>

/**
 * @ignore
 */
export interface RequestResponseMapper<
  BoundAliases = {},
  ExpectedParams = {},
  Data = {},
  ExpectedReturn extends ResponseLike = ResponseLike
> {
  (
    ...args:
      | Parameters<FetchEventHandler<BoundAliases>>
      | Parameters<RequestHandler<BoundAliases, ExpectedParams, Data>>
  ): ExpectedReturn

  /**
   * A display name used for debugging and log messages.
   * @category Debug
   */
  displayName?: string
}
