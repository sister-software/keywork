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

import { PrefixedLogger } from '@keywork/utils'
import { KeyworkSession } from '../KeyworkSession.js'
import { ErrorResponse } from '../responses/ErrorResponse.js'
import { HTMLResponse } from '../responses/HTMLResponse.js'
import { IncomingRequestData, PossiblePromise, RequestWithCFProperties, _HTTPMethod } from './common.js'

/**
 * An extendable base class for handling incoming requests from a Worker.
 *
 * In the "Module Worker" format, incoming HTTP events are handled by defining and exporting an object with method handlers corresponding to event names.
 *
 * To create a route handler, start by first extending the `KeyworkRequestHandler` class.
 * Your implementation must at least include a `onRequestGet` handler, or a method-agnostic `onRequest` handler.
 *
 * - Always attempt to handle runtime errors gracefully, and respond with `KeyworkResourceError` when necessary.
 *
 * @category Incoming Request Handlers
 */
export abstract class KeyworkRequestHandler<
  BoundAliases extends {} | null = null,
  StaticProps extends {} | null = null
> {
  /**
   * A server-side logger.
   */
  logger = new PrefixedLogger('Keywork Route Handler')

  //#region Request method dandlers

  /**
   * An incoming `GET` request handler.
   */
  onRequestGet?(data: IncomingRequestData<BoundAliases>): PossiblePromise<Response>

  /**
   * An incoming `POST` request handler.
   */
  onRequestPost?(data: IncomingRequestData<BoundAliases>): PossiblePromise<Response>

  /**
   * An incoming `PUT` request handler.
   */
  onRequestPut?(data: IncomingRequestData<BoundAliases>): PossiblePromise<Response>

  /**
   * An incoming `PATCH` request handler.
   */
  onRequestPatch?(data: IncomingRequestData<BoundAliases>): PossiblePromise<Response>

  /**
   * An incoming `DELETE` request handler.
   */
  onRequestDelete?(data: IncomingRequestData<BoundAliases>): PossiblePromise<Response>

  /**
   * An incoming `HEAD` request handler.
   */
  onRequestHead?(data: IncomingRequestData<BoundAliases>): PossiblePromise<Response>

  /**
   * An incoming `OPTIONS` request handler.
   */
  onRequestOptions?(data: IncomingRequestData<BoundAliases>): PossiblePromise<Response>

  /**
   * An incoming request handler for all HTTP methods.
   * @remarks This will always be a lower priority than an explicitly defined method handler.
   *
   */
  onRequest?(data: IncomingRequestData<BoundAliases>): PossiblePromise<Response>

  //#endregion

  //#region React

  /**
   * A method used to fetch static props for rendering React apps in your worker.
   */
  getStaticProps?(data: IncomingRequestData<BoundAliases>): PossiblePromise<StaticProps>

  /**
   * @internal
   */
  protected async _onRequestGetReactComponent(_data: IncomingRequestData<BoundAliases>): Promise<HTMLResponse> {
    return new HTMLResponse('')
  }

  //#endregion

  /**
   * @internal
   */
  _onInvalidRequest = ({ request }: IncomingRequestData<BoundAliases>) => {
    return new ErrorResponse(405, `Method ${request.method} was rejected.`)
  }

  private getHandlerForMethod(method: _HTTPMethod) {
    switch (method) {
      case 'GET':
        return this.onRequestGet
      case 'POST':
        return this.onRequestPost
      case 'PUT':
        return this.onRequestPut
      case 'PATCH':
        return this.onRequestPatch
      case 'DELETE':
        return this.onRequestDelete
      case 'HEAD':
        return this.onRequestHead
      case 'OPTIONS':
        return this.onRequestOptions
      default:
        return this.onRequest
    }
  }

  /**
   * The Worker's primary incoming fetch handler. This delegates to a method-specfic handler you define, such as `onGetRequest`.
   * @remarks Generally, `KeyworkRequestHandler#fetch` should not be used within your app.
   * This is instead automatically called by the Worker runtime when an incoming request is received.
   */
  fetch(
    /** The incoming request. */
    request: Request,
    /** The bound aliases, usually defined in your wrangler.toml file. */
    env: BoundAliases,
    /** The Worker context object.  */
    context: ExecutionContext
  ): Promise<Response> | Response {
    const handler = this.getHandlerForMethod(request.method as _HTTPMethod)

    const session = new KeyworkSession(request)
    const url = new URL(request.url)
    const data: IncomingRequestData<BoundAliases> = {
      request: request as RequestWithCFProperties,
      env: env as any,
      context,
      session,
      url,
    }

    try {
      if (!handler) return this._onInvalidRequest(data)

      return handler(data)
    } catch (_error) {
      this.logger.error(_error)
      this.logger.debug(data)
      return ErrorResponse.fromUnknownError(_error, 'A server error occurred. Please try again later.')
    }
  }
}
