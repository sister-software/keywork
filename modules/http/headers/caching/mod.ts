/**
 * Utilities for managing ETags and caching.
 *
 * @packageDocumentation
 * @module Keywork#HTTP#Headers#Caching
 *
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
/* eslint-disable header/header */

import { KeyworkResourceError, Status } from '../../../errors/mod.ts'
import { arrayBufferToBase64, stringToArrayBuffer } from '../../../strings/mod.ts'
import { DURATION_ONE_WEEK } from '../../../__internal/datetime.ts'

export interface CachingHeaders {
  /** The time, in seconds, that the object has been in a proxy cache. */
  Age: string
  /** Directives for caching mechanisms in both requests and responses. */
  'Cache-Control': string
  /** Clears browsing data (e.g. cookies, storage, cache) associated with the requesting website. */
  'Clear-Site-Data': string
  /** The date/time after which the response is considered stale. */
  Expires: string
  /** Implementation-specific header that may have various effects anywhere along the request-response chain. Used for backwards compatibility with HTTP/1.0 caches where the `Cache-Control` header is not yet present. */
  Pragma: string
}

/**
 * Response headers with Cache-Control.
 *
 * @category Cache
 * @category HTTP Response
 * @public
 */
export type CacheControlHeader = HeadersInit & {
  'Cache-Control': string
}

/**
 * Directives for the Cache-Control header.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control MDN}
 *
 * @category Cache
 * @category HTTP Headers
 * @public
 */
export interface CacheControlDirectives {
  [cacheControlKey: string]: number | boolean | string

  'max-age': number
  'must-revalidate': boolean
  immutable: boolean
  'max-stale': number
  'min-fresh': number
  'no-cache': boolean
  'no-store': boolean
  'no-transform': boolean
  'only-if-cached': boolean
  private: boolean
  'proxy-revalidate': boolean
  public: boolean
  's-maxage': number
  'stale-if-error': boolean
  'stale-while-revalidate': number
}
// options = options || { 'max-age': DURATION_ONE_WEEK, 'must-revalidate': true }

/**
 * Creates a `Cache-Control` header from the given object.
 * Generally, this is an internal function, but it may prove useful in unusual circumstances.
 *
 * See {@link Keywork#HTTP#Response.CachableResponse `CachableResponse`}
 *
 * @category Cache
 * @category HTTP Headers
 * @public
 */
export function castHeadersObjectToString(headersObject: Record<string, number | boolean | string>): string {
  const headerValues: string[] = []

  for (const [key, value] of Object.entries(headersObject)) {
    if (typeof value === 'boolean') {
      if (!value) continue

      headerValues.push(key)
    }

    headerValues.push(`${key}=${value}`)
  }

  return headerValues.join(', ')
}

/**
 * Wraps `JSON.stringify` to ensure that JSON pretty printing doesn't influence ETag generation.
 * @category Cache
 * @public
 */
export const convertJSONToETaggableString = (value: {}): string => {
  return JSON.stringify(value)
}

/**
 * Types that can be converted into ETags.
 * @public
 * @category Cache
 */
export type ETaggable = string | ArrayBuffer

/**
 * Precomputed etag for an empty entity.
 * @internal
 */
export const _EMPTY_ETAG = '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'

/**
 * Utility function to check if a given request's headers match an etag.
 * If the etag matches, the client may use the locally cache resource.
 * @category Cache
 * @category Type Cast
 */
export function isETagMatch(request: Request, etag: string | null | undefined): etag is string {
  const headerContent = request.headers.get('If-None-Match')

  return etag === headerContent || `W/${etag}` === headerContent
}

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
    throw new KeyworkResourceError(`The given entity is of unexpected type \`${typeof entity}\``, Status.BadRequest)
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
