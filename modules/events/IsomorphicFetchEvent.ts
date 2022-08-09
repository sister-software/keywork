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

import { AbstractFetchEvent, IsomorphicFetchEventInit } from './AbstractFetchEvent.ts'

/**
 * @ignore
 */
export const IsomorphicFetchEventObjectName = 'Keywork.IsomorphicFetchEvent'

/**
 * An event object containing contextual data for a single and specific incoming HTTP request.
 *
 * @remarks
 * Generally, this interface is exclusive to {@link KeyworkRouter#fetch}
 * and automatically passed to your subclass's route handlers.
 *
 * This is similar to `EventContext` defined in the `@cloudflare/workers-types` package.
 * However, the `IsomorphicFetchEvent` type includes additional information from `KeyworkRouter`.
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
export class IsomorphicFetchEvent<
  BoundAliases = {},
  ExpectedParams = {},
  Data extends {} = {}
> extends AbstractFetchEvent {
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
  public readonly env: BoundAliases

  /**
   * Optional extra data to be passed to a route handler.
   */
  public data: Data
  /**
   * URL Patterns matched.
   */
  public match?: URLPatternResult

  constructor(eventInit: IsomorphicFetchEventInit<BoundAliases, Data>) {
    super('fetch', eventInit)
    this.env = (eventInit.env || {}) as BoundAliases
    this.data = (eventInit.data || {}) as Data
    this.match = eventInit.match
  }

  /**
   * The names and values of dynamic parameters in the URL.
   * Parameters are parsed using the incoming request's URL and the route's pattern.
   */
  get params(): ExpectedParams {
    return (this.match?.pathname.groups || {}) as any as ExpectedParams
  }

  /**
   * Checks if the given object is an instance of `IsomorphicFetchEvent`
   * @param eventLike An object that's possibly a `IsomorphicFetchEvent`
   * @category Type Cast
   */
  public static assertIsInstanceOf(eventLike: unknown): eventLike is IsomorphicFetchEvent {
    return Boolean(
      eventLike instanceof IsomorphicFetchEvent ||
        (eventLike && typeof eventLike === 'object' && IsomorphicFetchEventObjectName in eventLike)
    )
  }
}
