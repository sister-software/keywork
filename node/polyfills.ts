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
import { polyfillWithModule } from 'keywork/utils'
import type { Headers, Request, Response } from 'undici'

type HTTPModule = {
  Request: Request
  Headers: Headers
  Response: Response
}

type StreamExports = Pick<typeof globalThis, 'TransformStream' | 'ReadableStream' | 'WritableStream'>

let hasAppliedPolyfills = false

/**
 * Applies polyfills for Node.js APIs that are not available in Cloudflare Workers.
 * @internal
 */
export async function applyNodeKeyworkPolyfills() {
  if (hasAppliedPolyfills) return

  await polyfillWithModule('urlpattern-polyfill', ['URLPattern'])
  await polyfillWithModule<HTTPModule>('undici', ['Request', 'Headers', 'Response'])
  await polyfillWithModule<StreamExports>('node:stream/web', ['TransformStream', 'ReadableStream', 'WritableStream'])

  hasAppliedPolyfills = true
}
