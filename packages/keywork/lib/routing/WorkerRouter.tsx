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
import { ErrorResponse } from 'keywork/responses'
import { KeyworkSession } from 'keywork/sessions'
import { matchPath } from 'keywork/uri'
import { PrefixedLogger } from 'keywork/utilities'
import {
  HTTPMethod,
  IncomingRequestEvent,
  IncomingRequestEventData,
  NormalizedHTTPMethod,
  RequestWithCFProperties,
  WorkerRequestHandler,
} from './common.js'
import { ParsedRoute, RouteMethodDeclaration, RouteRequestHandler } from './RouteRequestHandler.js'

/**
 * Used in place of the reference-sensitive `instanceof`
 * @see {isRouterLike}
 * @ignore
 */
const $ClassID = 'Keywork.WorkerRouter'

const methodVerbToNormalized = new Map<HTTPMethod, NormalizedHTTPMethod>([
  ['GET', 'get'],
  ['POST', 'post'],
  ['PUT', 'put'],
  ['PATCH', 'patch'],
  ['DELETE', 'delete'],
  ['HEAD', 'head'],
  ['OPTIONS', 'options'],
  ['*', 'all'],
])

const normalizedMethodVerbs = Array.from(methodVerbToNormalized.values())

/**
 * Options to configure the Worker Router.
 */
export interface WorkerRouterOptions {
  /**
   * A display name used for debugging and log messages.
   * @defaultValue `'Keywork Router'`
   */
  displayName?: string
  /**
   * Middleware to apply to the router during construction. Middleware can also be applied via `WorkerRouter#use`.
   */
  middleware?: WorkerRouter<any>[]
}

/**
 * An extendable base class for handling incoming requests from a Worker.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam Data Optional extra data to be passed to a route handler.
 *
 * @ignore
 * @protected
 * @category Routers
 */
export class WorkerRouter<BoundAliases extends {} | null = null> {
  routesByVerb = new Map<NormalizedHTTPMethod, ParsedRoute<BoundAliases>[]>(
    normalizedMethodVerbs.map((normalizedVerb) => {
      return [normalizedVerb, []]
    })
  )

  /**
   * Given a normalized HTTP method verb, create a method handler.
   *
   * @remarks
   * Rather than define each normalized method declaration,
   * We iterate through a known set of method names to have a single implementation.
   *
   * This is mostly for internal use.
   */
  protected _addHTTPMethodHandler(
    normalizedVerb: NormalizedHTTPMethod,
    pathPattern: string,
    ...handlers: Array<RouteRequestHandler<BoundAliases, any, any>>
  ): void {
    const parsedHandlersCollection = this.routesByVerb.get(normalizedVerb)!

    const parsedHandlers = handlers.map((handler): ParsedRoute<BoundAliases> => {
      return {
        pathPattern,
        handler,
      }
    })

    parsedHandlersCollection.push(...parsedHandlers)
  }

  //#region Route declaration methods

  /**
   * Defines a handler for incoming `GET` requests.
   *
   * @remarks
   * The HTTP GET method requests a representation of the specified resource.
   * Requests using GET should only be used to request data.
   * The `params` object in the `IncomingRequestEvent` contains matched URL patterns
   * which can be used to pass routing data from a client.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET Documentation on MDN}
   *
   * @public
   */
  public get<ExpectedParams extends {} | null = null, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this._addHTTPMethodHandler('get', ...args)
  }

  /**
   * Defines a handler for incoming `POST` requests.
   *
   * @remarks
   * The HTTP POST method sends data to the server.
   * The type of the body of the request is indicated by the `Content-Type` header.
   *
   * @see {fileExtensionToContentTypeHeader}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST Documentation on MDN}
   *
   * @public
   */
  public post<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
    return this._addHTTPMethodHandler('post', ...args)
  }

  /**
   * Defines a handler for incoming `PUT` requests.
   *
   * @remarks
   * The HTTP PUT request method creates a new resource
   * or replaces a representation of the target resource with the request payload.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT Documentation on MDN}
   *
   * @public
   */
  public put<ExpectedParams extends {} | null = null, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this._addHTTPMethodHandler('put', ...args)
  }

  /**
   * Defines a handler for incoming `PATCH` requests.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH Documentation on MDN}
   *
   * @public
   */
  public patch<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
    return this._addHTTPMethodHandler('patch', ...args)
  }

  /**
   * Defines a handler for incoming `DELETE` requests.
   *
   * @remarks
   * The HTTP DELETE request method deletes the specified resource.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE Documentation on MDN}
   *
   * @public
   */
  public delete<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
    return this._addHTTPMethodHandler('delete', ...args)
  }

  /**
   * Defines a handler for incoming `HEAD` requests.
   *
   * @remarks
   * The HTTP HEAD method requests the headers that would be returned
   * if the HEAD request's URL was instead requested with the HTTP GET method.
   * For example, if a URL might produce a large download,
   * a HEAD request could read its Content-Length header to check the filesize
   * without actually downloading the file.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD Documentation on MDN}
   * @public
   */
  public head<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
    return this._addHTTPMethodHandler('head', ...args)
  }

  /**
   * Defines a handler for incoming `OPTIONS` requests.
   *
   * @remarks
   * The HTTP OPTIONS method requests permitted communication options for a given URL or server.
   * A client can specify a URL with this method, or an asterisk (*) to refer to the entire server.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS Documentation on MDN}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS Understanding CORS on MDN}
   *
   * @public
   */
  public options<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
    return this._addHTTPMethodHandler('options', ...args)
  }

  /**
   * Defines a handler for incoming all HTTP requests.
   *
   * @remarks
   * This will always be a **lower priority** than an explicitly defined method handler.

   * @public
   */
  public all<ExpectedParams extends {} | null = null, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this._addHTTPMethodHandler('all', ...args)
  }

  //#endregion

  //#region Router extension.

  /**
   * Combines additional routers and their respective route handlers to this router.
   *
   * @remarks
   * Route handlers are matched in the order of declaration.
   * If you want to use another router as middleware,
   * call `use` with the middleware router before defining your route handlers.
   *
   * ```ts
   * const authenticationRouter = new WorkerRouter()
   *
   * authenticationRouter.all('*', ({request, next}) => {
   *   if (!hasAuthCookie(request)) {
   *     return new KeyworkResourceError(401, "You need to be signed in to do that!")
   *   }
   *
   *   return next()
   * })
   *
   * const app = new WorkerRouter()
   *
   * app.use(authenticationRouter)
   *
   * app.get('/user/profile', ({request}) => {
   *   return new Response("Some user only content.")
   * })
   * ```
   *
   * @public
   * middleware by using the router.use() and router.METHOD() functions.
   */
  public use(...routers: WorkerRouter<any>[]): void {
    for (const router of routers) {
      this.applyRouter(router)
    }
  }

  /**
   * Blends a given router into the current route map.
   * @ignore
   */
  protected applyRouter(router: WorkerRouter<any>): void {
    for (const [verb, routes] of router.routesByVerb.entries()) {
      for (const route of routes) {
        this._addHTTPMethodHandler(verb, route.pathPattern, route.handler)
      }
    }
  }

  //#endregion

  //#region Construction

  /**
   * A display name used for debugging and log messages.
   */
  public displayName: string

  /**
   * A server-side logger.
   */
  public readonly logger: PrefixedLogger

  constructor(options?: WorkerRouterOptions) {
    this.displayName = options?.displayName || 'Keywork Router'
    this.logger = new PrefixedLogger(this.displayName)

    if (options?.middleware) {
      this.use(...options.middleware)
    }
  }

  //#endregion

  /**
   * Returns a collection of route handlers for the given HTTP method.
   *
   * @internal
   */
  protected _getParsedRoutesForMethod(normalizedMethodVerb: NormalizedHTTPMethod): ParsedRoute<BoundAliases>[] {
    const verbs: readonly NormalizedHTTPMethod[] = [normalizedMethodVerb, 'all']

    const handlers = verbs.flatMap((verb) => this.routesByVerb.get(verb)!)

    return handlers
  }

  /**
   * The Worker's primary incoming fetch handler.
   *
   * @remarks
   * This delegates to a method-specific handler you define, such as `WorkerRouter#get`.
   * Generally, `WorkerRouter#fetch` should not be used within your app.
   * This is instead automatically called by the Worker runtime when an incoming request is received.
   *
   * @public
   */
  fetch: {
    (...args: Parameters<RouteRequestHandler<BoundAliases, any, any>>): Promise<Response>
    (...args: Parameters<WorkerRequestHandler<BoundAliases>>): Promise<Response>
  } = async (...args: unknown[]): Promise<Response> => {
    // First, normalize the arguments between Cloudflare Pages and Worker Sites...
    let eventContext: IncomingRequestEvent<BoundAliases, any, any>

    if (args.length >= 3) {
      // Worker Site...
      const [request, env, executionContext] = args as Parameters<WorkerRequestHandler<BoundAliases>>

      eventContext = {
        request,
        env,
        waitUntil: executionContext.waitUntil,
        data: {} as any,
        params: null,
        next: {} as any, // Defined below.
      }
    } else {
      // Args are already in a RouteRequestHandler shape.
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[eventContext] = args as Parameters<RouteRequestHandler<BoundAliases, any>>
    }

    eventContext.data = {
      ...eventContext.data,
      session: new KeyworkSession(eventContext.request),
    }

    const requestURL = new URL(eventContext.request.url)

    // With our event context constructed, we can check for any defined methods...
    // If a method exists and routes are defined, it acts like middleware.
    const normalizedMethodVerb = methodVerbToNormalized.get(eventContext.request.method as HTTPMethod)
    const routes = normalizedMethodVerb ? this._getParsedRoutesForMethod(normalizedMethodVerb) : null

    if (!normalizedMethodVerb || !routes || !routes.length) {
      return new ErrorResponse(StatusCodes.NOT_IMPLEMENTED)
    }

    // Given the current URL, attempt to find a matching route handler...
    const matchedRoutes = routes.filter((route) => {
      return matchPath(route.pathPattern, requestURL.pathname)
    })

    let routeIndex = 0

    eventContext.next = async (input, requestInit) => {
      const matchedRoute = matchedRoutes[routeIndex]

      if (!matchedRoute) {
        if (routeIndex > 0) {
          return new ErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `\`eventContext.next()\` was called ${routeIndex + 1} times but only ${
              matchedRoutes.length
            } routes are defined for \`${requestURL.pathname}\``
          )
        }

        return new ErrorResponse(StatusCodes.NOT_FOUND, `No route matches \`${requestURL.pathname}\``)
      }

      if (input) {
        eventContext.request = new Request(input, requestInit) as RequestWithCFProperties
      }

      const response = await matchedRoute.handler({
        ...eventContext,
        next: (...args) => {
          routeIndex++
          return eventContext.next(...args)
        },
      })

      return response
    }

    try {
      return eventContext.next()
    } catch (_error) {
      this.logger.error(_error)
      this.logger.debug(eventContext)
      return ErrorResponse.fromUnknownError(_error, 'A server error occurred. Please try again later.')
    }
  };

  //#region Internal

  /** @ignore */
  readonly [$ClassID] = true as boolean
  /** @ignore */
  static readonly [$ClassID] = true as boolean

  //#endregion
}

/**
 * Checks if a given object is indeed a `WorkerRouter`
 *
 * This fixes some weirdness where `instanceof` may get clobbered
 * by a user's ESBuild configuration.
 *
 * @internal
 * @ignore
 */
export function isRouterLike<BoundAliases extends {} | null = null>(
  routerLike: unknown
): routerLike is WorkerRouter<BoundAliases> {
  return Boolean(
    routerLike instanceof WorkerRouter || (routerLike && typeof routerLike === 'object' && $ClassID in routerLike)
  )
}
