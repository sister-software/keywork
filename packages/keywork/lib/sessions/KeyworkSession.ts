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

import { parse as parseCookies, serialize as serializeCookies } from 'cookie'
import { SnowflakeID } from 'keywork/ids'

export const DEFAULT_SESSION_COOKIE_KEY = '_keyworkSessionID'

/**
 * A simple session manager to aid in authenticating users.
 *
 * @category Sessions & Cookies
 *
 * @beta This is under active development.
 */
export class KeyworkSession {
  public sessionID: string
  public readonly isNewSession: boolean

  constructor(request: Request, public cookieKey = DEFAULT_SESSION_COOKIE_KEY) {
    const cookies = parseCookies(request.headers.get('Cookie') || '')
    const storedSessionID = cookies[this.cookieKey]

    if (storedSessionID) {
      this.sessionID = storedSessionID
      this.isNewSession = false
    } else {
      this.sessionID = this.createClientID()
      this.isNewSession = true
    }
  }

  public assignSessionHeaders(headers: Headers) {
    headers.set(
      'Set-Cookie',
      serializeCookies(this.cookieKey, this.sessionID, {
        sameSite: 'strict',
        secure: true,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 90,
      })
    )
  }

  private createClientID() {
    const snowflake = new SnowflakeID()

    return snowflake.generate()
  }
}
