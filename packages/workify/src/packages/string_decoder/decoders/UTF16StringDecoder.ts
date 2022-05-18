import { Buffer } from 'buffer'
import { AbstractStringDecoder } from './AbstractStringDecoder.js'
import { IStringDecoder } from './common.js'

export class UTF16StringDecoder extends AbstractStringDecoder implements IStringDecoder {
  protected lastChar = Buffer.allocUnsafe(4)

  // UTF-16LE typically needs two bytes per character, but even if we have an even
  // number of bytes available, we need to check if we end on a leading/high
  // surrogate. In that case, we need to wait for the next two bytes in order to
  // decode the last character properly.
  public text(buf: Buffer, i: number) {
    if ((buf.length - i) % 2 === 0) {
      const r = buf.toString('utf16le', i)
      if (r) {
        const c = r.charCodeAt(r.length - 1)
        if (c >= 0xd800 && c <= 0xdbff) {
          this.lastNeed = 2
          this.lastTotal = 4
          this.lastChar[0] = buf[buf.length - 2]
          this.lastChar[1] = buf[buf.length - 1]
          return r.slice(0, -1)
        }
      }
      return r
    }
    this.lastNeed = 1
    this.lastTotal = 2
    this.lastChar[0] = buf[buf.length - 1]
    return buf.toString('utf16le', i, buf.length - 1)
  }

  // For UTF-16LE we do not explicitly append special replacement characters if we
  // end on a partial character, we simply let v8 handle that.
  public end(buf: Buffer) {
    const r = buf && buf.length ? this.write(buf) : ''
    if (this.lastNeed) {
      const end = this.lastTotal - this.lastNeed
      return r + this.lastChar.toString('utf16le', 0, end)
    }
    return r
  }
}
