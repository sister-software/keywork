import { CachableResponse } from 'packages/responder/src/CachableResponse.mjs'
import { fileExtensionToContentTypeHeader } from './files.mjs'
import { CacheControlOptions } from './headers.mjs'

/**
 * A response sent to the client containing a JSON object.
 * @remark Etag caching is supported when `JSONResponse` is constructed with the needed parameters.
 * You may want to disable caching in your browser development tools to avoid this behavior while debugging.
 */
export class JSONResponse extends CachableResponse {
  /**
   * @remark Etag caching is supported when `JSONResponse` is constructed with the needed parameters.
   * You may want to disable caching in your browser development tools to avoid this behavior while debugging.
   *
   * @param json A non-cyclical object capable of JSON serialization.
   * @param request An optional request to check for etag headers.
   * @param etag An optional etag for the given `json` parameter.
   * @param headersInit Optional headers to add to the response.
   * @param pretty Optional indenting of the JSON.
   */
  constructor(
    json: {},
    request?: Request,
    etag?: string,
    cacheControlOptions?: CacheControlOptions,
    headersInit?: HeadersInit,
    pretty = false
  ) {
    super(JSON.stringify(json, null, pretty ? 2 : undefined), request, etag, cacheControlOptions, {
      ...fileExtensionToContentTypeHeader('json'),
      ...headersInit,
    })
  }
}
