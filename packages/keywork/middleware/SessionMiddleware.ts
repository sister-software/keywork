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

import { CookieSerializeOptions, parse as parseCookies, serialize as serializeCookies } from 'cookie'
import type { CookieHeaders } from 'keywork/http/headers'
import { RequestRouter, RouteRequestHandler } from 'keywork/router'
import { ulid } from 'ulidx'

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

export interface SessionMiddlewareOptions {
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
export interface KeyworkSession {
  /**
   * The user's current session ID, derived from the `Request` cookie header.
   */
  sessionID: string

  /**
   * `true` if this session has just been created.
   * `false` if the `Request` included a session cookie.
   */
  isNewSession: boolean
}

/**
 * Middleware to manage and authenticate your users.
 *
 * ```ts
 * import { SessionMiddleware } from 'keywork/session'
 * import { RequestRouter } from 'keywork/router'
 *
 * const app = new RequestRouter({
 *   displayName: 'Session Tester',
 *   middleware: [new SessionMiddleware()],
 * })
 *
 * app.get('/', (event) => {
 *   const { session } = event.data
 *
 *   if (session.isNewSession) {
 *     return 'Hello there, new user!'
 *   }
 *
 *   return `Hello again, ${session.sessionID}!`
 * })
 * ```
 */
export class SessionMiddleware extends RequestRouter {
  /**
   * The key used to read from the cookie header.
   */
  public readonly cookieKey: string

  public readonly serializeOptions: CookieSerializeOptions

  constructor(sessionOptions: SessionMiddlewareOptions = {}) {
    super({
      displayName: 'Keywork Session Middleware',
    })

    this.cookieKey = sessionOptions?.cookieKey || DEFAULT_SESSION_COOKIE_KEY
    this.serializeOptions = sessionOptions?.serializeOptions || DEFAULT_COOKIE_SERIALIZE_OPTIONS

    this.all('*', this.applySession)
  }

  protected applySession: RouteRequestHandler = async (event, next) => {
    // @ts-ignore Generic Type
    const cookies = parseCookies(event.request.headers.get<CookieHeaders>('Cookie') || '')
    const sessionID = cookies[this.cookieKey]

    const session: KeyworkSession = sessionID
      ? {
          sessionID,
          isNewSession: true,
        }
      : {
          sessionID: ulid(),
          isNewSession: false,
        }

    event.data.session = session

    const response = await next()

    if (!response) return response

    const responseWithSession = response.clone()

    // @ts-ignore Generic Type
    responseWithSession.headers.set<CookieHeaders>(
      'Set-Cookie',
      serializeCookies(this.cookieKey, sessionID, this.serializeOptions)
    )

    return responseWithSession
  }
}

/**
 * Additional data associated with the `IsomorphicFetchEvent`.
 *
 * @category Request
 * @public
 */
export interface IsomorphicFetchEventData extends Record<string, unknown> {
  /**
   * The original URL associated with the `IsomorphicFetchEvent`.
   */
  session?: KeyworkSession
}
