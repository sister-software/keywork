/**
 * :::info
 * While this module is used internally by Keywork, the functions are available for use.
 * :::
 *
 * @packageDocumentation
 * @module Keywork#Stream
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
 */
/* eslint-disable header/header */

import { polyfillWithModule } from 'keywork/__internal/functions/polyfillWithModule'

export type StreamExports = Pick<typeof globalThis, 'TransformStream' | 'ReadableStream' | 'WritableStream'>

/**
 * @internal
 */
export function polyfillStream() {
  return polyfillWithModule<StreamExports>('node:stream/web', ['TransformStream', 'ReadableStream', 'WritableStream'])
}
