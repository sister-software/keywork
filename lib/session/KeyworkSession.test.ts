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

import { assertEquals, assert } from 'deno/testing/asserts'
import { WorkerRouter } from 'keywork/router/worker'
import { SessionMiddleware } from 'keywork/session'
import { CookieHeaders } from 'keywork/http/headers'
import HTTP from 'keywork/http'
import { parse as parseCookies } from 'cookie'

Deno.test('Session Middleware', async () => {
  const sessionMiddleware = new SessionMiddleware()
  const app = new WorkerRouter({
    displayName: 'Session Tester',
    middleware: [sessionMiddleware],
  })

  app.get('/', (event) => {
    const url = new URL(event.request.url)

    return `Hello from ${url.pathname}`
  })

  const rootResponse = await app.fetch(new HTTP.Request('http://localhost/'))
  assertEquals(await rootResponse.text(), `Hello from /`, 'Response has body')

  const cookieDough = rootResponse.headers.get<CookieHeaders>('Set-Cookie')

  assert(cookieDough, 'Request has cookie')
  const cookies = parseCookies(cookieDough)

  assert(cookies[sessionMiddleware.cookieKey], 'Cookies have session ID')
})
