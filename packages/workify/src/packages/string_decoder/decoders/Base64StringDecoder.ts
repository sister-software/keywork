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
