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

import type { MimeDatabase } from '../../types/mime-db.d.ts'

/**
 * Module variables.
 * @private
 */

const compressablePattern = /^text\/|\+(?:json|text|xml)$/i
const extractTypePattern = /^\s*([^;\s]*)(?:;|\s|$)/

/**
 * Checks if a given MIME-type is compressible.
 *
 * MIME type information is provided by the optional
 * [`mime-db`](https://www.npmjs.com/package/mime-db) package,
 * which can be quite large when bundled with your application.
 *
 * Otherwise, the MIME type is assumed to be compressible if `text`, `json`, or `xml`.
 */
export function isCompressible(
  /** e.g. `'text/html'` */
  mimeType: string,
  /**
   * An optional database of MIME type information,
   * such as the [`mime-db`](https://www.npmjs.com/package/mime-db) package
   */
  db?: MimeDatabase
): boolean {
  if (!mimeType || typeof mimeType !== 'string') {
    return false
  }

  // Strip parameters...
  const [match] = extractTypePattern.exec(mimeType) || []
  if (!match) return false

  const mime = match.toLowerCase()

  if (db) {
    const data = db[mime]

    // return database information
    if (data && data.compressible !== undefined) {
      return data.compressible
    }
  }

  // fallback to regexp or unknown
  return compressablePattern.test(mime)
}
