import { Buffer } from 'buffer'
import { AbstractStringDecoder } from './AbstractStringDecoder.js'
import { IStringDecoder } from './common.js'

export class Base64StringDecoder extends AbstractStringDecoder implements IStringDecoder {
  lastChar = Buffer.allocUnsafe(3)

  public text(buf: Buffer, i: number) {
    const n = (buf.length - i) % 3
    if (n === 0) return buf.toString('base64', i)
    this.lastNeed = 3 - n
    this.lastTotal = 3
    if (n === 1) {
      this.lastChar[0] = buf[buf.length - 1]
    } else {
      this.lastChar[0] = buf[buf.length - 2]
      this.lastChar[1] = buf[buf.length - 1]
    }
    return buf.toString('base64', i, buf.length - n)
  }

  public end(buf: Buffer) {
    const r = buf && buf.length ? this.write(buf) : ''
    if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed)
    return r
  }
}
