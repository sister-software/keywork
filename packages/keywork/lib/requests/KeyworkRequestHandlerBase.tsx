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

import { PathPattern } from 'keywork/paths'
import { ErrorResponse } from 'keywork/responses'
import { PrefixedLogger } from 'keywork/utilities'
import { KeyworkSession } from '../sessions/KeyworkSession.js'
import { RequestWithCFProperties, _HTTPMethod } from './common.js'
import { IncomingRequestData, IncomingRequestDataHandler } from './IncomingRequestData.js'

/**
 * An extendable base class for handling incoming requests from a Worker.
 *
 * @ignore
 * @protected
 */
export abstract class _KeyworkRequestHandlerBase<BoundAliases extends {} | null = null> {
  /**
   * A `path-to-regexp` style pattern.
   *
   * @see {@link https://www.npmjs.com/package/path-to-regexp NPM Package}
   */
  static pattern: PathPattern<string> | string = '*'

  /**
   * @deprecated This property should be defined as a static member.
   * Did you mean `static pattern = '/:foo/:bar/:baz'`
   */
  protected readonly pattern = null as never

  /**
   * A server-side logger.
   */
  public logger = new PrefixedLogger('Keywork Route Handler')

  //#region Request method handlers
  // NOTE: Each method is marked as initialized to aid TypeScript's autocomplete.
  // Otherwise, `undefined` will be included.

  /**
   * An incoming `GET` request handler.
   *
   * @public
   */
  public onRequestGet!: IncomingRequestDataHandler<BoundAliases>

  /**
   * An incoming `POST` request handler.
   *
   * @public
   */
  public onRequestPost!: IncomingRequestDataHandler<BoundAliases>

  /**
   * An incoming `PUT` request handler.
   *
   * @public
   */
  public onRequestPut!: IncomingRequestDataHandler<BoundAliases>

  /**
   * An incoming `PATCH` request handler.
   *
   * @public
   */
  public onRequestPatch!: IncomingRequestDataHandler<BoundAliases>

  /**
   * An incoming `DELETE` request handler.
   *
   * @public
   */
  public onRequestDelete!: IncomingRequestDataHandler<BoundAliases>

  /**
   * An incoming `HEAD` request handler.
   *
   * @public
   */
  public onRequestHead!: IncomingRequestDataHandler<BoundAliases>

  /**
   * An incoming `OPTIONS` request handler.
   *
   * @public
   */
  public onRequestOptions!: IncomingRequestDataHandler<BoundAliases>

  /**
   * An incoming request handler for all HTTP methods.
   *
   * @remarks
   * This will always be a **lower priority** than an explicitly defined method handler.
   *
   * @public
   */
  public onRequest!: IncomingRequestDataHandler<BoundAliases>

  //#endregion

  /**
   * @internal
   */
  protected _onInvalidRequest = ({ request }: IncomingRequestData<BoundAliases>) => {
    return new ErrorResponse(405, `Method ${request.method} was rejected.`)
  }

  /**
   * Returns a specific handler for the given HTTP method.
   *
   * @internal
   */
  protected _getHandlerForMethod(method: _HTTPMethod) {
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
   * The Worker's primary incoming fetch handler.
   *
   * @remarks
   * This delegates to a method-specfic handler you define, such as `onGetRequest`.
   * Generally, `KeyworkRequestHandler#fetch` should not be used within your app.
   * This is instead automatically called by the Worker runtime when an incoming request is received.
   *
   * @protected
   */
  protected fetch(
    /** The incoming request. */
    request: Request,
    /** The bound aliases, usually defined in your wrangler.toml file. */
    env: BoundAliases,
    /** The Worker context object.  */
    context: ExecutionContext
  ): Promise<Response> | Response {
    const handler = this._getHandlerForMethod(request.method as _HTTPMethod)

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
