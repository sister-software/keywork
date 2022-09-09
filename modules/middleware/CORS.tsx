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

import React from 'https://esm.sh/react@18.2.0'
import { useHeaders, useRequest, useServerEffect } from '../contexts/mod.ts'

import { HTTPMethod } from '../http/mod.ts'
import { RequestHandler } from '../router/mod.ts'
import { DURATION_ONE_DAY } from '../__internal/datetime.ts'

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

/**
 * @internal
 */
async function isOriginAllowed(requestOrigin: string, allowedOrigin: AllowedOrigins): Promise<boolean> {
  if (typeof allowedOrigin === 'string') {
    return requestOrigin === allowedOrigin
  }

  if (Array.isArray(allowedOrigin)) {
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

//  if (isPreflight || !response) {
//   responseWithCORSHeaders = new Response(null, {
//     headers: response?.clone()?.headers,
//     status: Status.NoContent,
//     statusText: response?.statusText || STATUS_TEXT[Status.NoContent],
//   })

interface CORSHeadersProps {
  /**
   * @defaultValue Any origin `'*'`
   */
  allowedOrigins?: AllowedOrigins
  /**
   * If true, allows credentials to be sent with the request.
   * Credentials are cookies, authorization headers, or TLS client certificates.
   * @defaultValue false
   */
  includeCredentials?: boolean
  /**
   * Indicates which headers can be exposed as part of the response by listing their names.
   * @defaultValue CORS-safelisted_response_header
   * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header MDN}
   */
  exposeHeaders?: string[]
  children: React.ReactNode | React.ReactNode[]
}

export const CORSHeaders: React.FC<CORSHeadersProps> = ({
  children,
  allowedOrigins = '*',
  includeCredentials = false,
  exposeHeaders = [
    'Cache-Control',
    'Content-Language',
    'Content-Length',
    'Content-Type',
    'Expires',
    'Last-Modified',
    'Pragma',
  ],
}) => {
  const request = useRequest()
  const responseHeaders = useHeaders()

  useServerEffect(
    async ({ setHeaders }) => {
      if (request.method === 'OPTIONS') return

      const requestOrigin = request.headers.get('Origin') || '*'
      const nextHeaders = new Headers(responseHeaders)

      if (allowedOrigins && typeof allowedOrigins === 'string') {
        nextHeaders.append('Access-Control-Allow-Origin', allowedOrigins)
      } else {
        const originAllowed = await isOriginAllowed(requestOrigin, allowedOrigins)

        nextHeaders.append('Access-Control-Allow-Origin', originAllowed ? requestOrigin : 'false')
      }

      // Indicate that server responses can differ based on the value of the Origin request header...
      if (allowedOrigins !== '*') {
        nextHeaders.append('Vary', 'Origin')
      }

      setHeaders(nextHeaders)
    },
    [allowedOrigins, includeCredentials, exposeHeaders]
  )

  return <>{children}</>
}

interface CORSPreflightHeadersProps {
  /**
   * Used in response to a preflight request to indicate which HTTP headers
   * can be used when making the actual request.
   *
   * Defaults to reflecting the headers specified in the incoming request's
   * `Access-Control-Request-Headers` header.
   */
  allowedHeaders?: string[]

  allowedMethods?: HTTPMethod[]

  /**
   * If provided, preflight responses can be cached for subsequent requests made to
   * the same URL using the `Access-Control-Max-Age` header.
   * The value is in seconds.
   *
   * @defaultValue `DURATION_ONE_DAY`
   */
  cachePreflightDuration: number
}

const CORSPreflightHeaders: React.FC<CORSPreflightHeadersProps> = ({
  allowedHeaders,
  allowedMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  cachePreflightDuration = DURATION_ONE_DAY,
}) => {
  const responseHeaders = useHeaders()
  const request = useRequest()

  useServerEffect(
    ({ setHeaders }) => {
      const nextHeaders = new Headers(responseHeaders)

      const allowHeadersContent = allowedHeaders?.length
        ? allowedHeaders.join(', ')
        : // Reflect the headers in the request...
          request.headers.get('Access-Control-Request-Headers')

      if (cachePreflightDuration) {
        nextHeaders.append('Access-Control-Max-Age', cachePreflightDuration.toString())
      }

      // Check if the request method is in the list of allowed methods...
      if (allowedMethods?.length) {
        nextHeaders.append('Access-Control-Allow-Methods', allowedMethods.join(', '))
      }

      if (allowHeadersContent) {
        nextHeaders.append('Access-Control-Allow-Headers', allowHeadersContent)
        // Indicate that server responses
        // can differ based on the given `'Access-Control-Request-Headers'`...
        nextHeaders.append('Vary', 'Access-Control-Request-Headers')
      }

      // Fixes issue where Safari (and potentially other browsers) hangs waiting for a body.
      nextHeaders.set('Content-Length', '0')

      setHeaders(nextHeaders)
    },
    [allowedHeaders, allowedMethods, cachePreflightDuration]
  )

  return null
}

export type CORSMiddlewareProps = CORSHeadersProps & CORSPreflightHeadersProps

export const CORSMiddleware: React.FC<CORSMiddlewareProps> = ({ children, ...props }) => {
  return (
    <>
      <RequestHandler pathname="*">
        <CORSPreflightHeaders {...props} />
      </RequestHandler>

      <RequestHandler allowedMethods="OPTIONS" pathname="*">
        <CORSHeaders {...props}>{children}</CORSHeaders>
      </RequestHandler>
    </>
  )
}

CORSMiddleware.displayName = 'CORSMiddleware'
