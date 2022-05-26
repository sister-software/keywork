import { KeyworkResourceError } from '@keywork/utils'
import React from 'react'
import {
  ReactDOMServerReadableStream,
  renderToReadableStream as RenderToReadableStream,
  RenderToReadableStreamOptions,
} from 'react-dom/server'
// @ts-expect-error Export not yet public
// eslint-disable-next-line import/extensions
import { renderToReadableStream as _renderToReadableStream } from 'react-dom/server.browser'

const renderToReadableStream: typeof RenderToReadableStream = _renderToReadableStream

export interface ReactRenderStreamSuccessResult {
  stream: ReactDOMServerReadableStream
  error: null
}

export interface ReactRenderStreamErrorResult {
  stream: ReactDOMServerReadableStream
  error: KeyworkResourceError
}

export type ReactRenderStreamResult = ReactRenderStreamSuccessResult | ReactRenderStreamErrorResult

export async function renderReactStream(
  children: React.ReactNode,
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
  }
}
