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
import { ExecutionContext } from 'keywork/http/request/cloudflare'
import { ExtendableEvent } from './common.ts'

/**
 * Additional data associated with the `IncomingRequestEvent`.
 *
 * @category Request
 * @public
 */
export interface IncomingRequestEventData extends Record<string, unknown> {
  /**
   * The original URL associated with the `IncomingRequestEvent`.
   */
  session?: KeyworkSession
}

/**
 * @ignore
 */
export const IncomingRequestEventObjectName = 'Keywork.IncomingRequestEvent'

/**
 * ### `keywork/http/request/cloudflare`
 *
 * Request utilities exclusive to Cloudflare Workers
 *
 * @packageDocumentation
 * @module request.cloudflare
 */

/**
 * An event object containing contextual data for a single and specific incoming HTTP request.
 *
 * @remarks
 * Generally, this interface is exclusive to {@link KeyworkRouter#fetch}
 * and automatically passed to your subclass's route handlers.
 *
 * This is similar to `EventContext` defined in the `@cloudflare/workers-types` package.
 * However, the `IncomingRequestEvent` type includes additional information from `KeyworkRouter`.
 *
 * ### Caveats
 *
 * - The `request.url` property will be updated by route handler of `KeyworkRouter`.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam ExpectedParams URL parameters parsed from the incoming request's URL and the route's pattern.
 * @typeParam Data Optional extra data to be passed to a route handler.
 *
 * @category Request
 *
 * @public
 * An approximate implementation of Cloudflare's Fetch event,
 *
 * @see {@link https://miniflare.dev/core/fetch Miniflare's Fetch Documentation}
 * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event Cloudflare's API Reference}
 *
 */
export class IncomingRequestEvent<
  BoundAliases = {},
  ExpectedParams = {},
  Data extends {} = {}
> extends ExtendableEvent {
  /**
   * The original URL associated with the `IncomingRequestEvent`.
   */
  public originalURL: string

  constructor(
    /**
     * The incoming request received by the Worker.
     *
     * @remarks
     * Both the request's `url` property and the parent `IncomingRequestEvent` will reflect
     * the current parsed route handler of `KeyworkRouter`.
     * @see {IncomingRequestEvent#originalURL}
     */
    public request: globalThis.Request,

    /**
     * The bound environment aliases.
     *
     * #### Cloudflare Workers
     * These are usually defined in your wrangler.toml file.
     *
     * #### Node.js
     * This is similar to `process.env`.
     *
     */
    readonly env: BoundAliases = {} as BoundAliases,

    /**
     * Optional extra data to be passed to a route handler.
     */
    public data: Data = {} as Data,
    /**
     * The names and values of dynamic parameters in the URL.
     * Parameters are parsed using the incoming request's URL and the route's pattern.
     */
    public params: ExpectedParams = {} as ExpectedParams,
    public match?: URLPatternResult
  ) {
    super('fetch')
    this.originalURL = request.url
  }

  /**
   * Checks if the given object is an instance of `IncomingRequestEvent`
   * @param eventLike An object that's possibly a `IncomingRequestEvent`
   * @category Type Cast
   */
  public static assertIsInstanceOf(eventLike: unknown): eventLike is IncomingRequestEvent {
    return Boolean(
      eventLike instanceof IncomingRequestEvent ||
        (eventLike && typeof eventLike === 'object' && IncomingRequestEventObjectName in eventLike)
    )
  }

  public static fromCloudflareWorker<BoundAliases = {}, ExpectedParams = {}, Data extends {} = {}>(
    executionContext: ExecutionContext,
    request: globalThis.Request,
    env: BoundAliases = {} as BoundAliases
  ) {
    const event = new IncomingRequestEvent<BoundAliases, ExpectedParams, Data>(request, env)
    event.waitUntil = executionContext.waitUntil

    return event
  }
}
