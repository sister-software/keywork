import { KeyworkResourceError } from '@keywork/utils'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

/**
 * An error response sent to a client when a request is invalid in some way.
 * @remark If an error object is available and publically visible, consider `ErrorResponse.fromUnknownError`
 *
 */
export class ErrorResponse extends Response {
  constructor(
    /** status An optional HTTP response status code. */
    status: number = StatusCodes.INTERNAL_SERVER_ERROR,
    /** statusText An optional explation for the error. */
    statusText = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    /** body An optional body to include with the response. */
    body?: BodyInit | null,
    /** headersInit Optional headers to include with the response. */
    headersInit?: HeadersInit
  ) {
    super(body, {
      status,
      statusText,
      headers: headersInit,
    })
  }

  /**
   * Given an error-like object, attempt respond with a `KeyworkResourceError`.
   *
   * @example <caption>Handling a error from an incoming request.</caption>
   *          ```ts
   *          try {
   *            result = await fetchFoobarResource()
   *          } catch (error) {
   *            // Log the error internally...
   *            console.error(error)
   *
   *            // Respond with a public reason...
   *            return ErrorResponse.fromUnknownError(error, 'An error occured while fetching foobar.')
   *          }
   *          ```
   */
  static fromUnknownError(
    /** Any kind of unknown error, usually from a try/catch block. */
    _error: any,
    /** A publically visible reason the error occurred, sent back to the client. */
    publicReason?: string
  ) {
    const resourceAccessError = KeyworkResourceError.fromUnknownError(_error)

    return new ErrorResponse(
      resourceAccessError.status,
      publicReason || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    )
  }
}
