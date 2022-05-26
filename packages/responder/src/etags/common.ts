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

/**
 * Wraps `JSON.stringify` to ensure that JSON pretty printing doesn't influence ETag generation.
 */
export const convertJSONToETaggableString = (value: {}): string => {
  return JSON.stringify(value)
}

export type ETaggable = string | ArrayBuffer

/** Precomputed etag for an empty entity. */
export const EMPTY_ETAG = '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'

export function isETagMatch(request: Request, etag: string | null | undefined): etag is string {
  const headerContent = request.headers.get('If-None-Match')

  return etag === headerContent || `W/${etag}` === headerContent
}
