/// <reference types="node" />
import type { EventEmitter } from 'node:stream'

export interface NodeCompatibleTransformStream extends WritableStreamDefaultWriter, EventEmitter {
  end: () => void
}

/** Polyfills the web-only `TransformStream` to behave like the node-only   */
export function createNodeCompatibleTransformStream() {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter() as unknown as NodeCompatibleTransformStream

  writer.on = function (eventName, cb) {
    switch (eventName) {
      case 'end':
        writer.close()
        break
      case 'data':
        writer.write(cb())
        break
      case 'error':
        break
      default:
        break
    }

    return writer
  }

  writer.end = () => writer.close()
  writer.once = (eventName) => {
    writer.on(eventName, () => null)
    return writer
  }
  writer.emit = () => true

  writer.removeListener = () => writer
  writer.listeners = () => []

  return { readable, writable, writer: writer as unknown as NodeJS.WritableStream }
}
