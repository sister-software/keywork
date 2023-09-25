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

import type { Disposable } from 'keywork/__internal/interfaces/disposable'
import { KeyworkResourceError, Status } from 'keywork/errors'

const kWaitUntil = Symbol('kWaitUntil')

/**
 * Extends the lifetime of the `install` and `activate` events dispatched
 * on the global scope as part of the service worker lifecycle.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent ExtendableEvent on MDN}
 * @see {@link https://developers.cloudflare.com/workers/runtime-apis/fetch-event/ Cloudflare Documentation}
 */
export class IsomorphicExtendableEvent extends Event implements Disposable {
  private [kWaitUntil]: Promise<unknown>[] = []

  /**
   * Extends the lifetime of the route handler, even after a `Response` is sent to a client.
   */
  public waitUntil(
    this: IsomorphicExtendableEvent,
    /**
     * An asynchronous task, _that until completion_, will prevent the Workers runtime
     * from immediately terminating when a `Response` has been sent to the client.
     */
    nonBlockingTask: Promise<any>
  ): void {
    if (!(this instanceof IsomorphicExtendableEvent)) {
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
  public async flushTasks(this: IsomorphicExtendableEvent): Promise<void> {
    await Promise.all(this[kWaitUntil])

    this[kWaitUntil] = []
  }

  public dispose() {
    this[kWaitUntil] = []
  }
}

/**
 * @internal
 */
export function isExtendableEvent(eventLike: unknown): eventLike is IsomorphicExtendableEvent {
  return Boolean(eventLike && typeof eventLike === 'object' && 'waitUntil' in eventLike)
}
