import { PrefixedLogger } from '@keywork/utils'
import { KeyworkSession } from '../KeyworkSession.js'
import { ErrorResponse } from '../responses/ErrorResponse.js'
import { HTTPMethod, IncomingRequestData, IncomingRequestHandler, RequestWithCFProperties } from './common.js'

/**
 * An object containing the Worker's primary fetch handler for all incoming requests.
 * Usually, this is the Worker's `default` and only export.
 */
export interface KeyworkRequestHandler<BoundAliases extends {} | null = null> extends ExportedHandler<BoundAliases> {
  /**
   * An incoming `GET` request handler.
   *
   * @see `WorkerRouteHandler`
   */
  onRequestGet?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `POST` request handler.
   *
   * @see `WorkerRouteHandler`
   */
  onRequestPost?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `PUT` request handler.
   *
   * @see `WorkerRouteHandler`
   */
  onRequestPut?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `PATCH` request handler.
   *
   * @see `WorkerRouteHandler`
   */
  onRequestPatch?: IncomingRequestHandler<BoundAliases>
  /**
   * An incoming `DELETE` request handler.
   *
   * @see `WorkerRouteHandler`
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
   * @see `WorkerRouteHandler`
   */
  onRequestOptions?: IncomingRequestHandler<BoundAliases>

  /**
   * An incoming request handler for all HTTP methods.
   * @remark This will always be a lower priority than an explicitly defined method handler.
   *
   * @see `WorkerRouteHandler`
   */
  onRequest?: IncomingRequestHandler<BoundAliases>
}

/**
 * In the "Module Worker" format, incoming HTTP events are handled by defining and exporting an object with method handlers corresponding to event names.
 *
 * To create a route handler, start by first extending the `AbstractRouteHandler` class.
 * Your implementation must at least include a `onRequestGet` handler, or a method-agnostic `onRequest` handler.
 * You may also specify
 *
 * @example
 * ```ts
 * class TodoListWorker extends AbstractRouteHandler {
 *   onRequestGet: WorkerRouteHandler<Partial<Params>, BoundAliases> = async ({request, env, context, session}) => {
 *    const params = parsePathname('/todos/:todoID', request)
 *    const todo = await fetchTodos(params.todoID)
 *    return new JSONResponse(todo)
 *   }
 * }
 *```
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
   * The Worker's primary incoming fetch handler.
   */
  fetch(request: Request, env: BoundAliases, context: ExecutionContext): Promise<Response> | Response {
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
