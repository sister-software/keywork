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

import { ResponseHandler } from '../../http/mod.ts'

export interface DebuggingMiddlewareOptions {
  /**
   * Whether debugging headers should be included.
   * @defaultValue `true`
   */
  includeHeaders?: boolean
}

/**
 * Options to configure the Worker Router.
 * @category Options
 */
export interface RequestRouterOptions {
  // /**
  //  * A display name used for debugging and log messages.
  //  * @defaultValue `'Keywork Router'`
  //  */
  // displayName?: string
  // /**
  //  * Middleware to apply to the router during construction.
  //  * Middleware can also be applied after a router is created via `RequestRouter.use`.
  //  */
  // middleware?: Array<MiddlewareDeclarationLike>
  /**
   * An advanced option to override the router's default response handler.
   *
   * If you're using this option, it's recommend that you include the default parsers.
   *
   * ```ts
   * import { ResponseHandler, defaultResponseHandlerEntries } from 'keywork/http'
   *
   * const router = new RequestRouter({
   *   responseHandler: new ResponseHandler([
   *     ...defaultResponseHandlerEntries,
   *     yourCustomParser
   *   ])
   * })
   * ```
   *
   * @defaultValue `new KeyworkResponseHandler()`
   */
  responseHandler?: ResponseHandler
  /**
   * Options to configure debugging.
   * By default, this is enabled with minimal debugging.
   */
  debug?: DebuggingMiddlewareOptions | boolean
}
