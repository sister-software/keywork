import { StatusCodes } from 'http-status-codes'
import { WorkerRouteHandler } from './common.js'

export type CreateRedirectHandler = (destinationURL: string | URL, statusCode?: number) => WorkerRouteHandler

export const createRedirectHandler: CreateRedirectHandler = (
  destinationURL,
  statusCode = StatusCodes.MOVED_TEMPORARILY
) => {
  const handleRedirect: WorkerRouteHandler = ({ request }) => {
    console.debug(`Redirect from ${request.url} to ${destinationURL.toString()}`)

    return Response.redirect(destinationURL.toString(), statusCode)
  }

  return handleRedirect
}
