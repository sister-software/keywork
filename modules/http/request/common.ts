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

import HTTP from 'keywork/http'
import { KeyworkResourceError, Status } from 'keywork/errors'
import type { Disposable } from 'keywork/utilities'

/**
 * Checks if the given object is an instance of `Request`
 * @param requestish An object that's possibly a `Request`
 * @category Type Cast
 */
export function isInstanceOfRequest(requestish: unknown): requestish is globalThis.Request {
  return Boolean(requestish instanceof globalThis.Request || requestish instanceof HTTP.Request)
}

const kWaitUntil = Symbol('kWaitUntil')

/**
 *
 * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event/ Cloudflare Documentation}
 */
export class ExtendableEvent extends Event implements Disposable {
  private [kWaitUntil]: Promise<unknown>[] = []

  /**
   * Extends the lifetime of the route handler, even after a `Response` is sent to a client.
   */
  public waitUntil(
    this: ExtendableEvent,
    /**
     * An asynchronous task, _that until completion_, will prevent the Workers runtime
     * from immediately terminating when a `Response` has been sent to the client.
     */
    nonBlockingTask: Promise<any>
  ): void {
    if (!(this instanceof ExtendableEvent)) {
      throw new KeyworkResourceError(
        '`waitUntil` must be invoked as a member of `ExtendableEvent`',
        Status.InternalServerError
      )
    }

    this[kWaitUntil].push(Promise.resolve(nonBlockingTask))
  }

  /**
   * Awaits all tasks remaining in the queue.
   */
  public async flushTasks(this: ExtendableEvent): Promise<void> {
    await Promise.all(this[kWaitUntil])

    this[kWaitUntil] = []
  }

  public dispose() {
    this[kWaitUntil] = []
  }
}
