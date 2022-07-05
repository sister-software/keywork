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

import { StatusCodes } from 'http-status-codes'
import { PrefixedLogger } from '../utilities/logger.js'
import { RouteRequestHandler } from './RouteRequestHandler.js'

/**
 * A route request handler for redirecting requests.
 *
 * @returns The incoming request handler.
 *
 * @example
 * Creating a Worker that just redirects incoming requests.
 *
 * ```ts
 * const redirectToExample = new RedirectHandler('https://example.com')
 *
 * export default redirectToExample
 * ```
 *
 * @category Request Handler
 * @public
 */
export function createRouteRedirect(
  /** URL A url-like string or URL object */
  destinationURL: string | URL,
  /**
   * An optional status code.
   * @defaultValue `302` MOVED_TEMPORARILY
   */
  statusCode: number = StatusCodes.MOVED_TEMPORARILY
): RouteRequestHandler {
  const logger = new PrefixedLogger('Redirect')

  const routeRequestHandler: RouteRequestHandler = ({ request }) => {
    logger.info(`Redirecting from ${request.url} to ${destinationURL.toString()}`)

    return Response.redirect(destinationURL.toString(), statusCode)
  }

  return routeRequestHandler
}
