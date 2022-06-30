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
import { KeyworkResourceError } from 'keywork/errors'
import { KeyworkHeaders } from 'keywork/headers'
import {
  KeyworkHTMLDocument,
  KeyworkHTMLDocumentComponent,
  KeyworkProviders,
  KeyworkProvidersComponent,
} from 'keywork/react/worker'
import { ErrorResponse } from 'keywork/responses'
import { KeyworkSession } from 'keywork/sessions'
import { compilePath, matchPathPrecompiled, normalizePathPattern, PathPattern } from 'keywork/uri'
import { Disposable, findSubstringStartOffset, PrefixedLogger } from 'keywork/utilities'
import { isKeyworkFetcher, KeyworkFetcher, WorkerRequestHandler } from '../fetcher.js'
import { HTTPMethod, methodVerbToRouterMethod, RouterMethod, routerMethodToHTTPMethod } from '../http.js'
import { IncomingRequestEvent, IncomingRequestEventData } from '../request.js'
import { ParsedRoute, RouteMatch, RouteMethodDeclaration, RouteRequestHandler } from '../RouteRequestHandler.js'
import { convertToResponse } from './body.js'
import { $ClassID, WorkerRouterOptions } from './common.js'

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
export class WorkerRouter<BoundAliases extends {} | null = null> implements KeyworkFetcher<BoundAliases>, Disposable {
  /**
   * This router's known routes, categorized by their normalized HTTP method verbs into arrays of route handlers.
   *
   * e.g.
   * ```
   * GET: [{'/', routeHandler1}, {'/foo/' routeHandler2}, {'/bar/', routeHandler3}...]
   * POST: [{'/', routeHandler1}, {'/foo/' routeHandler2}, {'/bar/', routeHandler3}...]
   * ...etc
   * ```
   *
   * Route handlers are prioritized in order of insertion,
   * however, a handler can act as middleware by continuing the chain by returning `next()`
   */
  protected readonly routesByVerb = new Map<RouterMethod, ParsedRoute<BoundAliases>[]>(
    Array.from(methodVerbToRouterMethod.values(), (normalizedVerb) => {
      return [normalizedVerb, []]
    })
  )

  /**
   * Given a normalized HTTP method verb, create a method handler.
   * This is mostly for internal use.
   */
  protected _addHTTPMethodHandler<Path extends string>(
    normalizedVerb: RouterMethod,
    // mountPathPatternLike: PathPattern<Path> | Path,
    pathPatternLike: PathPattern<Path> | Path,
    ...fetchersLike: Array<KeyworkFetcher<BoundAliases> | RouteRequestHandler<BoundAliases, any, any>>
  ): void {
    const parsedHandlersCollection = this.routesByVerb.get(normalizedVerb)!
    const pathPattern = normalizePathPattern(pathPatternLike)

    const parsedHandlers = fetchersLike.map((fetcherLike): ParsedRoute<BoundAliases> => {
      /**
       * Incoming request arguments may not always be normalized,
       * but using a `KeyworkFetcher` wrapper ensures that we can always handle both shapes.
       */
      let fetcher: KeyworkFetcher<BoundAliases>

      if (isKeyworkFetcher<BoundAliases>(fetcherLike)) {
        // Likely a `WorkerRouter` or `KeyworkFetcher`...
        fetcher = fetcherLike
      } else {
        // Likely a `RouteRequestHandler`...
        fetcher = {
          displayName: `[${this.displayName}][${pathPattern.path}]`,
          fetch: (...args: unknown[]) => {
            const eventContext = this.createIncomingRequestEventFromArgs(...args)

            return fetcherLike(eventContext)
          },
        }
      }

      return {
        compiledPath: compilePath(pathPattern),
        fetcher,
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
   * @category HTTP Method Handler
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
   * @category HTTP Method Handler
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
   * @category HTTP Method Handler
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
   * @category HTTP Method Handler
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
   * @category HTTP Method Handler
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
   * @category HTTP Method Handler
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
   * @category HTTP Method Handler
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
   * This will always be a **higher priority** than an explicitly defined method handler.
   * If you're creating a router as middleware, `WorkerRouter#all` can be especially useful for intercepting incoming requests.
   *
   * @category HTTP Method Handler
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
   * Route handlers are matched in the order of their declaration:
   *
   * ```ts
   * const app = new WorkerRouter()
   *
   * app.get('/foo', ({request}) => {
   *   return new Response('This handler got here first!')
   * })
   *
   * app.get('/foo', ({request}) => {
   *   return new Response('This handler won't be called!')
   * })
   * ```
   *
   * However, if you want another router to act as middleware,
   * Call `use` before defining your route handlers:
   *
   * ```ts
   * const authenticationRouter = new WorkerRouter()
   *
   * authenticationRouter.all('*', ({request, next}) => {
   *   if (!hasAuthCookie(request)) {
   *     return new KeyworkResourceError(401, "You need to be signed in to do that!")
   *   }
   *
   *   // Pass the request along to the next matching route handler.
   *   return next()
   * })
   *
   * const app = new WorkerRouter()
   *
   * app.use('/', authenticationRouter)
   *
   * app.get('/user/profile', ({request}) => {
   *   return new Response("Some user only content.")
   * })
   * ```
   *
   * @public
   */
  public use(fetcher: KeyworkFetcher<any>): void
  public use(mountPathPattern: PathPattern | string, fetcher: KeyworkFetcher<any>): void
  public use(...args: unknown[]): void {
    let mountPathPattern: PathPattern | string
    let fetcher: KeyworkFetcher<any>

    if (args.length > 1) {
      // Path pattern was provided...
      mountPathPattern = args[0] as PathPattern | string
      fetcher = args[1] as KeyworkFetcher<any>
    } else {
      // Path pattern defaults to root...
      mountPathPattern = '/'
      fetcher = args[0] as KeyworkFetcher<any>
    }

    this._addHTTPMethodHandler(
      'all',
      normalizePathPattern(mountPathPattern, {
        end: false,
      }),
      fetcher
    )
  }

  //#endregion

  //#region React

  /**
   * A HTML Document React component which wraps the entire application.
   * Use this if you need to replace the default HTML Document.
   * @category React
   */
  DocumentComponent: KeyworkHTMLDocumentComponent
  /**
   * A React component which wraps the SSR routes.
   * Use this if you need to inject a provider into the SSR pipeline.
   * @category React
   */
  Providers: KeyworkProvidersComponent

  //#endregion

  //#region Debugging

  /**
   * A display name used for debugging and log messages.
   * @category Debug
   */
  public displayName: string

  /**
   * A server-side logger.
   */
  public readonly logger: PrefixedLogger

  /**
   * Collates the known routes by HTTP method verb.
   *
   * @see {WorkerRouter#$prettyPrintRoutes}
   * @category Debug
   * @public
   */
  public $getRoutesByHTTPMethod() {
    return Array.from(this.routesByVerb.entries(), ([routerMethod, parsedRoutes]) => {
      const httpMethod = routerMethodToHTTPMethod.get(routerMethod)!

      return {
        httpMethod,
        parsedRoutes,
      }
    })
  }

  /**
   * Outputs the known routes to the console.
   * @category Debug
   * @public
   */
  public $prettyPrintRoutes(): void {
    const routesByHttpMethod = this.$getRoutesByHTTPMethod()

    for (const { httpMethod, parsedRoutes } of routesByHttpMethod) {
      if (!parsedRoutes.length) continue

      this.logger.log(httpMethod)

      for (const { compiledPath, fetcher } of parsedRoutes) {
        this.logger.log(fetcher.displayName || '', compiledPath.pattern.path, compiledPath.matcher)
      }
    }
  }

  /**
   * @ignore
   * @category Debug
   */
  readonly includeDebugHeaders: boolean

  //#endregion

  //#region Construction

  constructor(options?: WorkerRouterOptions) {
    this.displayName = options?.displayName || 'Keywork Router'
    this.logger = new PrefixedLogger(this.displayName)
    this.includeDebugHeaders = options?.includeDebugHeaders || true

    this.DocumentComponent = options?.DocumentComponent || KeyworkHTMLDocument
    this.Providers = options?.Providers || KeyworkProviders

    if (options?.middleware) {
      for (const middlewareDeclaration of options.middleware) {
        this.use(...middlewareDeclaration)
      }
    }
  }

  //#endregion

  //#region Fetch

  /**
   * Normalizes the given arguments into an `IncomingRequestEvent`
   */
  protected createIncomingRequestEventFromArgs(...args: unknown[]): IncomingRequestEvent<BoundAliases, any, any> {
    if (args.length === 1) {
      // Arguments have already been normalized into a RouteRequestHandler shape.
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      return (args as Parameters<RouteRequestHandler<BoundAliases, any>>)[0]
    }

    if (args.length >= 3) {
      // Arguments are coming directly from an unprocessed incoming request.
      const [request, env, executionContext] = args as Parameters<WorkerRequestHandler<BoundAliases>>

      // Update the URL params...
      const requestURL = new URL(request.url)

      const event: IncomingRequestEvent<BoundAliases, any, any> = {
        request,
        originalURL: request.url,
        env,
        waitUntil: executionContext.waitUntil,
        data: {
          session: new KeyworkSession(request),
        },
        params: {},
        pathname: requestURL.pathname,
        pathnameBase: '/',
        pattern: null as any,
        next: null as any, // Defined in fetch delegation.
      }

      return event
    }

    this.logger.warn(
      'This method should receive 1 argument: `IncomingRequestEvent`...',
      '...Or, 3 arguments: [request, env, executionContext]'
    )
    this.logger.warn(`\`createIncomingRequestEventFromArgs\` received ${args.length} argument(s).`)
    this.logger.warn(args)

    throw new KeyworkResourceError(
      'A server error occurred while parsing the request. See logs for additional details',
      StatusCodes.BAD_REQUEST
    )
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
    try {
      // eslint-disable-next-line prefer-spread
      const event = this.createIncomingRequestEventFromArgs.apply(this, args)
      return this.delegateFetchEvent(event)
    } catch (error) {
      this.logger.error(error)

      const response = ErrorResponse.fromUnknownError(
        error,
        'A server error occurred while parsing the request. See logs for additional information.'
      )

      this._applyHeaders(response)

      return response
    }
  }

  /**
   * @ignore
   */
  protected delegateFetchEvent = async (event: IncomingRequestEvent<BoundAliases, any, any>): Promise<Response> => {
    // With our event context constructed, we can check for any defined methods...
    // If a method exists and routes are defined, it acts like middleware.
    const routerMethod = methodVerbToRouterMethod.get(event.request.method as HTTPMethod)
    const routes = routerMethod ? this._getParsedRoutesForMethod(routerMethod) : null

    if (!routerMethod || !routes || !routes.length) {
      return new ErrorResponse(StatusCodes.NOT_IMPLEMENTED)
    }

    // Given the current URL, attempt to find a matching route handler...
    const matches: RouteMatch<any>[] = []
    for (const route of routes) {
      const match = matchPathPrecompiled(route.compiledPath, event.pathname)
      if (!match) continue

      matches.push({ match, fetcher: route.fetcher })
    }

    let routeIndex = 0

    event.next = async (input, requestInit) => {
      const matchedRoute = matches[routeIndex]

      if (!matchedRoute) {
        if (routeIndex > 0) {
          return new ErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `\`eventContext.next()\` was called ${routeIndex + 1} times but only ${
              matches.length
            } routes are defined for \`${event.pathname}\``
          )
        }

        return new ErrorResponse(StatusCodes.NOT_FOUND, `No route matches \`${event.pathname}\``)
      }

      const url = new URL(event.request.url)
      const { match, fetcher } = matchedRoute

      if (!match.pattern.end) {
        // The current pattern only matches the beginning of the pathname.
        // So, we remove the matched portion which allows any nested routes to
        // behave as if the pathname did not include any unforseen prefixes.
        const pathNameOffset = findSubstringStartOffset(url.pathname, match.pathnameBase)
        if (pathNameOffset) {
          match.pathname = url.pathname.substring(pathNameOffset)
          match.pathnameBase = '/'

          url.pathname = match.pathname
        }
      }

      /** A clone of the initial request, with a new URL to match the remaining pathname parameters.  */
      const request = input ? new Request(input, requestInit) : new Request(url.toString(), event.request)

      const currentEvent: IncomingRequestEvent<BoundAliases, any, any> = {
        ...event,
        ...match,
        request,
        next: (...args) => {
          routeIndex++
          return event.next(...args)
        },
      }
      const responseLike = await fetcher.fetch(currentEvent)
      const response = convertToResponse(responseLike, this)
      this._applyHeaders(response)

      return response
    }

    let response: Response

    try {
      response = await event.next()
    } catch (_error) {
      this.logger.error(_error)
      this.logger.debug(event)

      response = ErrorResponse.fromUnknownError(_error, 'A server error occurred. Please try again later.')
    }

    this._applyHeaders(response)
    return response
  }

  /**
   * @ignore
   */
  _applyHeaders(response: Response) {
    if (this.includeDebugHeaders) {
      for (const [key, value] of Object.entries(KeyworkHeaders)) {
        response.headers.set(key, value)
      }
    }
  }

  /**
   * Returns a collection of route handlers for the given HTTP method.
   *
   * @internal
   */
  protected _getParsedRoutesForMethod(normalizedMethodVerb: RouterMethod): ParsedRoute<BoundAliases>[] {
    const verbs: readonly RouterMethod[] = ['all', normalizedMethodVerb]

    const handlers = verbs.flatMap((verb) => this.routesByVerb.get(verb)!)

    return handlers
  }

  //#endregion

  //#region Internal

  /** @ignore */
  readonly [$ClassID] = true as boolean
  /** @ignore */
  static readonly [$ClassID] = true as boolean

  //#endregion

  dispose(reason = 'default') {
    this.logger.debug('Disposing...', reason)
    this.routesByVerb.clear()
  }
}
