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

/// <reference lib="WebWorker" />

import type { IncomingMessage } from 'node:http'
import { ReadableStream } from 'node:stream/web'

export function transformIncomingMessageToRequest(
  incomingMessage: IncomingMessage,
  host?: string,
  protocol?: string
): Request {
  const ctrl = new AbortController()
  const signal = ctrl.signal
  const _protocol = protocol || 'http'
  const _host = host || incomingMessage.headers.host || 'localhost'
  const _path = incomingMessage.url || '/'

  const headersInit: HeadersInit = {}

  for (const [headerName, headerValue] of Object.entries(incomingMessage.headers)) {
    if (Array.isArray(headerValue)) {
      headersInit[headerName] = headerValue.join(', ')
    } else {
      headersInit[headerName] = headerValue || ''
    }
  }

  const url = new URL(_path, `${_protocol}://${_host}`)

  // We need to cast the Node incoming message to a ReadableStream
  let bodyInit: BodyInit | null = null

  if (hasReadableBody(incomingMessage)) {
    console.log('>>> hasReadableBody', incomingMessage.method, incomingMessage.readable)
    bodyInit = new ReadableStream({
      async pull(controller) {
        const chunk = incomingMessage.read()

        if (chunk) {
          controller.enqueue(chunk)
        } else {
          controller.close()
        }
      },
      cancel() {
        ctrl.abort()
      },
    })
  }

  const request = new Request(url, {
    signal,
    headers: headersInit,
    method: incomingMessage.method,
    body: bodyInit,
  })

  return request
}

export function hasReadableBody(incomingMessage: IncomingMessage): boolean {
  return incomingMessage.method !== 'GET' && incomingMessage.method !== 'HEAD' && incomingMessage.readable
}
