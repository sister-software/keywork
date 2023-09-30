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

/// <reference lib="WebWorker" />

import type { Conditionals, CORSHeaders } from 'keywork/http/headers'
import { DURATION_ONE_DAY } from 'keywork/utils'
import type { HTTPMethod } from './HTTPMethod.js'

/** @ignore */
export type AllowedOrigins =
  // Single origin
  | string
  // Array of origins
  | AllowedOrigins[]
  // True for any origin
  | boolean
  // RegExp of origins
  | RegExp
  // Async function that returns true for allowed origins
  | ((origin: string) => boolean | Promise<boolean>)

export interface CORSOptions {
  /**
   * @defaultValue Any origin `'*'`
   */
  allowedOrigins: AllowedOrigins
  allowedMethods: HTTPMethod[]
  /**
   * Used in response to a preflight request to indicate which HTTP headers
   * can be used when making the actual request.
   *
   * Defaults to reflecting the headers specified in the incoming request's
   * `Access-Control-Request-Headers` header.
   */
  allowedHeaders?: string[]

  /**
   * If provided, preflight responses can be cached for subsequent requests made to
   * the same URL using the `Access-Control-Max-Age` header.
   * The value is in seconds.
   *
   * @defaultValue `DURATION_ONE_DAY`
   */
  cachePreflightDuration: number
  /**
   * If true, allows credentials to be sent with the request.
   * Credentials are cookies, authorization headers, or TLS client certificates.
   * @defaultValue false
   */
  includeCredentials: boolean
  /**
   * Indicates which headers can be exposed as part of the response by listing their names.
   * @defaultValue CORS-safelisted_response_header
   * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header MDN}
   */
  exposeHeaders: string[]
}

/** @ignore */
export function createDefaultCORSOptions(): CORSOptions {
  return {
    allowedOrigins: '*',
    allowedMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    cachePreflightDuration: DURATION_ONE_DAY,
    includeCredentials: false,
    exposeHeaders: [
      'Cache-Control',
      'Content-Language',
      'Content-Length',
      'Content-Type',
      'Expires',
      'Last-Modified',
      'Pragma',
    ],
  }
}

/** @ignore */
function appendCORSHeader<T extends CORSHeaders & Conditionals>(response: Response, name: keyof T, value: T[keyof T]) {
  response.headers.append(name as string, value as string)
}

/**
 * @internal
 */
async function isOriginAllowed(requestOrigin: string, allowedOrigin: AllowedOrigins): Promise<boolean> {
  if (typeof allowedOrigin === 'string') {
    return requestOrigin === allowedOrigin
  }

  if (Array.isArray(allowedOrigin)) {
    console.log('is array', requestOrigin, allowedOrigin)
    for (const origin of allowedOrigin) {
      const originAllowed = await isOriginAllowed(requestOrigin, origin)
      if (originAllowed) return true
    }

    return false
  }

  if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(requestOrigin)
  }

  if (typeof allowedOrigin === 'function') {
    return allowedOrigin(requestOrigin)
  }

  return !!allowedOrigin
}

/** @ignore */
export type CORSHeaderApplier = (request: Request, response: Response, corsOptions: CORSOptions) => void | Promise<void>

/** @ignore */
export const applyOriginHeaders: CORSHeaderApplier = async (request, response, { allowedOrigins }) => {
  const requestOrigin = request.headers.get('Origin') || '*'

  if (allowedOrigins && typeof allowedOrigins === 'string') {
    appendCORSHeader(response, 'Access-Control-Allow-Origin', allowedOrigins)
  } else {
    const originAllowed = await isOriginAllowed(requestOrigin, allowedOrigins)

    appendCORSHeader(response, 'Access-Control-Allow-Origin', originAllowed ? requestOrigin : 'false')
  }

  // Indicate that server responses can differ based on the value of the Origin request header...
  if (allowedOrigins !== '*') {
    appendCORSHeader(response, 'Vary', 'Origin')
  }
}
/** @ignore */
export const applyCredentialsHeader: CORSHeaderApplier = (request, response: Response, { includeCredentials }) => {
  if (includeCredentials) {
    appendCORSHeader(response, 'Access-Control-Allow-Credentials', 'true')
  }
}

/** @ignore */
export const applyExposeHeadersHeader: CORSHeaderApplier = (request, response, { exposeHeaders }) => {
  if (exposeHeaders?.length) {
    appendCORSHeader(response, 'Access-Control-Expose-Headers', exposeHeaders.join(', '))
  }
}

/** @ignore */
export const applyPreflightHeaders: CORSHeaderApplier = (
  request,
  response,
  { cachePreflightDuration, allowedHeaders, allowedMethods }
) => {
  if (request.method !== 'OPTIONS') return

  const allowHeadersContent = allowedHeaders?.length
    ? allowedHeaders.join(', ')
    : // Reflect the headers in the request...
      request.headers.get('Access-Control-Request-Headers')

  if (cachePreflightDuration) {
    appendCORSHeader(response, 'Access-Control-Max-Age', cachePreflightDuration.toString())
  }

  // Check if the request method is in the list of allowed methods...
  if (allowedMethods?.length) {
    appendCORSHeader(response, 'Access-Control-Allow-Methods', allowedMethods.join(', '))
  }

  if (allowHeadersContent) {
    appendCORSHeader(response, 'Access-Control-Allow-Headers', allowHeadersContent)
    // Indicate that server responses
    // can differ based on the given `'Access-Control-Request-Headers'`...
    appendCORSHeader(response, 'Vary', 'Access-Control-Request-Headers')
  }

  // Fixes issue where Safari (and potentially other browsers) hangs waiting for a body.
  response.headers.set('Content-Length', '0')
}
