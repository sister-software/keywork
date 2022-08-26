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

import { Accepts } from 'https://deno.land/x/accepts@1.0.0/mod.ts'
import HTTP from '../../../__internal/http.ts'
import { KeyworkRouter, KeyworkRouterOptions, RouteRequestHandler } from '../../mod.ts'

/**
 * The compression format used when encoding the response body.
 *
 * - `"gzip"`: GZIP Compressed Data Format
 * - `"deflate"`: ZLIB Compressed Data Format
 * - `"deflate-raw"`: ZLIB Compressed Data Format (without header such as in a ZIP file)
 * @ignore
 */
export type CompressionEncoding = 'gzip' | 'deflate' | 'deflate-raw'

export class CompressionMiddleware extends KeyworkRouter {
  constructor(protected encodings: CompressionEncoding[] = ['gzip'], routerOptions?: KeyworkRouterOptions) {
    super(routerOptions)

    this.all('*', this.applyCompression)
  }
  protected applyCompression: RouteRequestHandler = async (event, next) => {
    const request = event.request
    const originalResponse = await next(request, event.env, event)
    const accepts = new Accepts(originalResponse.headers)
    if (!originalResponse.body) return originalResponse

    const [contentEncoding] = accepts.encodings(this.encodings)
    if (!contentEncoding) return originalResponse

    const stream = new CompressionStream(contentEncoding as CompressionEncoding)
    const response = new HTTP.Response(originalResponse.body.pipeThrough(stream), originalResponse.clone())
    response.headers.set('Content-Encoding', contentEncoding)

    return response
  }
}
