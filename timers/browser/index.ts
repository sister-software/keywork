/**
 * Keywork includes promise-based utilities for working with the DOM.
 *
 * ### Browser
 *
 * #### `waitUntilDOMReady`
 *
 * Creates a promise that blocks until the DOM has loaded.
 *
 * ```ts
 * import { waitUntilDOMReady } from 'keywork/timers/browser'
 *
 * await waitUntilDOMReady()
 * ```
 *
 * #### `requestAnimationFramePromise`
 *
 * Promise wrapper around `requestAnimationFrame`
 *
 * ```ts
 * import { requestAnimationFrame } from 'keywork/timers/browser'
 *
 * await requestAnimationFrame()
 * ```
 *
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
 * @packageDocumentation
 * @module Keywork#TimerUtils#Browser
 */
/* eslint-disable header/header */

export * from 'keywork/timers/browser/functions'
