import { getReasonPhrase, StatusCodes } from 'http-status-codes'

/**
 * Given that a request's etag header matches an server entity or resource,
 * a `NotModifiedResponse` should be sent to the requestor as an indication that the client's cache is still applicable.
 */
export class NotModifiedResponse extends Response {
  constructor(etag: string) {
    super(undefined, {
      status: StatusCodes.NOT_MODIFIED,
      statusText: getReasonPhrase(StatusCodes.NOT_MODIFIED),
      headers: { ETag: etag },
    })
  }
}
