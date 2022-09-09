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

/// <reference types="../../types/http.d.ts" />

import { Status } from '../../errors/mod.ts'

import { assertEquals } from 'deno/testing/asserts'
import { RequestRouter } from '../../router/mod.ts'
import { CompressionMiddleware } from './CompressionMiddleware.ts'

const dStream = new DecompressionStream('gzip')

Deno.test({
  name: 'Router compresseses response body',
  fn: async () => {
    const textDecoder = new TextDecoder()

    const app = new RequestRouter({
      debug: false,
      displayName: 'App Tester',
      middleware: [new CompressionMiddleware('gzip')],
    })

    app.get('/', () => {
      console.debug('Compression test body running')
      return new Response('This body is automatically compressed!', {
        headers: {
          'X-Test': 'Test',
        },
      })
    })

    const response = await app.fetch(
      new Request('http://localhost/', {
        headers: { 'Accept-Encoding': 'gzip, deflate' },
      })
    )

    console.debug('Response:', response.status, response.headers)

    assertEquals(response.status, Status.OK, 'Status is OK')

    assertEquals(response.headers.get('Content-Encoding'), 'gzip', 'Content Encoding matches')

    const decompressedStream = response.body!.pipeThrough(dStream)
    const dReader = decompressedStream.getReader()
    const result = await dReader.read()

    const textContent = textDecoder.decode(result.value)

    assertEquals(textContent, 'This body is automatically compressed!', 'Text body matches')
  },
})
