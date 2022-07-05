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

import type { KeyworkSession } from 'keywork/sessions'
import { PathMatch } from '../uri/common.js'
import type { MiddlewareFetch } from './middleware.js'

/**
 * The incoming request received by the Worker.
 *
 * @remarks
 * Comments via Cloudflare:
 * >In addition to the properties on the standard Request object,
 * >the cf object contains extra information about the request provided by Cloudflare's edge.
 *
 * @category Request
 * @public
 */
export interface RequestWithCFProperties extends Request {
  cf?: IncomingRequestCfProperties
}

/**
 * Additional data associated with the `IncomingRequestEvent`.
 *
 * @category Request
 * @public
 */
export interface IncomingRequestEventData extends Record<string, unknown> {}

/**
 * An event object containing contextual data for a single and specific incoming HTTP request.
 *
 * @remarks
 * Generally, this interface is exclusive to {@link WorkerRouter#fetch}
 * and automatically passed to your subclass's route handlers.
 *
 * This is similar to `EventContext` defined in the `@cloudflare/workers-types` package.
 * However, the `IncomingRequestEvent` type includes additional information from `WorkerRouter`.
 *
 * ### Caveats
 *
 * - The `request.url` property will be updated by route handler of `WorkerRouter`.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam ExpectedParams URL parameters parsed from the incoming request's URL and the route's pattern.
 * @typeParam Data Optional extra data to be passed to a route handler.
 *
 * @category Request
 *
 * @public
 */
export interface IncomingRequestEvent<
  BoundAliases extends {} | null = null,
  ExpectedParams extends {} | null = null,
  Data extends Record<string, unknown> = Record<string, unknown>
> extends PathMatch<ExpectedParams> {
  /**
   * The incoming request received by the Worker.
   *
   * @remarks
   * Both the request's `url` property and the parent `IncomingRequestEvent` will reflect
   * the current parsed route handler of `WorkerRouter`.
   * @see {IncomingRequestEvent#originalURL}
   */
  request: RequestWithCFProperties

  /**
   * The original URL associated with the `IncomingRequestEvent`.
   */
  originalURL: string

  /**
   * The original URL associated with the `IncomingRequestEvent`.
   */
  session: KeyworkSession | null

  /**
   * Extends the lifetime of the route handler even after a `Response` is sent to a client.
   */
  readonly waitUntil: (
    /**
     * The given promise argument will inform the Workers runtime to stay alive until the task completes.
     */
    nonBlockingTask: Promise<any>
  ) => void
  /**
   * When invoked, will execute a route handler defined after the current.
   *
   * @remarks
   * This is similar to Express.js Middleware.
   * Providing a request argument will override the path param parsing within `WorkerRouter`.
   */
  next: MiddlewareFetch
  readonly env: BoundAliases

  /**
   * Optional extra data to be passed to a route handler.
   */
  data: Data
}
