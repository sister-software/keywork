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
import { Disposable } from '../__internal/interfaces/disposable.ts'
import { ResponseRef } from './ResponseContext.ts'

/**
 * A callback that may modify the current `Response`.
 */
export type ResponseEffectCallback = (response: ResponseRef) => void | Promise<void>

/**
 * A callback that may be used to cancel the effect.
 */
export type DisposeEffectCallback = () => void

/**
 * @internal
 */
export interface ResponseEffectQueueEntry {
  effectCallback: ResponseEffectCallback
  deps: React.DependencyList
}

/**
 * Server-equivalent of React's `useEffect` hook.
 */
export interface ResponseEffect {
  (effectCallback: ResponseEffectCallback, deps: React.DependencyList): void
}

/**
 * A React context that allows for the queueing of server-side effects to a `Response`.
 *
 * A response effect may be queued on the server with the `useResponseEffect` hook.
 * Each effect is executed in the order it was queued, and the response is updated
 * with the result of each effect.
 *
 * @internal
 */
export class ResponseEffectQueue implements Disposable {
  protected entries: ResponseEffectQueueEntry[] = []
  protected currentEffectIndex = 0

  /**
   * Adds a response effect if it has not already been queued.
   */
  public enqueue: ResponseEffect = (effectCallback, deps) => {
    const effectDefinedAtIndex = this.entries[this.currentEffectIndex]
    const depsAreEqual = Boolean(effectDefinedAtIndex && isEqual(effectDefinedAtIndex.deps, deps))

    if (!effectDefinedAtIndex || !depsAreEqual) {
      if (!depsAreEqual) {
        // If the dependencies have changed, subsequent effects
        // may be invalid. Remove them from the queue...
        this.entries = this.entries.slice(0, this.currentEffectIndex)
      }

      this.entries.push({ effectCallback, deps })
    }

    this.currentEffectIndex++
  }

  /**
   * Returns a promise that resolves when all queued tasks have completed.
   */
  public async applyEffects(responseRef: ResponseRef): Promise<void> {
    // Effects are executed in the order they were queued to prevent clobbering of
    // the response state.
    for (const entry of this.entries) {
      await entry.effectCallback(responseRef)
    }
    // Reset the queue.
    this.dispose()
  }

  public dispose() {
    this.currentEffectIndex = 0
    this.entries = []
  }

  public [Symbol.iterator]() {
    return this.entries[Symbol.iterator]()
  }
}

/**
 * A React context that defines the current response effect queue.
 * @internal
 */
export const ResponseEffectQueueContext = createContext<ResponseEffectQueue>(new ResponseEffectQueue())
ResponseEffectQueueContext.displayName = 'ResponseEffectQueueContext'

/**
 * A React hook that returns the server-side effect queue.
 * @internal
 */
export const useServerEffectQueue = () => {
  return React.useContext(ResponseEffectQueueContext)
}
