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

import { KeyworkResourceError, Status } from 'keywork/errors'
import { ReactRendererOptions, renderJSXToStream } from 'keywork/react/isomorphic'
import { ErrorResponse } from './ErrorResponse.ts'
import { HTMLResponse } from './HTMLResponse.ts'
import { JSONResponse } from './JSONResponse.ts'
import { isValidElement } from 'https://esm.sh/react@18.2.0'
import HTTP from 'keywork/http'
import Stream from 'keywork/stream'

/**
 * Either a full `Response`, or a more primitive value to be processed.
 * @public
 */
export type ResponseLike = globalThis.Response | React.ReactElement | {} | null | undefined | Error | string

/**
 * Checks if the given object is an instance of `Response`
 * @param responsish An object that's possibly a `Response`
 * @category Type Cast
 */
export function isInstanceOfResponse(responsish: unknown): responsish is globalThis.Response {
  return Boolean(responsish instanceof globalThis.Response || responsish instanceof HTTP.Response)
}

/**
 * Infers the appropriate Response constructor for the given `ResponseLike` body.
 * @throws {KeyworkResourceError}
 * @category Type Cast
 * @public
 */
export async function castToResponse(
  responseLike: ResponseLike,
  reactRenderOptions?: ReactRendererOptions
): Promise<globalThis.Response> {
  if (isInstanceOfResponse(responseLike)) {
    return responseLike
  }

  if (responseLike instanceof Error) return new ErrorResponse(responseLike)

  if (responseLike instanceof Stream.ReadableStream) {
    throw new KeyworkResourceError(
      `Keywork cannot infer the 'Content-Type' for \`ReadableStream\`. Instead, wrap this value in a \`Response\``,
      Status.InternalServerError
    )
  }

  if (!responseLike) {
    return new HTTP.Response(responseLike as any, { status: Status.NoContent })
  }

  if (typeof responseLike === 'string') {
    if (responseLike.startsWith('<!DOCTYPE')) {
      return new HTMLResponse(responseLike)
    }

    return new HTTP.Response(responseLike)
  }

  if (isValidElement(responseLike)) {
    const stream = await renderJSXToStream(responseLike, reactRenderOptions)
    return new HTMLResponse(stream)
  }

  if (typeof responseLike === 'object') {
    return new JSONResponse(responseLike)
  }

  throw new KeyworkResourceError(
    `Keywork could not infer the appropriate \`Response\` constructor for type ${typeof responseLike}. `,
    Status.InternalServerError
  )
}

/**
 * HTTP Status codes associated with a `Response.body === null`
 * @see {@link https://fetch.spec.whatwg.org/#null-body-status WHATWG Spec}
 *
 */
const NULL_BODY_STATUSES = new Set([101, 204, 205, 304])

/**
 * Clones a given `Response` as a mutable instance.
 */
export function cloneAsMutableResponse(response: globalThis.Response) {
  return new globalThis.Response(
    // This shouldn't be confused with `response.bodyIsUsed`
    // https://fetch.spec.whatwg.org/#dom-body-bodyused
    NULL_BODY_STATUSES.has(response.status) ? null : response.body,
    response
  )
}

/**
 * Determines if the given HTTP status code is informational.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#information_responses}
 */
export const isInformational = (status: number) => status > 99 && status < 200

/**
 * Determines if the given HTTP status code is successful.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses}
 */
export const isSuccessful = (status: number) => status > 199 && status < 300

/**
 * Determines if the given HTTP status status is a redirection.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages}
 */
export const isRedirection = (status: number) => status > 299 && status < 400

/**
 * Determines if the given HTTP status status is a client error.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses}
 */
export const isClientError = (status: number) => status > 399 && status < 500

/**
 * Determines if the given HTTP status status is a server error.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses}
 */
export const isServerError = (status: number) => status > 499 && status < 600
