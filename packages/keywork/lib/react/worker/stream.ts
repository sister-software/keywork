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
import type { ReactNode } from 'react'
import { renderToReadableStream as _renderToReadableStream } from 'react-dom/server.browser'

/**
 * @ignore
 */
export interface RenderToReadableStreamOptions {
  identifierPrefix?: string
  namespaceURI?: string
  nonce?: string
  bootstrapScriptContent?: string
  bootstrapScripts?: string[]
  bootstrapModules?: string[]
  progressiveChunkSize?: number
  signal?: AbortSignal
  onError?: (error: unknown) => void
}

/**
 * @ignore
 */
export interface ReactDOMServerReadableStream extends ReadableStream {
  allReady: Promise<void>
}

type RenderToReadableStream = (
  children: ReactNode,
  options?: RenderToReadableStreamOptions
) => Promise<ReactDOMServerReadableStream>

const renderToReadableStream: RenderToReadableStream = _renderToReadableStream

export interface ReactRenderStreamSuccessResult {
  stream: ReactDOMServerReadableStream
  controller: AbortController
  error: null
}

export interface ReactRenderStreamErrorResult {
  stream: ReactDOMServerReadableStream
  controller: AbortController
  error: KeyworkResourceError
}

export type ReactRenderStreamResult = ReactRenderStreamSuccessResult | ReactRenderStreamErrorResult

export async function renderReactStream(
  children: ReactNode,
  options?: RenderToReadableStreamOptions
): Promise<ReactRenderStreamResult> {
  const controller = new AbortController()
  let error: null | KeyworkResourceError = null

  const stream = await renderToReadableStream(children, {
    ...options,
    signal: controller.signal,
    onError(_error) {
      error = KeyworkResourceError.fromUnknownError(_error)
      console.error(error)
    },
  })

  return {
    stream,
    error,
    controller,
  }
}
