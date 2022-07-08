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

/**
 * Creates a promise that blocks until the DOM has loaded.
 * @public
 */
export function waitUntilDOMReady(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') {
      return reject('`document` is not defined. Was this method called on the server?')
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve())
    } else {
      resolve()
    }
  })
}

/**
 * Promise wrapper around `requestAnimationFrame`
 */
export function requestAnimationFramePromise(): Promise<number> {
  return new Promise<number>((resolve) => {
    const _requestAnimationFrame = (globalThis as any).requestAnimationFrame

    if (!_requestAnimationFrame) {
      return resolve(-1)
    }

    const frameNumber = _requestAnimationFrame(() => {
      resolve(frameNumber)
    })
  })
}
