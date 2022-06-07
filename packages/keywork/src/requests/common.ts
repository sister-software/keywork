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

import { DefaultWorkerBindings } from '../bindings/index.js'
import type { KeyworkSession } from '../KeyworkSession.js'

/**
 * @internal
 */
export type _HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

export interface RequestWithCFProperties extends Request {
  cf: IncomingRequestCfProperties
}

/**
 * Data associated with the incoming request.
 */
export interface IncomingRequestData<BoundAliases extends {} | null = null> {
  /** The incoming request */
  readonly request: RequestWithCFProperties
  /** The incoming request URL object */
  readonly url: URL
  /** Any bound environment properties defined in your `wrangler.toml` file */
  readonly env: BoundAliases extends null ? DefaultWorkerBindings : BoundAliases & DefaultWorkerBindings
  /** An execution context for running async tasks after the response is sent. */
  readonly context: ExecutionContext
  /** @beta */
  readonly session: KeyworkSession
}

export type PossiblePromise<T> = T | Promise<T>
