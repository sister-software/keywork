import { StatusCodes } from 'http-status-codes'
import { KeyworkResourceAccessError } from './errors.mjs'
import { arrayBufferToBase64, stringToArrayBuffer } from './strings.mjs'

export type ETaggable = string | ArrayBuffer

/** Precomputed etag for an empty entity. */
const EMPTY_ETAG = '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'

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
 * Wraps `JSON.stringify` to ensure that JSON pretty printing doesn't influence ETag generation.
 */
export const convertJSONToEtaggableString = (value: {}): string => {
  return JSON.stringify(value)
}

/**
 * Create a simple ETag.
 *
 * @param entity Either a `string`, `ArrayBuffer`.
 * If working with JSON, run the value through `JSON.stringify` first.
 * @param options See `EntityToETagOptions`
 * @returns
 */
export async function generateETag(entity: ETaggable, options?: EntityToETagOptions): Promise<string> {
  let entityBuffer: ArrayBuffer

  if (entity instanceof ArrayBuffer) {
    entityBuffer = entity
  } else if (typeof entity === 'string') {
    if (!entity.length) return EMPTY_ETAG
    entityBuffer = stringToArrayBuffer(entity)
  } else {
    throw new KeyworkResourceAccessError(
      `The given entity is of unexpected type \`${typeof entity}\``,
      StatusCodes.BAD_REQUEST
    )
  }

  if (entityBuffer.byteLength === 0) {
    return EMPTY_ETAG
  }

  // Compute hash of entity...
  const digest = await crypto.subtle.digest('SHA-1', entityBuffer)
  const hash = arrayBufferToBase64(digest).substring(0, 27)

  // Compute length of entity...
  const etagBody = '"' + hash.length.toString(16) + '-' + hash + '"'
  const etag = options?.weak ? 'W/' + etagBody : etagBody

  return etag
}
