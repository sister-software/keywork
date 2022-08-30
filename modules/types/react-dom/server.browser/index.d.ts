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

declare module 'https://esm.sh/react-dom@18.2.0/server.browser' {
  import { ReactNode } from 'https://esm.sh/react@18.2.0'

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

  export class ReactDOMServerReadableStream extends ReadableStream {
    allReady: Promise<void>
  }

  export type RenderToReadableStream = (
    children: ReactNode,
    options?: RenderToReadableStreamOptions
  ) => Promise<ReactDOMServerReadableStream>

  export const renderToReadableStream: RenderToReadableStream
}

declare module 'react-dom/server.browser' {
  export * from 'https://esm.sh/react-dom@18.2.0/server.browser'
}
