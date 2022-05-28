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
import { HTTPMethod, IncomingRequestData, IncomingRequestHandler, RequestWithCFProperties } from './common.js'

/**
 *
 * Foo bar baz
 * @example
 * A simple Todo list handler
 *
 * ```ts
 * interface GetTodoParams {
 *   todoID: string
 * }
 *
 * class TodoListWorker extends KeyworkRequestHandler {
 *   onRequestGet: WorkerRouteHandler = async ({request, env, context, session}) => {
 *     const params = parsePathname<GetTodoParams>('/todos/:todoID', request)
 *     const todo = await fetchTodos(params.todoID)
 *
 *     if (!todo) throw new KeyworkResourceError('TODO does not exist')
 *
 *     return new JSONResponse(todo)
 *   }
 * }
 * ```
 */

/**
 * An object containing the Worker's primary fetch handler for all incoming requests.
 * Usually, this is the Worker's `default` and only export.
 */
export interface KeyworkRequestHandler<BoundAliases extends {} | null = null> extends ExportedHandler<BoundAliases> {
  /**
   * An incoming `GET` request handler.
   *
   */
  onRequestGet?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `POST` request handler.
   *
   */
  onRequestPost?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `PUT` request handler.
   *
   */
  onRequestPut?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `PATCH` request handler.
   *
   */
  onRequestPatch?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `DELETE` request handler.
   *
   */
  onRequestDelete?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `HEAD` request handler.
   *
   * @see `WorkerRouteHandler`
   */
  onRequestHead?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `OPTIONS` request handler.
   *
   */
  onRequestOptions?: IncomingRequestHandler<BoundAliases>

  /**
   * An incoming request handler for all HTTP methods.
   * @remarks This will always be a lower priority than an explicitly defined method handler.
   *
   */
  onRequest?: IncomingRequestHandler<BoundAliases>
}

/**
 * An extendable base class for handling incoming requests from a Worker.
 *
 * In the "Module Worker" format, incoming HTTP events are handled by defining and exporting an object with method handlers corresponding to event names.
 *
 * To create a route handler, start by first extending the `KeyworkRequestHandler` class.
 * Your implementation must at least include a `onRequestGet` handler, or a method-agnostic `onRequest` handler.
 *
 * @example
 * A simple Todo list handler
 *
 * ```ts
 * interface GetTodoParams {
 *   todoID: string
 * }
 *
 * class TodoListWorker extends KeyworkRequestHandler {
 *   onRequestGet: WorkerRouteHandler = async ({request, env, context, session}) => {
 *     const params = parsePathname<GetTodoParams>('/todos/:todoID', request)
 *     const todo = await fetchTodos(params.todoID)
 *
 *     if (!todo) throw new KeyworkResourceError('TODO does not exist')
 *
 *     return new JSONResponse(todo)
 *   }
 * }
 * ```
 *
 * @example
 * Creating a more advanced request handler with a Keywork Collection.
 *
 * ```ts
 * import { StatusCodes } from 'http-status-codes'
 * import { KeyworkCollection } from '@keywork/collections'
 * import { KeyworkResourceError } from '@keywork/utils'
 * import { IncomingRequestHandler, KeyworkRequestHandler, parsePathname } from '@keywork/responder'
 *
 * interface ExampleAppBindings {
 *   exampleApp: KVNamespace
 * }
 *
 * interface GetUserParams {
 *   userID: string
 * }
 *
 * interface ExampleUser {
 *   firstName: string
 *   lastName: string
 *   role: 'member' | 'admin'
 *   plan: 'free' | 'paid'
 * }
 *
 * class UserAPIHandler extends KeyworkRequestHandler<ExampleAppBindings> {
 *   onRequestGet: IncomingRequestHandler<ExampleAppBindings> = async ({ request, env }) => {
 *     const { params } = parsePathname<GetUserParams>('/users/:userID', request)
 *     const usersCollection = new KeyworkCollection<ExampleUser>(env.exampleApp, 'users')
 *     const userRef = usersCollection.createDocumentReference(params.userID)
 *     const userSnapshot = await userRef.fetchSnapshot()
 *     if (!userSnapshot.exists) {
 *       throw new KeyworkResourceError('User does not exist', StatusCodes.BAD_REQUEST)
 *     }
 *     const user = userSnapshot.value
 *     if (user.plan !== 'paid') {
 *       throw new KeyworkResourceError('You must have a paid plan', StatusCodes.PAYMENT_REQUIRED)
 *     }
 *     if (user.role !== 'admin') {
 *       throw new KeyworkResourceError('Only an admin can access this page', StatusCodes.FORBIDDEN)
 *     }
 *   }
 * }
 * export default UserAPIHandler
 * ```
 *
 * @category Incoming Request Handlers
 */
export abstract class KeyworkRequestHandler<BoundAliases extends {} | null = null> {
  logger = new PrefixedLogger('Keywork Route Handler')

  private getHandlerForMethod(method: HTTPMethod): IncomingRequestHandler<BoundAliases> | undefined {
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
    const handler = this.getHandlerForMethod(request.method as HTTPMethod)
    if (!handler) return new ErrorResponse(405, `Method ${request.method} was rejected.`)

    const session = new KeyworkSession(request)
    const data: IncomingRequestData<BoundAliases> = {
      request: request as RequestWithCFProperties,
      env: env as any,
      context,
      session,
    }

    try {
      return handler(data)
    } catch (_error) {
      this.logger.error(_error)
      this.logger.debug(data)
      return ErrorResponse.fromUnknownError(_error, 'A server error occurred. Please try again later.')
    }
  }
}
