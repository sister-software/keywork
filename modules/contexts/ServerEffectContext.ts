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

import isEqual from 'https://esm.sh/lodash.isequal@4.5.0'
import React, { createContext } from 'https://esm.sh/react@18.2.0'
import { SetStateLike } from '../hooks/types.ts'
import { Disposable } from '../__internal/interfaces/disposable.ts'
import { ResponseRef, ResponseStateMethods } from './ResponseContext.tsx'

export type ServerEffectCallback = (response: ResponseStateMethods) => void | Promise<void>

export interface ServerEffectQueueEntry {
  deps: React.DependencyList
  task: ServerEffectCallback
}

/**
 * Server-equivalent of React's `useEffect` hook.
 */
export interface UseServerEffect {
  (queueTask: ServerEffectCallback, deps: React.DependencyList): void
}

/**
 * A React context that allows for the queueing of server-side effects.
 * @internal
 */
export class ServerEffectQueue implements ResponseRef, Disposable {
  protected entries: ServerEffectQueueEntry[] = []
  protected queueIndex = 0
  public response = new Response()

  setHeader: SetStateLike<Headers> = (value) => {
    const { body, status, statusText, headers } = this.response

    this.response = new Response(body, {
      headers: typeof value === 'function' ? value(headers) : value,
      status,
      statusText,
    })
  }

  setStatus: SetStateLike<number | undefined> = (value) => {
    const { body, status, statusText, headers } = this.response

    this.response = new Response(body, {
      headers,
      status: typeof value === 'function' ? value(status) : value,
      statusText,
    })
  }

  setStatusText: SetStateLike<string | undefined> = (value) => {
    const { body, status, statusText, headers } = this.response

    this.response = new Response(body, {
      headers,
      status,
      statusText: typeof value === 'function' ? value(statusText) : value,
    })
  }

  setBody: SetStateLike<BodyInit | null | undefined> = async (value) => {
    this.response = new Response(typeof value === 'function' ? value(this.response.body) : value, this.response)
  }

  setResponse: SetStateLike<Response> = (value) => {
    this.response = typeof value === 'function' ? value(this.response) : value
  }

  /**
   * Returns a `useServerEffect` hook bound to this queue.
   */
  public enqueue: UseServerEffect = (queueTask: ServerEffectCallback, deps: React.DependencyList) => {
    const queueEntry = this.entries[this.queueIndex]

    // Has the queue entry been inserted at this index yet? Have the deps changed?
    if (!queueEntry || isEqual(queueEntry.deps, deps)) {
      // Insert the queue entry at this index.

      this.entries[this.queueIndex] = {
        deps,
        task: typeof queueTask === 'function' ? queueTask : () => queueTask,
      }

      this.queueIndex += 1
    }
  }

  /**
   * Returns a promise that resolves when all queued tasks have completed.
   */
  public resolve() {
    return Promise.all(this.entries.map((entry) => entry.task))
  }

  public resetIndex(): void {
    this.queueIndex = 0
  }

  public dispose() {
    this.queueIndex = 0
    this.entries = []
  }

  public [Symbol.iterator]() {
    return this.entries[Symbol.iterator]()
  }
}

/**
 * A React context that allows for the queueing of server-side effects.
 * @internal
 */
export const ServerEffectQueueContext = createContext<ServerEffectQueue>(undefined as any)
ServerEffectQueueContext.displayName = 'ServerEffectQueueContext'

/**
 * A React hook that returns the server-side effect queue.
 * @internal
 */
export const useServerEffectQueue = () => {
  return React.useContext(ServerEffectQueueContext)
}

/**
 * Imperative function that can run server-side effects.
 */
export const useServerEffect: UseServerEffect = (queueTask, deps) => {
  const serverEffectQueue = React.useContext(ServerEffectQueueContext)

  serverEffectQueue.enqueue(queueTask, deps)
}
