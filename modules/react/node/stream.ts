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
import { IReactStreamRenderer } from 'keywork/react/isomorphic'
import {
  renderToPipeableStream,
  ReactDOMServerReadableStream,
  PipeableStream,
} from 'https://esm.sh/react-dom@18.2.0/server'

/**
 * @ignore
 */
export class PipeableStreamWrapper implements ReactDOMServerReadableStream {
  allReady = Promise.resolve()
  locked = false

  constructor(public stream: PipeableStream) {}
  cancel(_reason?: any): Promise<void> {
    return Promise.resolve(this.stream.abort())
  }
  getReader(): ReadableStreamDefaultReader<any> {
    throw new Error('Method not implemented.')
  }
  pipeThrough<T>(
    _transform: ReadableWritablePair<T, any>,
    _options?: StreamPipeOptions | undefined
  ): globalThis.ReadableStream<T> {
    throw new Error('Method not implemented.')
  }
  pipeTo(destination: globalThis.WritableStream<any>, _options?: StreamPipeOptions | undefined): Promise<void> {
    this.stream.pipe(destination)
    return Promise.resolve()
  }
  tee(): [globalThis.ReadableStream<any>, globalThis.ReadableStream<any>] {
    throw new Error('Method not implemented.')
  }
}

export const renderReactStream: IReactStreamRenderer = (children) => {
  try {
    const stream = new PipeableStreamWrapper(renderToPipeableStream(children))

    return Promise.resolve({
      stream,
      error: null,
      controller: null as unknown as AbortController,
    })
  } catch (error) {
    return Promise.resolve({
      stream: null as unknown as ReactDOMServerReadableStream,
      error: new KeyworkResourceError(error),
      controller: null as unknown as AbortController,
    })
  }
}
