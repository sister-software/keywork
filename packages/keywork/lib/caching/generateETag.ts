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

import HTTPStatus from 'http-status'
import { KeyworkResourceError } from 'keywork/errors'
import { arrayBufferToBase64, stringToArrayBuffer } from 'keywork/utilities'
import { ETaggable, _EMPTY_ETAG } from './common.ts'

/**
 * @category Cache
 */
export interface EntityToETagOptions {
  /**
   * Indicates that a weak validator is used.
   * Weak etags are easy to generate, but are far less useful for comparisons.
   * Strong validators are ideal for comparisons but can be very difficult to generate efficiently.
   * Weak ETag values of two representations of the same resources might be semantically equivalent,
   * but not byte-for-byte identical.
   * This means weak etags prevent caching when byte range requests are used,
   * but strong etags mean range requests can still be cached.
   */
  weak?: boolean
}

/**
 * Create a simple ETag.
 *
 * @param entity Either a `string`, `ArrayBuffer`.
 * If working with JSON, run the value through `JSON.stringify` first.
 * @param options See `EntityToETagOptions`
 *
 * @category Cache
 */
export async function generateETag(entity: ETaggable, options?: EntityToETagOptions): Promise<string> {
  let entityBuffer: ArrayBuffer

  if (entity instanceof ArrayBuffer) {
    entityBuffer = entity
  } else if (typeof entity === 'string') {
    if (!entity.length) return _EMPTY_ETAG
    entityBuffer = stringToArrayBuffer(entity)
  } else {
    throw new KeyworkResourceError(
      `The given entity is of unexpected type \`${typeof entity}\``,
      HTTPStatus.BAD_REQUEST
    )
  }

  if (entityBuffer.byteLength === 0) {
    return _EMPTY_ETAG
  }

  // Compute hash of entity...
  const digest = await crypto.subtle.digest('SHA-1', entityBuffer)
  const hash = arrayBufferToBase64(digest).substring(0, 27)

  // Compute length of entity...
  const etagBody = '"' + hash.length.toString(16) + '-' + hash + '"'
  const etag = options?.weak ? 'W/' + etagBody : etagBody

  return etag
}
