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

/// <reference types="../types/http.d.ts" />

import { useMemo } from 'https://esm.sh/react@18.2.0'

import { Accepts } from 'https://deno.land/x/accepts@1.0.0/mod.ts'
import { useResponseEffect } from '../contexts/mod.ts'
import { useRequest } from '../contexts/RequestContext.tsx'

import { useLogger } from '../contexts/LoggerContext.ts'
import { shouldCompress } from '../http/mod.ts'
import type { MimeDatabase } from '../types/mime-db.d.ts'

const compressionStreamIsSupported = typeof CompressionStream === 'function'

/**
 * The compression format used when encoding the response body.
 *
 * - `"gzip"`: GZIP Compressed Data Format
 * - `"deflate"`: ZLIB Compressed Data Format
 * - `"deflate-raw"`: ZLIB Compressed Data Format (without header such as in a ZIP file)
 * @ignore
 */
export type CompressionEncoding = 'gzip' | 'deflate'

export interface CompressionProps {
  encodings: CompressionEncoding | CompressionEncoding[]
  /**
   * An optional database of MIME type information,
   * such as the [`mime-db`](https://www.npmjs.com/package/mime-db) package
   */
  db?: MimeDatabase
}

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
 *
 * @cateogry Middleware
 * @category Server Hook
 */
export function useCompressionEffect({ encodings = ['gzip'], db }: CompressionProps) {
  const request = useRequest()
  const logger = useLogger('Middleware (Compression)')
  const preferredClientEncoding = useMemo<CompressionEncoding | undefined>(() => {
    const accepts = new Accepts(request.headers)
    const acceptedEncodings = accepts.encodings(
      Array.isArray(encodings) ? encodings : [encodings]
    ) as CompressionEncoding[]

    return acceptedEncodings[0]
  }, [request, encodings])

  useResponseEffect((currentResponse) => {
    logger.debug('Intercepting response...')

    if (!currentResponse || !currentResponse.body) {
      logger.debug('Response lacks body. Skipping...')

      return currentResponse
    }

    if (!preferredClientEncoding) {
      logger.debug('Client does not accept any of the provided encodings. Skipping...')
      return currentResponse
    }

    const contentTypeHeader = currentResponse.headers.get('Content-Type')

    if (!shouldCompress(contentTypeHeader, db)) {
      logger.debug('Content-Type is not compressible. Skipping...')
      return currentResponse
    }

    if (!compressionStreamIsSupported) {
      logger.debug('CompressionStream is not supported in this runtime. Skipping...')
      return currentResponse
    }

    logger.debug('Applying compression to response body...')

    const compressionStream = new CompressionStream(preferredClientEncoding)
    const stream = currentResponse.body.pipeThrough(compressionStream)

    const compressedResponse = new Response(stream, currentResponse)
    compressedResponse.headers.set('Content-Encoding', preferredClientEncoding)

    return compressedResponse
  })
}
