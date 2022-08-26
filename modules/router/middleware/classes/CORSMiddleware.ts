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

import { Status } from '../../../errors/KeyworkResourceError.ts'
import { Conditionals, CORSHeaders } from '../../../http/headers/mod.ts'
import { HTTPMethod } from '../../../http/mod.ts'
import { DURATION_ONE_DAY } from '../../../__internal/datetime.ts'
import HTTP from '../../../__internal/http.ts'
import { KeyworkRouter, KeyworkRouterOptions, RouteRequestHandler } from '../../mod.ts'

/** @ignore */
export type AllowedOrigins = string | string[] | boolean | RegExp

export interface CORSOptions {
  /**
   * @defaultValue Any origin `'*'`
   */
  origin?: AllowedOrigins
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
  credentials: boolean
  /**
   * Indicates which headers can be exposed as part of the response by listing their names.
   * @defaultValue CORS-safelisted_response_header
   * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header MDN}
   */
  exposeHeaders: string[]
}

function createDefaultCORSOptions(): CORSOptions {
  return {
    origin: '*',
    allowedMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    cachePreflightDuration: DURATION_ONE_DAY,
    credentials: false,
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

/**
 * @internal
 */
function isOriginAllowed(requestOrigin: string, allowedOrigin: AllowedOrigins): boolean {
  if (typeof allowedOrigin === 'string') {
    return requestOrigin === allowedOrigin
  }

  if (Array.isArray(allowedOrigin)) {
    return allowedOrigin.some((origin) => isOriginAllowed(requestOrigin, origin))
  }

  if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(requestOrigin)
  }

  return !!allowedOrigin
}

export class CORSMiddleware extends KeyworkRouter {
  protected corsOptions: CORSOptions

  constructor(corsOptions: Partial<CORSOptions>, routerOptions?: KeyworkRouterOptions) {
    super(routerOptions)
    this.corsOptions = {
      ...createDefaultCORSOptions(),
      ...corsOptions,
    }

    this.all('*', this.applyCORSHeaders)
  }

  protected applyCORSHeaders: RouteRequestHandler = async (event, next) => {
    const request = event.request
    const requestOrigin = request.headers.get('Origin') || '*'
    const originalResponse = await next(request, event.env, event)
    const response = originalResponse.clone()

    const {
      //
      origin = '*',
      allowedMethods,
      allowedHeaders,
      cachePreflightDuration,
      credentials,
      exposeHeaders,
    } = this.corsOptions

    const appendCORSHeader = <T extends CORSHeaders & Conditionals>(name: keyof T, value: T[keyof T]) => {
      response.headers.append(name, value)
    }

    if (typeof origin === 'string') {
      appendCORSHeader('Access-Control-Allow-Origin', origin)
    } else {
      appendCORSHeader('Access-Control-Allow-Origin', isOriginAllowed(requestOrigin, origin) ? requestOrigin : 'false')
    }

    // Indicate that server responses can differ based on the value of the Origin request header...
    if (origin !== '*') {
      appendCORSHeader('Vary', 'Origin')
    }

    appendCORSHeader('Access-Control-Allow-Methods', allowedMethods.join(', '))

    if (credentials) {
      appendCORSHeader('Access-Control-Allow-Credentials', 'true')
    }

    if (exposeHeaders?.length) {
      appendCORSHeader('Access-Control-Expose-Headers', exposeHeaders.join(','))
    }

    // Check if we're handling a preflight request...
    if (event.request.method === 'OPTIONS') {
      if (cachePreflightDuration) {
        appendCORSHeader('Access-Control-Max-Age', cachePreflightDuration.toString())
      }

      // Check if the request method is in the list of allowed methods...
      if (allowedMethods?.length) {
        appendCORSHeader('Access-Control-Allow-Methods', allowedMethods.join(','))
      }

      const allowHeadersContent = allowedHeaders?.length
        ? allowedHeaders.join(', ')
        : // Reflect the headers in the request...
          request.headers.get('Access-Control-Request-Headers')

      if (allowHeadersContent) {
        appendCORSHeader('Access-Control-Allow-Headers', allowHeadersContent)
        // Indicate that server responses
        // can differ based on the given `'Access-Control-Request-Headers'`...
        appendCORSHeader('Vary', 'Access-Control-Request-Headers')
      }

      // Fixes issue where Safari (and potentially other browsers) hangs waiting for a body.
      response.headers.set('Content-Length', '0')

      return new HTTP.Response(null, {
        headers: response.headers,
        status: Status.NoContent,
        statusText: response.statusText,
      })
    }

    return response
  }
}
