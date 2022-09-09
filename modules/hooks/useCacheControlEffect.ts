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

import { setHeader } from '../contexts/ResponseContext.tsx'
import { castHeadersObjectToString } from '../http/mod.ts'

/**
 * Directives for the Cache-Control header.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control MDN}
 *
 * @category Server Hook
 * @category HTTP Headers
 * @public
 */
export interface CacheControlDirectives {
  [cacheControlKey: string]: number | boolean | string

  'max-age': number
  'must-revalidate': boolean
  immutable: boolean
  'max-stale': number
  'min-fresh': number
  'no-cache': boolean
  'no-store': boolean
  'no-transform': boolean
  'only-if-cached': boolean
  private: boolean
  'proxy-revalidate': boolean
  public: boolean
  's-maxage': number
  'stale-if-error': boolean
  'stale-while-revalidate': number
}

/**
 * A hook that sets the Cache-Control header.
 * @param directives The directives to set.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control MDN}
 */
export function useCacheControlEffect(directives: Partial<CacheControlDirectives>) {
  setHeader((currentHeaders) => {
    const nextHeaders = new Headers(currentHeaders)
    const cacheControlHeader = castHeadersObjectToString(directives)

    nextHeaders.set('Cache-Control', cacheControlHeader)

    return nextHeaders
  })
}
