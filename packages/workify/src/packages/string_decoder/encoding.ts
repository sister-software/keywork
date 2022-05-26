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

import { BufferEncoding } from '../buffer/index.js'

export function throwUnimplementedEncoding(encoding: never): never {
  throw new Error(`String Decoder not implemented for ${encoding}`)
}

export function isEncodingPolyfill(encoding: string): encoding is BufferEncoding {
  if (!encoding) return false

  switch (encoding && encoding.toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true
    default:
      return false
  }
}

export type NormalizedBufferEncoding = 'ascii' | 'utf8' | 'utf16le' | 'base64' | 'latin1' | 'hex'

/**
 * @internal
 */
export function _normalizeEncoding(enc: string) {
  if (!enc) return 'utf8'
  let retried

  // eslint-disable-next-line no-constant-condition
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8'
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le'
      case 'latin1':
      case 'binary':
        return 'latin1'
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc
      default: // undefined
        if (retried) return
        enc = enc.toLowerCase()
        retried = true
    }
  }
}

/**
 * Normalize encoding notation
 *
 * @throws {TypeError} Throws an error when encoding is invalid
 */
export function normalizeEncoding(enc: BufferEncoding): NonNullable<NormalizedBufferEncoding> {
  const nenc = _normalizeEncoding(enc)

  if (typeof nenc !== 'string' && !isEncodingPolyfill(enc)) throw new TypeError('Unknown encoding: ' + enc)

  return (nenc || enc) as NonNullable<NormalizedBufferEncoding>
}
