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

import { KeyworkResourceError } from 'keywork/errors'
import { KEYWORK_APP_ROOT, readGlobalScope } from 'keywork/utils'

/// <reference lib="dom" />

interface DocumentOwner {
  document: Document
}

/**
 * Predicate function to determine if the given object includes a `document` instance.
 * @internal
 */
export function isDocumentOwner(windowOrGlobal: any = readGlobalScope()): windowOrGlobal is DocumentOwner {
  return windowOrGlobal && typeof windowOrGlobal === 'object' && 'document' in windowOrGlobal
}

interface NavigatorOwner {
  location: Location
}

/**
 * Predicate function to determine if the given object includes a `document` instance.
 * @internal
 */
export function isNavigatorOwner(windowOrGlobal: any = readGlobalScope()): windowOrGlobal is NavigatorOwner {
  return windowOrGlobal && typeof windowOrGlobal === 'object' && 'location' in windowOrGlobal
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

/**
 * Plucks the hydration element from the DOM.
 * This is usually inserted via the `KeyworkHTMLDocument` component.
 *
 * @internal
 */
export function pluckKeyworkHydrationElement(windowOrGlobal: any = readGlobalScope()) {
  if (!isDocumentOwner(windowOrGlobal)) {
    throw new KeyworkResourceError('`document` is not defined. Was this method called on the server?')
  }

  const keyworkAppRoot = windowOrGlobal.document.getElementById(KEYWORK_APP_ROOT)
  if (!keyworkAppRoot) throw new Error(`Element with ID ${KEYWORK_APP_ROOT} not found in DOM`)

  return keyworkAppRoot
}

/**
 * Plucks the current location from the DOM.
 *
 * @internal
 */
export function pluckNavigatorURL(windowOrGlobal: any = readGlobalScope()): URL {
  if (!isNavigatorOwner(windowOrGlobal)) {
    throw new KeyworkResourceError('`document` is not defined. Was this method called on the server?')
  }

  return new URL(windowOrGlobal.location.toString())
}
