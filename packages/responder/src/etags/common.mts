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
