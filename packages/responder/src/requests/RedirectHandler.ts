import { StatusCodes } from 'http-status-codes'
import { IncomingRequestHandler } from './common.js'
import { KeyworkRequestHandler } from './KeyworkRequestHandler.js'

/**
 * A higher-order function for redirecting requests via `IncomingRequestHandler`.
 * @returns The incoming request handler.
 *
 * @example <caption>Creating a Worker that just redirects incoming requests.</caption>
 *
 *           ```ts
 *           const redirectToExample = new RedirectHandler('https://example.com')
 *
 *           export default redirectToExample
 *           ```
 */
export class RedirectHandler extends KeyworkRequestHandler {
  constructor(
    /** URL A url-like string or URL object */
    public destinationURL: string | URL,
    /** An optional status code. Defaults to `302` */
    public statusCode: number = StatusCodes.MOVED_TEMPORARILY
  ) {
    super()
  }

  onRequest: IncomingRequestHandler<null, null> = ({ request }) => {
    this.logger.info(`Redirect from ${request.url} to ${this.destinationURL.toString()}`)

    return Response.redirect(this.destinationURL.toString(), this.statusCode)
  }
}
