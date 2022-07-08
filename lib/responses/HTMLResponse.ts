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

import { CacheControlDirectives, fileExtensionToContentTypeHeader } from 'keywork/headers'
import { CachableResponse } from 'keywork/responses'

/**
 * A response that returns a full HTML document.
 *
 * @remarks
 * `HTMLResponse` automatically handles several types of HTML response bodies.
 * For further details on each HTML body type, see the constructors below.
 *
 * @see {JSXResponse}
 * @category HTTP Response
 * @public
 */
export class HTMLResponse extends CachableResponse {
  /**
   * An HTML response that uses a string containing HTML.
   */
  constructor(
    /**
     * A full stringified HTML document.
     */
    htmlContent: string,
    /** An optional request to check for etag headers. */
    request?: Request,
    /** An optional etag for the given `json` parameter. */
    etag?: string,
    /** Options to generate a cache control header. */
    cacheControlOptions?: CacheControlDirectives,
    /** Headers to add to the response. */
    headersInit?: HeadersInit
  )
  /**
   * An HTML response with a stream containing HTML.
   */
  constructor(
    /**
     * A `ReadableStream` containing the HTML document.
     */
    htmlContent: ReadableStream,
    /** An optional request to check for etag headers. */
    request?: Request,
    /** An optional etag for the given `json` parameter. */
    etag?: string,
    /** Options to generate a cache control header. */
    cacheControlOptions?: CacheControlDirectives,
    /** Headers to add to the response. */
    headersInit?: HeadersInit
  )

  constructor(
    /**
     * A string containing a full HTML document, or a readable stream.
     */
    htmlLike: string | ReadableStream,
    /** An optional request to check for etag headers. */
    request?: Request,
    /** An optional etag for the given `json` parameter. */
    etag?: string,
    /** Options to generate a cache control header. */
    cacheControlOptions?: CacheControlDirectives,
    /** Headers to add to the response. */
    headersInit?: HeadersInit
  ) {
    super(htmlLike, request, etag, cacheControlOptions, {
      ...fileExtensionToContentTypeHeader('html'),
      ...headersInit,
    })
  }
}
