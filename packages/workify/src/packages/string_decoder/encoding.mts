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

const isEncoding = Buffer.isEncoding || isEncodingPolyfill

function _normalizeEncoding(enc: string) {
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

export type NormalizedBufferEncoding = ReturnType<typeof _normalizeEncoding>

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
/**
 * Normalize encoding notation
 *
 * @throws {TypeError} Throws an error when encoding is invalid
 */
export function normalizeEncoding(enc: BufferEncoding): NonNullable<NormalizedBufferEncoding> {
  const nenc = _normalizeEncoding(enc)

  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc)))
    throw new TypeError('Unknown encoding: ' + enc)

  return (nenc || enc) as NonNullable<NormalizedBufferEncoding>
}
