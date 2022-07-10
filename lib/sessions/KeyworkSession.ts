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

import { CookieSerializeOptions, parse as parseCookies, serialize as serializeCookies } from 'npm/cookie'
import { ulid } from '../ids/mod.ts'

/**
 * The default session cookie key.
 * @internal
 */
export const DEFAULT_SESSION_COOKIE_KEY = '_keyworkSessionID'

/**
 * The default cookie serialization options.
 * @internal
 */
export const DEFAULT_COOKIE_SERIALIZE_OPTIONS: CookieSerializeOptions = {
  sameSite: 'strict',
  secure: true,
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 90,
} as const

export interface KeyworkSessionOptions {
  /**
   * The key used to read from the cookie header.
   * @defaultValue {@link DEFAULT_SESSION_COOKIE_KEY}
   */
  cookieKey?: string

  /**
   * @defaultValue {@link DEFAULT_COOKIE_SERIALIZE_OPTIONS}
   */

  serializeOptions?: CookieSerializeOptions
}

/**
 * A simple session manager to aid in authenticating users.
 *
 * @category Session Management
 *
 */
export class KeyworkSession {
  /**
   * The user's current session ID, derived from the `Request` cookie header.
   */
  public readonly sessionID: string
  /**
   * `true` if this session has just been created.
   * `false` if the `Request` included a session cookie.
   */
  public readonly isNewSession: boolean

  /**
   * The key used to read from the cookie header.
   */
  public readonly cookieKey: string

  public serializeOptions: CookieSerializeOptions

  constructor(
    /** The incoming request */
    request: Request,
    options?: KeyworkSessionOptions
  )
  constructor(
    /**
     * The user's current session ID
     */
    sessionID: string,
    options?: KeyworkSessionOptions
  )
  constructor(
    /** The incoming request */
    requestOrSessionID: Request | string,
    options?: KeyworkSessionOptions
  ) {
    let sessionID: string
    this.cookieKey = options?.cookieKey || DEFAULT_SESSION_COOKIE_KEY
    this.serializeOptions = options?.serializeOptions || DEFAULT_COOKIE_SERIALIZE_OPTIONS

    if (typeof requestOrSessionID === 'string') {
      sessionID = requestOrSessionID
    } else {
      const cookies = parseCookies(requestOrSessionID.headers.get('Cookie') || '')
      sessionID = cookies[this.cookieKey]
    }

    if (sessionID) {
      this.sessionID = sessionID
      this.isNewSession = false
    } else {
      this.sessionID = ulid()
      this.isNewSession = true
    }
  }

  /**
   * @ignore
   */
  public _assignSessionHeaders(headers: Headers) {
    headers.set('Set-Cookie', serializeCookies(this.cookieKey, this.sessionID, this.serializeOptions))
  }
}
