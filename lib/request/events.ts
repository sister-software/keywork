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

import type { KeyworkSession } from 'keywork/session'
import type { PathMatch } from 'keywork/uri'
import HTTP from 'keywork/platform/http'
import { CloudflareFetchEvent } from './cloudflare/index.ts'

/**
 * Additional data associated with the `IncomingRequestEvent`.
 *
 * @category Request
 * @public
 */
// deno-lint-ignore no-empty-interface
export interface IncomingRequestEventData extends Record<string, unknown> {}

/**
 * @ignore
 */
export const IncomingRequestEventObjectName = 'Keywork.IncomingRequestEvent'

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
  request: globalThis.Request

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
  readonly runtimeFetchEvent: CloudflareFetchEvent

  /**
   * The bound environment aliases, usually defined in your wrangler.toml file.
   */
  readonly env: BoundAliases

  /**
   * Optional extra data to be passed to a route handler.
   */
  data: Data
}

/**
 * Checks if the given object is an instance of `IncomingRequestEvent`
 * @param eventLike An object that's possibly a `IncomingRequestEvent`
 * @category Type Cast
 */
export function isIncomingRequestEvent(eventLike: unknown): eventLike is IncomingRequestEvent {
  return Boolean(eventLike && typeof eventLike === 'object' && IncomingRequestEventObjectName in eventLike)
}

/**
 * Checks if the given object is an instance of `Request`
 * @param requestish An object that's possibly a `Request`
 * @category Type Cast
 */
export function isInstanceOfRequest(requestish: unknown): requestish is globalThis.Request {
  return Boolean(requestish instanceof globalThis.Request || requestish instanceof HTTP.Request)
}
