import type { StringDecoder as IStringDecoderOriginal } from 'string_decoder'
import { NormalizedBufferEncoding, normalizeEncoding } from '../encoding.mjs'

export interface IStringDecoder extends IStringDecoderOriginal {
  encoding: NonNullable<NormalizedBufferEncoding>
}

export abstract class AbstractStringDecoder implements IStringDecoder {
  protected lastNeed = 0
  protected lastTotal = 0
  protected readonly lastChar: Buffer | undefined
  public encoding: NonNullable<NormalizedBufferEncoding>

  constructor(encoding: BufferEncoding = 'utf8') {
    this.encoding = normalizeEncoding(encoding)
  }

  /**
   * Returns a decoded string, omitting any incomplete multi-bytes
   * characters at the end of the Buffer, or TypedArray, or DataView
   *
   * @param {string | Buffer | TypedArray | DataView} buf
   * @returns {string}
   * @throws {TypeError} Throws when buf is not in one of supported types
   */
  write(buf: Buffer): string {
    if (buf.length === 0) return ''
    let r
    let i

    if (this.lastNeed) {
      r = this.fillLast(buf)
      if (r === undefined) return ''
      i = this.lastNeed
      this.lastNeed = 0
    } else {
      i = 0
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i)
    return r || ''
  }

  end(buf: Buffer): string {
    return buf && buf.length ? this.write(buf) : ''
  }

  // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
  protected fillLast(buf: Buffer) {
    if (!this.lastChar) return

    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed)
      return this.lastChar.toString(this.encoding, 0, this.lastTotal)
    }

    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length)
    this.lastNeed -= buf.length
  }

  public abstract text(buffer: Buffer, i: number): string
}

// StringDecoder.prototype.end = utf8End

// Returns only complete characters in a Buffer
// StringDecoder.prototype.text = utf8Text
