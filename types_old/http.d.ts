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

export {}

declare global {
  interface Headers {
    get<T = any>(name: keyof T): string | null
    set<T = any>(name: keyof T, value: T[keyof T]): void
    append<T = any>(name: keyof T, value: T[keyof T]): void
  }

  class CompressionStream {
    /**
     * Creates a new `CompressionStream` object which compresses a stream of
     * data.
     *
     * Throws a `TypeError` if the format passed to the constructor is not
     * supported.
     */
    constructor(format: string)

    readonly readable: ReadableStream<Uint8Array>
    readonly writable: WritableStream<Uint8Array>
  }

  class DecompressionStream {
    /**
     * Creates a new `DecompressionStream` object which decompresses a stream of
     * data.
     *
     * Throws a `TypeError` if the format passed to the constructor is not
     * supported.
     */
    constructor(format: string)

    readonly readable: ReadableStream<Uint8Array>
    readonly writable: WritableStream<Uint8Array>
  }
}
