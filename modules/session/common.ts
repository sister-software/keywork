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

import { CookieSerializeOptions } from 'cookie'

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
