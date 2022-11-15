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
import { ResponseRef } from './ResponseContext.ts'
import { ResponseEffectQueue } from './ResponseEffectQueue.ts'

/**
 * A context for sharing a server effect queue pool.
 */
export class MiddlewareStack implements Disposable {
  protected responseRef = new ResponseRef()
  protected responseEffectQueues: ResponseEffectQueue[] = []
  protected poolIndex = 0

  public [Symbol.iterator]() {
    return this.responseEffectQueues[Symbol.iterator]()
  }

  /**
   *
   */
  public push(newEntry: ResponseEffectQueue): ResponseEffectQueue {
    if (this.responseEffectQueues[this.poolIndex]) {
      return this.responseEffectQueues[this.poolIndex]
    }

    this.responseEffectQueues[this.poolIndex] = newEntry

    this.poolIndex++
    return newEntry
  }

  public async resolveQueues(): Promise<void> {
    for (const entry of this.responseEffectQueues) {
      await entry.applyEffects(this.responseRef)
    }
  }

  public resetIndex(): void {
    this.poolIndex = 0
  }

  public dispose(): void {
    this.responseEffectQueues = []
    this.poolIndex = 0
  }
}

export const MiddlewareStackContext = createContext<MiddlewareStack>(undefined as any)
MiddlewareStackContext.displayName = 'MiddlewareStackContext'

export type MiddlewareNext = () => Response | Promise<Response>
export type MiddlewareCallback = (next: MiddlewareNext) => Promise<Response>

// // TODO: It's likely a response
export const useMiddleware = (callback: MiddlewareCallback): ResponseEffectQueue => {
  const currentMiddlewareStack = useContext(MiddlewareStackContext)
  const serverResponseState = new ResponseEffectQueue()
  serverResponseState.enqueue(callback)

  const nextServerEffectQueue = currentMiddlewareStack.push(serverResponseState)

  // const response = await middlewareCallback(next)

  return nextServerEffectQueue
}
