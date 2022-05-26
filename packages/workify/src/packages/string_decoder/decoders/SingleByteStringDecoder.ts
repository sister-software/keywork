/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remark Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import type { Buffer } from 'buffer'
import { IStringDecoder } from './common.js'
import { UTF8StringDecoder } from './UTF8StringDecoder.js'

export class SingleByteStringDecoder extends UTF8StringDecoder implements IStringDecoder {
  /**
   * Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
   */
  public write(buf: Buffer): string {
    return buf.toString(this.encoding)
  }
}
