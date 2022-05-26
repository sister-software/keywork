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

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

export interface RequestWithCFProperties extends Request {
  cf: IncomingRequestCfProperties
}

/**
 * Data associated with the incoming request.
 */
export interface IncomingRequestData<BoundAliases extends {} | null = null> {
  readonly request: RequestWithCFProperties
  readonly env: BoundAliases extends null ? DefaultWorkerBindings : BoundAliases & DefaultWorkerBindings
  readonly context: ExecutionContext
  readonly session: KeyworkSession
}

/**
 * An incoming request handler.
 * @remarks Your implementation should always return a response. Long running
 * @remarks The optional `ForcedParams` generic type is defined at compile time, but you must supply them.
 * @remarks Always attempt to handle runtime errors gracefully, and respond with `ErrorResponse` when necessary.
 *
 */
export type IncomingRequestHandler<BoundAliases extends {} | null = null, AdditionalData extends {} | null = null> = (
  /** Data parsed from the incoming request. */
  data: IncomingRequestData<BoundAliases>,
  /**
   * An optional argument for sending additional data to the handler.
   * This can be useful when a handler is invoked manually.
   */
  additionalData?: AdditionalData
) => Response | Promise<Response>
