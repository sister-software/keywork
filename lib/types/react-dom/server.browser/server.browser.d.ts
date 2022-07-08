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

declare module 'react-dom/server.browser' {
  import { ReactNode } from 'react'

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

  export type RenderToReadableStream = (
    children: ReactNode,
    options?: RenderToReadableStreamOptions
  ) => Promise<ReactDOMServerReadableStream>

  export const renderToReadableStream: RenderToReadableStream
  // export { RenderToReadableStreamOptions, ReactDOMServerReadableStream, RenderToReadableStream, renderToReadableStream }
}
