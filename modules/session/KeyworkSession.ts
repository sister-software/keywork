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

import { KeyworkRouter } from 'keywork/router/worker'
import type { RouteRequestHandler } from 'keywork/router/route'
import {
  CookieSerializeOptions,
  parse as parseCookies,
  serialize as serializeCookies,
} from 'https://esm.sh/cookie@0.5.0'
import { ulid } from 'keywork/ids'
import type { CookieHeaders } from 'keywork/http/headers'
import { DEFAULT_SESSION_COOKIE_KEY, DEFAULT_COOKIE_SERIALIZE_OPTIONS, SessionMiddlewareOptions } from './common.ts'

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

export class SessionMiddleware extends KeyworkRouter {
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

    const response = await next(event.request, event.env, event)
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
