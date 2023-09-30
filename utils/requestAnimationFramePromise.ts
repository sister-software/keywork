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

import { readGlobalScope } from './globals.js'

/** @internal */
type FrameRequestCallbackFn = (timestamp: number) => unknown

/** @internal */
type RequestAnimationFrameFn = (callback: FrameRequestCallbackFn) => number

/** @internal */
interface AnimationFramer {
  requestAnimationFrame: RequestAnimationFrameFn
}

/**
 * Predicate function to determine if the given object can invoke `requestAnimationFrame`
 * @internal
 */
export function isAnimationFramer(windowOrGlobal: any = readGlobalScope()): windowOrGlobal is AnimationFramer {
  return typeof windowOrGlobal.requestAnimationFrame === 'function'
}

/**
 * Promise wrapper around `requestAnimationFrame`
 */
export function requestAnimationFramePromise(windowOrGlobal: any = readGlobalScope()): Promise<number> {
  return new Promise<number>((resolve) => {
    if (!isAnimationFramer(windowOrGlobal)) {
      setTimeout(() => resolve(-1), 1)
      return
    }

    const frameNumber = windowOrGlobal.requestAnimationFrame(() => {
      resolve(frameNumber)
    })
  })
}
