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

import { CacheControlDirectives } from '../headers/cacheControl.ts'
import { fileExtensionToContentTypeHeader } from '../headers/contentType.ts'
import { CachableResponse } from './CachableResponse.ts'

/**
 * A response sent to the client containing a JSON object.
 *
 * @remarks Etag caching is supported when `JSONResponse` is constructed with the needed parameters.
 * You may want to disable caching in your browser development tools to avoid this behavior while debugging.
 * @category HTTP Response
 * @category JSON
 */
export class JSONResponse extends CachableResponse {
  constructor(
    /** A non-cyclical object capable of JSON serialization. */
    json: {},
    /** A request to check for etag headers. */
    request?: globalThis.Request,
    /** An etag for the given `json` parameter. */
    etag?: string,
    /** Options to generate a cache control header. */
    cacheControlOptions?: CacheControlDirectives,
    /** Headers to add to the response. */
    headersInit?: HeadersInit,
    /** Indenting of the JSON. Note that this may affect etag matching. */
    pretty = false
  ) {
    super(
      typeof json === 'string' ? json : JSON.stringify(json, null, pretty ? 2 : undefined),
      request,
      etag,
      cacheControlOptions,
      {
        ...fileExtensionToContentTypeHeader('json'),
        ...headersInit,
      }
    )
  }
}
