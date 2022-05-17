import type { Buffer } from 'buffer'
import { IStringDecoder } from './common.mjs'
import { UTF8StringDecoder } from './UTF8StringDecoder.mjs'

export class SingleByteStringDecoder extends UTF8StringDecoder implements IStringDecoder {
  /**
   * Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
   */
  public write(buf: Buffer): string {
    return buf.toString(this.encoding)
  }
}
