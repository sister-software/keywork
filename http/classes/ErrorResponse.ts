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

import { KeyworkResourceError, Status, STATUS_TEXT } from 'keywork/errors'

/**
 * An error response sent to a client when a request is deemed to be invalid in some way.
 *
 * @category HTTP Response
 * @category Error
 */
export class ErrorResponse extends Response {
  /**
   * Given an error-like object, attempt to respond with a `KeyworkResourceError`.
   *
   * ```ts
   * try {
   *   result = await fetchFoobarResource()
   * } catch (error) {
   *   // Log the error internally...
   *   logger.error(error)
   *
   *   // And then respond with a public reason...
   *   return new ErrorResponse(error, 'An error occured while fetching foobar.')
   * }
   * ```
   */
  constructor(
    /** Any kind of unknown error, usually from a try/catch block. */
    errorLike: unknown,
    /** A publically visible reason the error occurred, sent back to the client. */
    publicReason?: string,
    /**
     *  Headers to include with the response.
     */
    headersInit?: HeadersInit
  )
  /**
   * Given an invalid request that goes against your application logic,
   * construct a custom error response.
   */
  constructor(
    /**
     * An optional HTTP response status code.
     */
    status?: Status,
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
  )
  constructor(...args: any[]) {
    let status: Status
    let statusText: string
    let body: BodyInit | null
    let headersInit: HeadersInit

    if (args[0] instanceof Error) {
      const resourceAccessError = KeyworkResourceError.assertIsInstanceOf(args[0])
        ? args[0]
        : new KeyworkResourceError(args[0])

      status = resourceAccessError.status
      statusText = args[1]
      body = null
      headersInit = args[2]
    } else {
      status = args[0] || Status.InternalServerError
      // The final fallback ensures that an unknown `status` number still produces a `statusText`.
      statusText = args[1] || STATUS_TEXT[status] || STATUS_TEXT[Status.InternalServerError]
      body = args[2]
      headersInit = args[3]
    }

    super(body, {
      status,
      statusText,
      headers: headersInit,
    })
  }
}
