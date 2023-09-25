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

import { Deno } from '@deno/shim-deno'
import { DURATION_ONE_DAY } from 'keywork/__internal/datetime'
import { Status } from 'keywork/errors'
import { CORSMiddleware } from 'keywork/middleware/CORSMiddleware'
import { RequestRouter } from 'keywork/router'
import { assertEquals } from 'keywork/testing'

Deno.test('Middleware sets defaults', async () => {
  const middleware = new CORSMiddleware()

  assertEquals(middleware.corsOptions.allowedOrigins, '*', 'Default allowed origins is *')
  assertEquals(
    middleware.corsOptions.cachePreflightDuration,
    DURATION_ONE_DAY,
    'Default preflight cache duration is 1 day'
  )

  assertEquals(
    new CORSMiddleware({ cachePreflightDuration: 0 }).corsOptions.cachePreflightDuration,
    0,
    'Default preflight cache can be overridden'
  )
})

Deno.test('Middleware sends preflight', async () => {
  const app = new RequestRouter({
    displayName: 'CORS Middleware Tester',
    middleware: [new CORSMiddleware()],
  })

  app.get('/', () => 'Hello from CORS')

  const response = await app.fetch(
    new Request('https://localhost/', {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    })
  )

  assertEquals(response.headers.get('Access-Control-Allow-Origin'), '*', 'Implicit origin is *')
  assertEquals(response.status, Status.NoContent, 'Options request has no content')
})

Deno.test('CORS middleware parses origins', async () => {
  const app = new RequestRouter({
    displayName: 'CORS Middleware Tester',
    middleware: [new CORSMiddleware({ allowedOrigins: ['https://localhost', 'https://api.example.com'] })],
  })

  app.get('/', () => 'Hello from CORS')

  const validResponse = await app.fetch(
    new Request('https://api.example.com', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://api.example.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    })
  )

  assertEquals(
    validResponse.headers.get('Access-Control-Allow-Origin'),
    'https://api.example.com',
    'Response origin reflects request origin'
  )

  const invalidResponse = await app.fetch(
    new Request('https://api.example.com', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://malicious.example.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    })
  )

  assertEquals(invalidResponse.headers.get('Access-Control-Allow-Origin'), 'false', 'Origin is false')
})
