import { CacheControlOptions } from '../headers/cacheControl.js'
import { fileExtensionToContentTypeHeader } from '../headers/contentType.js'
import { CachableResponse } from './CachableResponse.js'

/**
 * A cachable request containing HTML content.
 */
export class HTMLResponse extends CachableResponse {
  /**
   *
   * @param htmlContent A string containing a full HTML document, or a readable stream.
   * @param request An optional request to check for etag headers.
   * @param etag An optional etag for the given `json` parameter.
   * @param cacheControlOptions Options to generate a cache control header.
   * @param headersInit Optional headers to add to the response.
   */
  constructor(
    htmlContent: string | ReadableStream,
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
