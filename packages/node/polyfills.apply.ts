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
import { polyfillWithModule } from 'keywork'
import type { Headers, Request, Response } from 'undici'

await polyfillWithModule('urlpattern-polyfill', ['URLPattern'])

type HTTPModule = {
  Request: Request
  Headers: Headers
  Response: Response
}

await polyfillWithModule<HTTPModule>('undici', ['Request', 'Headers', 'Response'])

type StreamExports = Pick<typeof globalThis, 'TransformStream' | 'ReadableStream' | 'WritableStream'>

await polyfillWithModule<StreamExports>('node:stream/web', ['TransformStream', 'ReadableStream', 'WritableStream'])
