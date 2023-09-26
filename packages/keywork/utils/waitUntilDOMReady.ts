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

import { readGlobalScope } from 'keywork/utils'

/**
 * A purpose-built type for the `document` global.
 * Useful for type-checking without including the DOM typings.
 * @internal
 */
interface DocumentLike extends EventTarget {
  readyState: 'loading' | 'interactive' | 'complete'
}

interface DocumentOwner {
  document: DocumentLike
}

/**
 * Predicate function to determine if the given object includes a `document` instance.
 * @internal
 */
export function isDocumentOwner(windowOrGlobal: any = readGlobalScope()): windowOrGlobal is DocumentOwner {
  return windowOrGlobal && typeof windowOrGlobal === 'object' && 'document' in windowOrGlobal
}

/**
 * Creates a promise that blocks until the DOM has loaded.
 *
 * ```js
 *
 * function initialize() {
 *  // ...
 * }
 *
 * waitUntilDOMReady().then(initialize)
 * ```
 *
 * @public
 */
export function waitUntilDOMReady(windowOrGlobal: any = readGlobalScope()): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!isDocumentOwner(windowOrGlobal)) {
      return reject('`document` is not defined. Was this method called on the server?')
    }

    if (windowOrGlobal.document.readyState === 'loading') {
      windowOrGlobal.document.addEventListener('DOMContentLoaded', () => resolve())
    } else {
      resolve()
    }
  })
}
