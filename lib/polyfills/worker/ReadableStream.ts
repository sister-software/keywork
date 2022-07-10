/* eslint-disable header/header */
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
 *
 * @packageDocumentation
 * @module polyfills.ReadableStream
 * @ignore
 */

/// <reference lib="deno.window" />

declare class IdentityTransformStream extends TransformStream {}

/**
 * @ignore
 */
const TransformerStreamBaseConstructor =
  typeof IdentityTransformStream !== 'undefined' ? IdentityTransformStream : TransformStream

/**
 * The **`ReadableStreamDefaultController`** interface of the [Streams API](https://developer.mozilla.org//en-US/docs/Web/API/Streams_API)
 * represents a controller allowing control of a `ReadableStream`'s state and internal queue.
 * Default controllers are for streams that are not byte streams.
 *
 * @category Worker Polyfills
 * @private
 * @ignore
 */
class MockReadableStreamDefaultController implements ReadableStreamDefaultController {
  constructor(private writer: WritableStreamDefaultWriter) {}

  get desiredSize(): number | null {
    return this.writer.desiredSize
  }

  close(): void {
    this.writer.close()
  }
  enqueue(chunk?: any): void {
    this.writer.write(chunk)
  }
  error(reason: any): void {
    this.writer.abort(reason)
  }
}

/**
 * The `ReadableStream` interface of the [Streams API](https://developer.mozilla.org//en-US/docs/Web/API/Streams_API)
 * represents a readable stream of byte data.
 * The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) offers a concrete instance
 * of a `ReadableStream` through the [`body`](https://developer.mozilla.org/en-US/docs/Web/API/Response/body) property
 * of a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object.
 *
 * @remarks
 * This class implementation polyfills `ReadableStream` in the Cloudflare Pages environment.
 *
 * @public
 *
 * @category Worker Polyfills
 * @ignore
 */
export class ReadableStream<R = any> implements globalThis.ReadableStream<R> {
  private _readable: globalThis.ReadableStream
  private _writable: WritableStream

  constructor(underlyingSource?: UnderlyingSource, _queuingStrategy?: { highWaterMark?: number; size?: undefined }) {
    const transformStream = new TransformerStreamBaseConstructor()
    this._readable = transformStream.readable
    this._writable = transformStream.writable

    const writer = this._writable.getWriter()
    const controller = new MockReadableStreamDefaultController(writer)

    underlyingSource?.start?.(controller)
    underlyingSource?.pull?.(controller)

    return this._readable as any
  }

  get locked(): boolean {
    return this._readable.locked
  }

  cancel(reason?: any): Promise<void> {
    return this._readable.cancel(reason)
  }

  getReader(options: { mode: 'byob' }): ReadableStreamBYOBReader
  getReader(options?: { mode?: undefined }): ReadableStreamDefaultReader<R>
  getReader(options?: unknown): ReadableStreamBYOBReader | ReadableStreamDefaultReader {
    return this._readable.getReader(options as any)
  }
  pipeThrough<T>(
    {
      writable,
      readable,
    }: {
      writable: WritableStream<R>
      readable: ReadableStream<T>
    },
    options?: PipeOptions
  ): ReadableStream<T>
  pipeThrough(transform: any, options?: PipeOptions | undefined): globalThis.ReadableStream {
    return this._readable.pipeThrough(transform, options)
  }

  pipeTo(destination: WritableStream, options?: PipeOptions | undefined): Promise<void> {
    return this._readable.pipeTo(destination, options)
  }

  tee(): [globalThis.ReadableStream, globalThis.ReadableStream] {
    return this._readable.tee()
  }

  values(options?: any): AsyncIterableIterator<any> {
    return (this._readable as any).values(options)
  }

  [Symbol.asyncIterator](_options?: any): AsyncIterableIterator<any> {
    throw new Error('Method not implemented.')
  }
}
