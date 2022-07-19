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

import type { KeyworkResourceError } from 'keywork/errors'
import type { KeyworkHTMLDocumentComponent } from './KeyworkHTMLDocument.tsx'
import type { KeyworkProvidersComponent } from './KeyworkProvidersComponent.tsx'
import type { ReadableStream } from 'keywork/platform/stream'

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

export interface ReactDOMServerReadableStream extends ReadableStream {
  allReady: Promise<void>
}

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

/** @ignore */
export type IReactStreamRenderer = (
  children: React.ReactElement,
  options?: RenderToReadableStreamOptions
) => Promise<ReactRenderStreamResult>

export interface ReactRendererOptions {
  streamRenderer?: IReactStreamRenderer
  /**
   * A HTML Document React component which wraps the entire application.
   * Use this if you need to replace the default HTML Document.
   */
  DocumentComponent?: KeyworkHTMLDocumentComponent
  /**
   * A React component which wraps the SSR routes.
   * Use this if you need to inject a provider into the SSR pipeline.
   */
  Providers?: KeyworkProvidersComponent
}
