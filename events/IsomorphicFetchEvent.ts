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

import { KeyworkResourceError, Status } from 'keywork/errors'
import { normalizeURLPattern, type IURLPattern, type URLPatternResult } from 'keywork/uri'
import { IsomorphicExtendableEvent } from './IsomorphicExtendableEvent.js'
import { IsomorphicFetchEventInit } from './IsomorphicFetchEventInit.js'
import { SSRDocument } from './SSRDocument.js'

/**
 * Represents an event dispatched when a network request is made.
 *
 * Keywork uses `IsomorphicFetchEvent` as a context object for each incoming request made to a `RequestRouter`.
 * You can use this object to access the incoming request, the environment variables, and the data passed to the Worker.
 *
 * Generally, `IsomorphicFetchEvent` should not be instantiated directly,
 * but rather is automatically created by the `RequestRouter` when a request is received.
 */
export class IsomorphicFetchEvent<BoundAliases = {}, ExpectedParams = {}, Data = {}>
  extends IsomorphicExtendableEvent
  implements EventInit
{
  readonly clientId!: string
  readonly resultingClientId!: string
  readonly handled!: Promise<undefined>
  readonly preloadResponse!: Promise<any>

  env: BoundAliases
  data: Data
  /**
   * A server-side representation of the HTML document to be rendered.
   *
   * This is useful when you need to inject data into the document's `<head>` element.
   */
  document: SSRDocument
  params: ExpectedParams

  /**
   * The result of the URL pattern match from the `RequestRouter`.
   */
  match: URLPatternResult

  /**
   * The URL pattern used to match the incoming request.
   */
  urlPattern: IURLPattern

  /**
   * The incoming request received by the Worker.
   */
  public request!: Request

  /**
   * The original URL of the request.
   */
  originalURL: string
  constructor(
    eventType = 'fetch',
    { request, env, data, originalURL, match, urlPattern, document }: IsomorphicFetchEventInit<BoundAliases, Data>
  ) {
    super(eventType)
    this.originalURL = originalURL
    this.request = request || new Request(originalURL)
    this.env = env || ({} as BoundAliases)
    this.data = data || ({} as Data)
    this.match = match || ({} as URLPatternResult)
    this.urlPattern = urlPattern || normalizeURLPattern(new URL(originalURL))
    this.params = (match ? match.pathname.groups : {}) as unknown as ExpectedParams
    this.document = document || {}
  }

  /**
   * Intercepts the request and allows the Worker to send a custom response.
   *
   * @deprecated The `respondWith` method is only applicable to Service Workers.
   *
   * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#respondwith Cloudflare Documentation}
   */
  respondWith(_response: Response): void {
    throw new KeyworkResourceError(
      'The `respondWith` method is only applicable to Service Workers',
      Status.InternalServerError
    )
  }

  /**
   * Prevents a runtime error response when the Worker script throws an unhandled exception.
   *
   * @deprecated The `passThroughOnException` method is only applicable to Service Workers
   *
   * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#passthroughonexception Cloudflare Documentation}
   */
  passThroughOnException(): void {
    throw new KeyworkResourceError(
      'The `passThroughOnException` method is only applicable to Service Workers',
      Status.InternalServerError
    )
  }

  public toJSON(): IsomorphicFetchEventInit<BoundAliases, Data> {
    return {
      originalURL: this.originalURL,
      match: this.match,
    }
  }
}
