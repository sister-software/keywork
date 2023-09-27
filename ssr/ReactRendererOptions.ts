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

import type { KeyworkHTMLDocumentComponent, KeyworkProvidersComponent } from 'keywork/components'
import type { KeyworkResourceError } from 'keywork/errors'
import type { KeyworkLogLevel } from 'keywork/utils'
import type { ReactDOMServerReadableStream } from 'react-dom/server'

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

/** @ignore */
export interface ReactRenderStreamSuccessResult {
  stream: ReactDOMServerReadableStream
  controller: AbortController
  error: null
}
/** @ignore */
export interface ReactRenderStreamErrorResult {
  stream: ReactDOMServerReadableStream
  controller: AbortController
  error: KeyworkResourceError
}

/** @ignore */
export type ReactRenderStreamResult = ReactRenderStreamSuccessResult | ReactRenderStreamErrorResult

/** @ignore */
export interface IReactStreamRenderer {
  (children: React.ReactElement, options?: RenderToReadableStreamOptions): Promise<ReactRenderStreamResult>
}

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

  /**
   * The log level to use for the renderer.
   * @default {DEFAULT_LOG_LEVEL}
   */
  logLevel?: KeyworkLogLevel
}
