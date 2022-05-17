import type { Buffer } from 'buffer'
import { BufferEncoding } from '../buffer/index.mjs'
import { Base64StringDecoder } from './decoders/Base64StringDecoder.mjs'
import { IStringDecoder } from './decoders/common.mjs'
import { SingleByteStringDecoder } from './decoders/SingleByteStringDecoder.mjs'
import { UTF16StringDecoder } from './decoders/UTF16StringDecoder.mjs'
import { UTF8StringDecoder } from './decoders/UTF8StringDecoder.mjs'
import { NormalizedBufferEncoding, normalizeEncoding, throwUnimplementedEncoding } from './encoding.mjs'

declare class StringDecoder<E extends BufferEncoding> implements IStringDecoder {
  constructor(encoding?: E)
  encoding: NonNullable<NormalizedBufferEncoding>
  end(buffer?: Buffer): string
  write(buffer: Buffer): string
}

// eslint-disable-next-line no-redeclare
function StringDecoder<E extends BufferEncoding>(
  encoding?: E
): E extends 'utf8' | 'utf-8'
  ? UTF8StringDecoder
  : E extends 'ucs2' | 'ucs-2' | 'utf16le' | 'utf-16le'
  ? UTF16StringDecoder
  : E extends 'base64'
  ? Base64StringDecoder
  : SingleByteStringDecoder {
  const normalizedEncoding = normalizeEncoding(encoding || 'utf8')
  const Decoder = getDecoder(normalizedEncoding)

  return new Decoder(normalizedEncoding) as any
}

type Decoder =
  | typeof UTF16StringDecoder
  | typeof UTF8StringDecoder
  | typeof Base64StringDecoder
  | typeof SingleByteStringDecoder

function getDecoder(normalizedEncoding: NonNullable<NormalizedBufferEncoding>): Decoder {
  switch (normalizedEncoding) {
    case 'utf16le':
      return UTF16StringDecoder

    case 'utf8':
      return UTF8StringDecoder

    case 'base64':
      return Base64StringDecoder

    case 'latin1':
    case 'ascii':
    case 'hex':
      return SingleByteStringDecoder
  }

  return throwUnimplementedEncoding(normalizedEncoding)
}

export { StringDecoder }
