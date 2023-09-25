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

import { Deno } from '@deno/shim-deno'
import { CompressionMiddleware } from 'keywork/middleware/CompressionMiddleware'
import { RequestRouter } from 'keywork/router'
import { assertEquals } from 'keywork/testing'

const dStream = new DecompressionStream('gzip')

Deno.test('Router compresseses response body', async () => {
  const textDecoder = new TextDecoder()

  const app = new RequestRouter({
    displayName: 'Compression Middleware Tester',
    middleware: [new CompressionMiddleware('gzip')],
  })

  app.get('/', () => {
    return 'This body is automatically compressed!'
  })

  const rootResponse = await app.fetch(
    new Request('http://localhost/', {
      headers: { 'Accept-Encoding': 'gzip, deflate' },
    })
  )
  assertEquals(rootResponse.headers.get('Content-Encoding'), 'gzip', 'Content Encoding matches')
  const decompressedStream = rootResponse.body!.pipeThrough(dStream)
  const dReader = decompressedStream.getReader()
  const result = await dReader.read()

  const textContent = textDecoder.decode(result.value)

  assertEquals(textContent, 'This body is automatically compressed!', 'Text body matches')
})
