import { fileExtensionToContentTypeHeader } from 'packages/responder/src/files.mjs'
import { CachableResponse } from './CachableResponse.mjs'
import { CacheControlOptions } from './headers.mjs'

/**
 * A cachable request containing HTML content.
 */
export class HTMLResponse extends CachableResponse {
  /**
   *
   * @param htmlContent A string containing a full HTML document.
   * @param request An optional request to check for etag headers.
   * @param etag An optional etag for the given `json` parameter.
   * @param cacheControlOptions Options to generate a cache control header.
   * @param headersInit Optional headers to add to the response.
   */
  constructor(
    htmlContent: string,
    request?: Request,
    etag?: string,
    cacheControlOptions?: CacheControlOptions,
    headersInit?: HeadersInit
  ) {
    super(htmlContent, request, etag, cacheControlOptions, {
      ...fileExtensionToContentTypeHeader('html'),
      ...headersInit,
    })
  }
}
