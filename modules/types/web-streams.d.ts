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

interface ReadableStreamBYOBRequest {
  readonly view: Uint8Array | null
  respond(bytesWritten: number): void
  respondWithNewView(view: ArrayBuffer | ArrayBufferView): void
  readonly atLeast: number | null
}

interface ReadableByteStreamController {
  readonly byobRequest: ReadableStreamBYOBRequest | null
  readonly desiredSize: number | null
  close(): void
  enqueue(chunk: ArrayBuffer | ArrayBufferView): void
  error(reason: any): void
}
