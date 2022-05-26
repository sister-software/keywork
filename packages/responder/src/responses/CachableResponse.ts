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

import { StatusCodes } from 'http-status-codes'
import { isETagMatch } from '../etags/common.js'
import { CacheControlOptions, createCacheControlHeader } from '../headers/cacheControl.js'
import { NotModifiedResponse } from './NotModifiedResponse.js'

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
    cacheControlOptions?: Partial<CacheControlOptions>,
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
