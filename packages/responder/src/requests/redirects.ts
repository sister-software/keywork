import { StatusCodes } from 'http-status-codes'
import { IncomingRequestHandler } from './common.js'

export type CreateRedirectHandler = (destinationURL: string | URL, statusCode?: number) => IncomingRequestHandler

export const createRedirectHandler: CreateRedirectHandler = (
  destinationURL,
  statusCode = StatusCodes.MOVED_TEMPORARILY
) => {
  const handleRedirect: IncomingRequestHandler = ({ request }) => {
    console.debug(`Redirect from ${request.url} to ${destinationURL.toString()}`)

    return Response.redirect(destinationURL.toString(), statusCode)
  }

  return handleRedirect
}
