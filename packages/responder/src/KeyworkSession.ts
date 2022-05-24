import { SnowflakeID } from '@keywork/utils'
import { parse as parseCookies, serialize as serializeCookies } from 'cookie'

export const DEFAULT_SESSION_COOKIE_KEY = '_keyworkSessionID'

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
