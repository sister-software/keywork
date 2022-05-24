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
 * @remark Your implementation should always return a response. Long running
 * @remark The optional `ForcedParams` generic type is defined at compile time, but you must supply them.
 * @remark Always attempt to handle runtime errors gracefully, and respond with `ErrorResponse` when necessary.
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
