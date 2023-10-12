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
import type { KeyworkLogger } from 'keywork/logging'
import type { ReactDOMServerReadableStream } from 'react-dom/server'
import type { RequestDocumentOverrideProps } from './RequestDocument.js'

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

export interface ReactRendererOptions extends RequestDocumentOverrideProps {
  streamRenderer?: IReactStreamRenderer

  /**
   * Logger used during rendering. This defaults to the router's logger.
   * @internal
   */
  logger?: KeyworkLogger
}
