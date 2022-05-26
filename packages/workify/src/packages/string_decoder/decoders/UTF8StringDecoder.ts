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

import { Buffer } from 'buffer'
import { AbstractStringDecoder } from './AbstractStringDecoder.js'
import { IStringDecoder } from './common.js'

export class UTF8StringDecoder extends AbstractStringDecoder implements IStringDecoder {
  protected lastChar = Buffer.allocUnsafe(4)

  /**
   * Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
   * continuation byte. If an invalid byte is detected, -2 is returned.
   */
  protected checkByte(byte: number) {
    if (byte <= 0x7f) return 0
    else if (byte >> 5 === 0x06) return 2
    else if (byte >> 4 === 0x0e) return 3
    else if (byte >> 3 === 0x1e) return 4
    return byte >> 6 === 0x02 ? -1 : -2
  }

  /**
   * Checks at most 3 bytes at the end of a Buffer in order to detect an
   * incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
   * needed to complete the UTF-8 character (if applicable) are returned.
   */
  protected checkIncomplete(buf: Buffer, i: number) {
    let j = buf.length - 1
    if (j < i) return 0
    let nb = this.checkByte(buf[j])
    if (nb >= 0) {
      if (nb > 0) this.lastNeed = nb - 1
      return nb
    }
    if (--j < i || nb === -2) return 0
    nb = this.checkByte(buf[j])
    if (nb >= 0) {
      if (nb > 0) this.lastNeed = nb - 2
      return nb
    }
    if (--j < i || nb === -2) return 0
    nb = this.checkByte(buf[j])
    if (nb >= 0) {
      if (nb > 0) {
        if (nb === 2) nb = 0
        else this.lastNeed = nb - 3
      }
      return nb
    }
    return 0
  }

  /**
   * Validates as many continuation bytes for a multi-byte UTF-8 character as
   * needed or are available. If we see a non-continuation byte where we expect
   * one, we "replace" the validated continuation bytes we've seen so far with
   * a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
   * behavior. The continuation byte check is included three times in the case
   * where all of the continuation bytes for a character exist in the same buffer.
   * It is also done this way as a slight performance increase instead of using a
   * loop.
   */
  protected checkExtraBytes(buf: Buffer) {
    if ((buf[0] & 0xc0) !== 0x80) {
      this.lastNeed = 0
      return '\ufffd'
    }
    if (this.lastNeed > 1 && buf.length > 1) {
      if ((buf[1] & 0xc0) !== 0x80) {
        this.lastNeed = 1
        return '\ufffd'
      }
      if (this.lastNeed > 2 && buf.length > 2) {
        if ((buf[2] & 0xc0) !== 0x80) {
          this.lastNeed = 2
          return '\ufffd'
        }
      }
    }
  }

  /**
   * Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
   */
  protected fillLast(buf: Buffer) {
    const p = this.lastTotal - this.lastNeed
    const r = this.checkExtraBytes(buf)

    if (r !== undefined) return r

    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, p, 0, this.lastNeed)
      return this.lastChar.toString(this.encoding, 0, this.lastTotal)
    }

    buf.copy(this.lastChar, p, 0, buf.length)
    this.lastNeed -= buf.length
  }

  /**
   * Returns all complete UTF-8 characters in a Buffer.
   * If the Buffer ended on a partial character, the character's bytes are buffered
   * until the required number of bytes are available.
   */
  public text(buf: Buffer, i: number) {
    const total = this.checkIncomplete(buf, i)
    if (!this.lastNeed) return buf.toString('utf8', i)
    this.lastTotal = total
    const end = buf.length - (total - this.lastNeed)
    buf.copy(this.lastChar, 0, end)
    return buf.toString('utf8', i, end)
  }

  /**
   * For UTF-8, a replacement character is added when ending on a partial character.
   */
  public end(buf: Buffer) {
    const r = buf && buf.length ? this.write(buf) : ''
    if (this.lastNeed) return r + '\ufffd'
    return r
  }
}
