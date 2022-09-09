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

import { createContext, useContext } from 'https://esm.sh/react@18.2.0'
import { Disposable } from '../__internal/interfaces/disposable.ts'
import { ResponseContext } from './ResponseContext.tsx'
import { ServerEffectQueue, useServerEffect } from './ServerEffectContext.ts'

/**
 * A context for sharing a server effect queue pool.
 */
export class MiddlewareStack implements Disposable {
  protected entries: ServerEffectQueue[] = []
  protected poolIndex = 0

  public [Symbol.iterator]() {
    return this.entries[Symbol.iterator]()
  }

  /**
   *
   */
  public push(newEntry: ServerEffectQueue): ServerEffectQueue {
    if (this.entries[this.poolIndex]) {
      return this.entries[this.poolIndex]
    }

    this.entries[this.poolIndex] = newEntry

    this.poolIndex++
    return newEntry
  }

  public async resolveQueues(): Promise<void> {
    for (const entry of this.entries) {
      entry.callback(next)
      await entry.queue.resolve()
    }
  }

  public resetIndex(): void {
    this.poolIndex = 0
  }

  public dispose(): void {
    this.entries = []
    this.poolIndex = 0
  }
}

export const EffectStackContext = createContext<MiddlewareStack>(undefined as any)
EffectStackContext.displayName = 'EffectStackContext'

export type MiddlewareNext = () => Response | Promise<Response>
export type MiddlewareCallback = (next: MiddlewareNext) => Promise<Response>

// TODO: It's likely a response
export const useMiddleware = (callback: MiddlewareCallback): ServerEffectQueue => {
  const stack = useContext(EffectStackContext)
  const queue = new ServerEffectQueue()
  const nextServerEffectQueue = stack.push({
    callback,
  })

  // useServerEffect
  // const response = await middlewareCallback(next)

  return nextServerEffectQueue
}
