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

import { assert } from 'deno/testing/asserts'
import HTTP from 'keywork/platform/http'
import { CookieHeaders } from 'keywork/headers'

import { KeyworkSession } from 'keywork/session'

Deno.test('Session lifecycle', async () => {
  const headers = new HTTP.Headers()
  assert(!headers.has(CookieHeaders.Set), 'Headers are initially empty')

  const initialSession = new KeyworkSession(new HTTP.Request('http://localhost'))

  assert(initialSession.isNewSession, 'Session is new without cookie')

  initialSession._assignSessionHeaders(headers)

  assert(headers.has(CookieHeaders.Set), 'Cookie header has been set')

  const persistedSession = new KeyworkSession(
    new HTTP.Request('http://localhost', {
      headers: {
        [CookieHeaders.Read]: headers.get(CookieHeaders.Set)!,
      },
    })
  )

  assert(!persistedSession.isNewSession, 'Session has persisted from cookie')
})
