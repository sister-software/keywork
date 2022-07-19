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

import { assertEquals, assertExists, assertObjectMatch } from 'deno/testing/asserts'
import { WorkerRouter } from 'keywork/routing/worker'
import { Request } from 'keywork/platform/http'

interface HelloResponseBody extends Record<PropertyKey, unknown> {
  url: string
  date: string
  message: string
}

Deno.test('Router receives requests', async () => {
  const app = new WorkerRouter()

  app.get('/', (event) => {
    const url = new URL(event.request.url)

    return `Hello from ${url.pathname}`
  })

  const jsonBody: HelloResponseBody = {
    url: '___',
    date: new Date().toJSON(),
    message: 'Keywork rocks!',
  }

  app.get('/hello.json', (event) => {
    const url = new URL(event.request.url)
    jsonBody.url = url.toString()

    return jsonBody
  })

  assertExists(app.match('GET', '/'), 'Root route exists')
  assertEquals(app.match('POST', '/'), null, 'Root route only exists on GET')

  assertExists(app.match('GET', '/hello.json'), 'JSON route exists')
  assertEquals(app.match('POST', '/hello.json'), null, 'JSON route only exists on GET')

  const rootRequest = await app.fetch(new Request('http://localhost/'))
  assertEquals(await rootRequest.text(), `Hello from /`)

  const JSONRequest = await app.fetch(new Request('http://localhost/hello.json'))
  assertObjectMatch(await JSONRequest.json(), jsonBody)
})
