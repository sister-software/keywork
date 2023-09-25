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

/// <reference types="../types/http" />

import { KeyworkResourceError, Status } from 'keywork/errors'
import { Accepts, shouldCompress } from 'keywork/http'
import { RequestRouter, RequestRouterOptions, RouteRequestHandler } from 'keywork/router'
import type { MimeDatabase } from 'keywork/types/mime-db'

/**
 * The compression format used when encoding the response body.
 *
 * - `"gzip"`: GZIP Compressed Data Format
 * - `"deflate"`: ZLIB Compressed Data Format
 * - `"deflate-raw"`: ZLIB Compressed Data Format (without header such as in a ZIP file)
 * @ignore
 */
export type CompressionEncoding = 'gzip' | 'deflate' | 'deflate-raw'

/**
 * Middleware that given a `Response` with a `body`,
 * compresses the contents according to a client's `Accept-Encoding` request header.
 *
 * ```ts runtime=node
 * import {RequestRouter} from 'keywork/router'
 *
 * const app = new RequestRouter()
 * app.use(new CompressionMiddleware('gzip'))
 *
 * app.get('/', (event) => {
 *  return 'This body is automatically compressed!'
 * })
 * ```
 *
 * :::info
 *
 * This middleware is not necessary on Cloudflare as it is automatically applied
 * by the Workers runtime.
 *
 * :::
 *
 * :::info
 *
 * Deno Deploy automatically applies compression to responses when possible.
 *
 * Read more about from Deno Deploy's [compression docs](https://deno.com/deploy/docs/compression).
 *
 * :::
 */
export class CompressionMiddleware extends RequestRouter {
  protected supportedServerEncodings: CompressionEncoding[]
  protected db?: MimeDatabase

  constructor(
    encodings: CompressionEncoding | CompressionEncoding[] = ['gzip'],
    /**
     * An optional database of MIME type information,
     * such as the [`mime-db`](https://www.npmjs.com/package/mime-db) package
     */
    db?: MimeDatabase,
    routerOptions?: RequestRouterOptions
  ) {
    super(routerOptions)

    if (typeof CompressionStream === 'undefined') {
      throw new KeyworkResourceError(
        'The compression middleware requires a runtime that supports `CompressionStream` constructor.',
        Status.NotImplemented
      )
    }

    this.db = db
    this.supportedServerEncodings = Array.isArray(encodings) ? encodings : [encodings]

    this.all('*', this.applyCompression)
  }
  protected applyCompression: RouteRequestHandler = async (event, next) => {
    const originalResponse = await next()
    if (!originalResponse || !originalResponse.body) return originalResponse

    const contentTypeHeader = originalResponse.headers.get('Content-Type')
    if (!shouldCompress(contentTypeHeader, this.db)) return originalResponse

    const accepts = new Accepts(event.request.headers)
    const [preferredClientEncoding] = accepts.encodings(this.supportedServerEncodings)
    if (!preferredClientEncoding) return originalResponse

    const compressionStream = new CompressionStream(preferredClientEncoding as CompressionFormat)
    const stream = originalResponse.body.pipeThrough(compressionStream)

    const response = new Response(stream, originalResponse)
    response.headers.set('Content-Encoding', preferredClientEncoding)

    return response
  }
}
