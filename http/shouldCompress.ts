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

import type { MimeDatabase } from '../files/index.js'
import { ContentType, parse } from './headers/index.js'
import { isCompressible } from './isCompressable.js'

/**
 * Predicate function to determine if a given content type should be compressed.
 */
export function shouldCompress(
  contentTypeLike: ContentType | string | null,
  /**
   * An optional database of MIME type information,
   * such as the [`mime-db`](https://www.npmjs.com/package/mime-db) package
   */
  db?: MimeDatabase
): boolean {
  if (!contentTypeLike) return false
  try {
    const contentType = typeof contentTypeLike === 'string' ? parse(contentTypeLike) : contentTypeLike
    return isCompressible(contentType.type, db)
  } catch (_error) {
    return false
  }
}
