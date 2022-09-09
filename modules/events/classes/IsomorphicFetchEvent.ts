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

import { KeyworkResourceError, Status } from '../../errors/mod.ts'
import { IsomorphicFetchEventInit } from '../interfaces/mod.ts'
import { IsomorphicExtendableEvent } from './IsomorphicExtendableEvent.ts'

/**
 * @ignore
 */
export class IsomorphicFetchEvent extends IsomorphicExtendableEvent implements EventInit {
  readonly clientId!: string
  readonly resultingClientId!: string
  readonly handled!: Promise<undefined>
  readonly preloadResponse!: Promise<any>

  /**
   * The incoming request received by the Worker.
   */
  public request!: Request

  constructor(eventType = 'fetch', { request }: IsomorphicFetchEventInit) {
    super(eventType)
    this.request = request
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
}
