/* eslint-disable no-dupe-class-members */
/// <reference types="node" />
import type { EventEmitter, Transform as NodeTransformStream, TransformCallback, TransformOptions } from 'node:stream'

export interface NodeCompatibleTransformStream extends WritableStreamDefaultWriter, EventEmitter {
  end: () => void
}

export class Transform implements NodeTransformStream {
  protected _readableStream: ReadableStream
  protected _writableStream: WritableStream
  protected _writer: WritableStreamDefaultWriter
  public writable = true

  public writableEnded = false
  public writableFinished = false
  public writableHighWaterMark = Infinity
  public writableLength = 0

  public writableObjectMode = false
  public writableCorked = 0
  public allowHalfOpen = false

  public readableAborted = false
  public readable = true
  public readableDidRead = false
  public readableEncoding: BufferEncoding | null = 'utf8'
  public readableEnded = false
  public readableFlowing = false
  public readableHighWaterMark = Infinity
  public readableLength = 0
  public readableObjectMode = false
  public destroyed = false

  constructor(_opts?: TransformOptions) {
    const transformStream = new TransformStream()

    this._readableStream = transformStream.readable
    this._writableStream = transformStream.writable
    this._writer = transformStream.writable.getWriter()
  }

  _write(_chunk: any, _encoding: BufferEncoding, _callback: (error?: Error | null) => void): void {
    throw new Error('Method not implemented.')
  }
  _destroy(_error: Error | null, _callback: (error: Error | null) => void): void {
    throw new Error('Method not implemented.')
  }
  _final(
    _callback: (error?: Error | null) => /// <reference types="node" />
    void
  ): void {
    throw new Error('Method not implemented.')
  }
  setDefaultEncoding(_encoding: BufferEncoding): this {
    throw new Error('Method not implemented.')
  }
  cork(): void {
    throw new Error('Method not implemented.')
  }
  uncork(): void {
    throw new Error('Method not implemented.')
  }

  _read(_size: number): void {
    throw new Error('Method not implemented.')
  }
  read(_size?: number) {
    throw new Error('Method not implemented.')
  }
  setEncoding(_encoding: BufferEncoding): this {
    throw new Error('Method not implemented.')
  }
  pause(): this {
    throw new Error('Method not implemented.')
  }
  resume(): this {
    throw new Error('Method not implemented.')
  }
  isPaused(): boolean {
    throw new Error('Method not implemented.')
  }
  unpipe(_destination?: NodeJS.WritableStream): this {
    throw new Error('Method not implemented.')
  }
  unshift(_chunk: any, _encoding?: BufferEncoding): void {
    throw new Error('Method not implemented.')
  }
  wrap(_stream: NodeJS.ReadableStream): this {
    throw new Error('Method not implemented.')
  }
  push(_chunk: any, _encoding?: BufferEncoding): boolean {
    throw new Error('Method not implemented.')
  }
  destroy(_error?: Error): this {
    throw new Error('Method not implemented.')
  }
  addListener(event: 'close', listener: () => void): this
  addListener(
    event: 'data',
    listener: (
      chunk: /// <reference types="node" />
      any
    ) => void
  ): this
  addListener(event: 'end', listener: () => void): this
  addListener(event: 'error', listener: (err: Error) => void): this
  addListener(event: 'pause', listener: () => void): this
  addListener(event: 'readable', listener: () => void): this
  addListener(event: 'resume', listener: () => void): this
  addListener(event: string | symbol, listener: (...args: any[]) => void): this
  addListener(_event: unknown, _listener: unknown): this {
    throw new Error('Method not implemented.')
  }
  prependListener(event: 'close', listener: () => void): this
  prependListener(
    event: 'data',
    listener: (
      /// <reference types="node" />
      chunk: any
    ) => void
  ): this
  prependListener(event: 'end', listener: () => void): this
  prependListener(
    event: 'error',
    listener: (
      /// <reference types="node" />
      err: Error
    ) => void
  ): this
  prependListener(event: 'pause', listener: () => void): this
  prependListener(event: 'readable', listener: () => void): this
  prependListener(event: 'resume', listener: () => void): this
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this
  prependListener(_event: unknown, _listener: unknown): this {
    throw new Error('Method not implemented.')
  }
  prependOnceListener(event: 'close', listener: () => void): this
  prependOnceListener(event: 'data', listener: (chunk: any) => void): this
  prependOnceListener(event: 'end', listener: () => void): this
  prependOnceListener(event: 'error', listener: (err: Error) => void): this
  prependOnceListener(event: 'pause', listener: () => void): this
  prependOnceListener(event: 'readable', listener: () => void): this
  prependOnceListener(event: 'resume', listener: () => void): this
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this
  prependOnceListener(_event: unknown, _listener: unknown): this {
    throw new Error('Method not implemented.')
  }
  [Symbol.asyncIterator](): AsyncIterableIterator<any> {
    throw new Error('Method not implemented.')
  }
  pipe<T extends NodeJS.WritableStream>(_destination: T, _options?: { end?: boolean | undefined }): T {
    throw new Error('Method not implemented.')
  }
  setMaxListeners(_n: number): this {
    throw new Error('Method not implemented.')
  }
  getMaxListeners(): number {
    throw new Error('Method not implemented.')
  }
  rawListeners(_eventName: string | symbol): Function[] {
    throw new Error('Method not implemented.')
  }
  listenerCount(_eventName: string | symbol): number {
    throw new Error('Method not implemented.')
  }
  eventNames(): (string | symbol)[] {
    throw new Error('Method not implemented.')
  }

  ready() {
    return this._writer.ready
  }

  _transform(_chunk: any, _encoding: BufferEncoding, _callback: TransformCallback): void {
    throw new Error('Method not implemented.')
  }
  _flush(_callback: TransformCallback): void {
    throw new Error('Method not implemented.')
  }

  write(chunk: any, encoding?: BufferEncoding, cb?: (error: Error | null | undefined) => void): boolean
  write(chunk: any, cb?: (error: Error | null | undefined) => void): boolean
  write(chunk: unknown, _encoding?: unknown, cb?: unknown): boolean {
    const written = this._writer.write(chunk)

    if (cb) {
      written.then(cb as any).catch(cb as any)
    }

    return true
  }

  public async close() {
    await this._writer.close()
    this.writable = false
    this.writableEnded = true
  }

  on(event: 'close', listener: () => void): this
  on(event: 'data', listener: (chunk: any) => void): this
  on(event: 'end', listener: () => void): this
  on(event: 'error', listener: (err: Error) => void): this
  on(event: 'pause', listener: () => void): this
  on(event: 'readable', listener: () => void): this
  on(event: 'resume', listener: () => void): this
  on(event: string | symbol, listener: (...args: any[]) => void): this
  on(event: unknown, listener: unknown): this {
    switch (event) {
      case 'readable':
        this._readableStream.getReader()
        ;(listener as any)()
        return this
      case 'end':
        this.close().then(listener as any)
        return this
      case 'data':
        this.write((listener as any)())
        return this
      case 'error':
        return this
      default:
        break
    }

    return this
  }

  end(cb?: () => void): this
  end(chunk: any, cb?: () => void): this
  end(chunk: any, encoding?: BufferEncoding, cb?: () => void): this
  end(chunk?: unknown, encoding?: unknown, cb?: unknown): this {
    if (this.writableFinished) return this

    const close = () => {
      const closed = this.close()

      if (cb) {
        closed.then(cb as any).catch(cb as any)
        return this
      }
    }

    if (arguments.length >= 3) {
      this.write(chunk as any, encoding as any, close)

      return this
    }

    if (arguments.length === 2) {
      this.write(chunk as any, encoding as any, close)

      return this
    }

    close()
    return this
  }

  emit(_event: 'close'): boolean
  emit(_event: 'data', chunk: any): boolean
  emit(_event: 'end'): boolean
  emit(_event: 'error', err: Error): boolean
  emit(_event: 'pause'): boolean
  emit(_event: 'readable'): boolean
  emit(_event: 'resume'): boolean
  emit(_event: string | symbol, ...args: any[]): boolean
  emit(_event: unknown, _err?: unknown, ..._rest: unknown[]): boolean {
    return true
  }

  once(_event: 'close', _listener: () => void): this
  once(_event: 'data', _listener: (chunk: any) => void): this
  once(_event: 'end', _listener: () => void): this
  once(_event: 'error', _listener: (err: Error) => void): this
  once(_event: 'pause', _listener: () => void): this
  once(_event: 'readable', _listener: () => void): this
  once(_event: 'resume', _listener: () => void): this
  once(_event: string | symbol, _listener: (...args: any[]) => void): this
  once(_event: unknown, _listener: unknown): this {
    return this
  }

  removeListener(_event: 'close', _listener: () => void): this
  removeListener(_event: 'data', _listener: (chunk: any) => void): this
  removeListener(_event: 'end', _listener: () => void): this
  removeListener(_event: 'error', _listener: (err: Error) => void): this
  removeListener(_event: 'pause', _listener: () => void): this
  removeListener(_event: 'readable', _listener: () => void): this
  removeListener(_event: 'resume', _listener: () => void): this
  removeListener(_event: string | symbol, _listener: (...args: any[]) => void): this
  removeListener(_event: unknown, _listener: unknown): this {
    return this
  }

  removeAllListeners(_event?: string | symbol): this {
    return this
  }

  off(_eventName: string | symbol, _listener: (...args: any[]) => void): this {
    return this
  }

  listeners(_eventName: string | symbol): Function[] {
    return []
  }
}
