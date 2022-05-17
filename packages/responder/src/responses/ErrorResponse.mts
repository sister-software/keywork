import { KeyworkResourceAccessError } from '@keywork/shared'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

/**
 * An error response sent to a client when a request is invalid in some way.
 * @remark If an error object is available and publically visible, consider `ErrorResponse.fromUnknownError`
 */
export class ErrorResponse extends Response {
  /**
   *
   * @param status An optional HTTP response status code.
   * @param statusText An optional explation for the error.
   * @param body An optional body to include with the response.
   * @param headersInit Optional headers to include with the response.
   */
  constructor(
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    statusText = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    body?: BodyInit | null,
    headersInit?: HeadersInit
  ) {
    super(body, {
      status,
      statusText,
      headers: headersInit,
    })
  }

  /**
   * Given an error-like object, attempt respond with a `KeyworkResourceAccessError`.
   */
  static fromUnknownError(_error: any, publicReason?: string) {
    const resourceAccessError = KeyworkResourceAccessError.fromUnknownError(_error)

    return new ErrorResponse(
      resourceAccessError.status,
      publicReason || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    )
  }
}
