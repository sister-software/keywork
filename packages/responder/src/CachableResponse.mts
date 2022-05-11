import { isETagMatch } from '@keywork/shared'
import { StatusCodes } from 'http-status-codes'
import { CacheControlOptions, createCacheControlHeader } from './headers.mjs'
import { NotModifiedResponse } from './NotModifiedResponse.mjs'

/**
 * A client-side cachable response.
 * @remark Etag caching is supported when `CachableResponse` is constructed with the needed parameters.
 * You may want to disable caching in your browser development tools to avoid this behavior while debugging.
 */
export class CachableResponse extends Response {
  /**
   * @remark Etag caching is supported when `CachableResponse` is constructed with the needed parameters.
   * You may want to disable caching in your browser development tools to avoid this behavior while debugging.
   *
   * @param body A body sent with the response.
   * @param request An optional request to check for etag headers.
   * @param etag An optional etag for the given `json` parameter.
   * @param cacheControlOptions Options to generate a cache control header.
   * @param headersInit Optional headers to add to the response.
   */
  constructor(
    body: BodyInit | null,
    request?: Request,
    etag?: string | null,
    cacheControlOptions?: CacheControlOptions,
    headersInit?: HeadersInit
  ) {
    if (request && isETagMatch(request, etag)) {
      return new NotModifiedResponse(etag)
    }

    const headers = new Headers({
      ...headersInit,
      ...createCacheControlHeader(cacheControlOptions),
    })

    if (etag) {
      headers.set('ETag', etag)
    }

    super(body, {
      status: StatusCodes.OK,
      headers,
    })
  }
}
