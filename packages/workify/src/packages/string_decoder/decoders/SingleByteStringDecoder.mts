import type { StringDecoder as IStringDecoder } from 'string_decoder'
import { UTF8StringDecoder } from './UTF8StringDecoder.mjs'

export class SingleByteStringDecoder extends UTF8StringDecoder implements IStringDecoder {
  /**
   * Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
   */
  public write(buf: Buffer): string {
    return buf.toString(this.encoding)
  }
}
