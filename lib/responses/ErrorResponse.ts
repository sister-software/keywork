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

import { Status, STATUS_TEXT } from 'deno/http/http_status'
import { KeyworkResourceError } from 'keywork/errors'
import { Response } from 'keywork/platform/http'

/**
 * An error response sent to a client when a request is invalid in some way.
 * @remarks If an error object is available and publically visible,
 * consider {@link ErrorResponse.fromUnknownError}
 *
 * @category HTTP Response
 * @category Error
 */
export class ErrorResponse extends Response {
  constructor(
    /**
     * An optional HTTP response status code.
     */
    status: Status = Status.InternalServerError,
    /**
     * An explanation for the error. Uses the `status` code as a default value.
     */
    statusText?: string,
    /**
     * Body to include with the response.
     */
    body?: BodyInit | null,
    /**
     *  Headers to include with the response.
     */
    headersInit?: HeadersInit
  ) {
    if (!statusText) {
      statusText = STATUS_TEXT[status] || STATUS_TEXT[Status.InternalServerError]
    }

    super(body, {
      status,
      statusText,
      headers: headersInit,
    })
  }

  /**
   * Given an error-like object, attempt respond with a `KeyworkResourceError`.
   *
   * @example
   * Handling a error from an incoming request.
   *
   * ```ts
   * try {
   *   result = await fetchFoobarResource()
   * } catch (error) {
   *   // Log the error internally...
   *   console.error(error)
   *
   *   // Respond with a public reason...
   *   return ErrorResponse.fromUnknownError(error, 'An error occured while fetching foobar.')
   * }
   * ```
   */
  static fromUnknownError(
    /** Any kind of unknown error, usually from a try/catch block. */
    _error: any,
    /** A publically visible reason the error occurred, sent back to the client. */
    publicReason?: string,
    /**
     *  Headers to include with the response.
     */
    headersInit?: HeadersInit
  ) {
    const resourceAccessError = KeyworkResourceError.fromUnknownError(_error)

    return new ErrorResponse(
      resourceAccessError.status,
      publicReason || STATUS_TEXT[Status.InternalServerError],
      undefined,
      headersInit
    )
  }
}
