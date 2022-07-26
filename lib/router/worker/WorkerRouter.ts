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

import { KeyworkResourceError, Status } from 'keywork/errors'
import { KeyworkHeaders } from 'keywork/http/headers'
import { HTTPMethod, methodVerbToRouterMethod, RouterMethod, routerMethodToHTTPMethod } from 'keywork/http'
import { ReactRendererOptions } from 'keywork/react/isomorphic'
import { renderReactStream } from 'keywork/react/worker'
import { castToResponse, cloneAsMutableResponse, ErrorResponse } from 'keywork/http/response'
import { IncomingRequestEvent, IncomingRequestEventData } from 'keywork/http/request'
import { isKeyworkFetcher, KeyworkFetcher, MiddlewareFetch } from 'keywork/router/middleware'
import type { ParsedRoute, RouteMatch, RouteRequestHandler } from 'keywork/router/route'
import { compilePath, matchPathPrecompiled, normalizePathPattern, PathPattern } from 'keywork/uri'
import { Disposable, findSubstringStartOffset, PrefixedLogger } from 'keywork/utilities'
import { isMiddlewareDeclarationOption, WorkerRouterOptions } from './common.ts'
import { RouteDebugEntrypoint, WorkerRouterDebugEndpoints } from 'keywork/router/debug'
import { isCloudflareWorkerExecutionContext } from 'keywork/http/request/cloudflare'

/**
 * Used in place of the reference-sensitive `instanceof`
 * @see {WorkerRouter.assertIsInstanceOf}
 * @ignore
 */
export const kObjectName = 'Keywork.WorkerRouter'
/**
 * @ignore
 */
export const kInstance = 'Keywork.WorkerRouter.instance'

/**
 * @ignore
 */
export type RouteMethodDeclaration<
  BoundAliases = {},
  ExpectedParams = {},
  Data extends IncomingRequestEventData = IncomingRequestEventData
> = (
  /**
   * A `path-to-regexp` style pattern.
   *
   * @see {@link https://www.npmjs.com/package/path-to-regexp NPM Package}
   */
  paramPattern: string | RegExp,
  /**
   * One or more callback functions to handle an incoming request.
   */
  ...handlers: Array<RouteRequestHandler<BoundAliases, ExpectedParams, Data>>
) => void

/**
 * Routes incoming HTTP requests from the user's browser to your app's route endpoints.
 *
 * {@link https://keywork.app/docs/concepts/routing Keywork Documentation}
 *
 * {@link https://keywork.app/api/classes/routing-worker.WorkerRouter Keywork API}
 *
 * @category Router
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 */
export class WorkerRouter<BoundAliases = {}> implements KeyworkFetcher<BoundAliases>, Disposable {
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
  public appendMethodRoutes<Path extends string>(
    normalizedVerb: RouterMethod,
    pathPatternLike: PathPattern<Path> | Path | RegExp,
    ...fetchersLike: Array<KeyworkFetcher<BoundAliases> | RouteRequestHandler<BoundAliases, any, any>>
  ): void {
    const parsedHandlersCollection = this.routesByVerb.get(normalizedVerb)!
    const pathPattern = normalizePathPattern(pathPatternLike)

    /**
     * Incoming request arguments may not always be normalized,
     * but using a `KeyworkFetcher` wrapper ensures that we can always handle both shapes.
     */
    const parsedHandlers = fetchersLike.map((fetcherLike): ParsedRoute<BoundAliases> => {
      const compiledPath = compilePath(pathPattern)

      if (isKeyworkFetcher<BoundAliases>(fetcherLike)) {
        // Likely a `WorkerRouter` or `KeyworkFetcher`...
        return {
          kind: 'fetcher',
          compiledPath,
          fetcher: fetcherLike,
          displayName: fetcherLike.displayName,
        }
      }

      // Likely a `RouteRequestHandler`...
      const fetch: RouteRequestHandler<BoundAliases, any, any, globalThis.Response> = async (event, next) => {
        const responseLike = await fetcherLike(event, next)
        const response = await castToResponse(responseLike, this.reactOptions)

        return this.applyHeaders(response)
      }

      return {
        kind: 'routeHandler',
        displayName: `[${this.displayName}][${pathPattern.path}]`,
        compiledPath,
        fetch,
      }
    })

    parsedHandlersCollection.push(...parsedHandlers)
  }

  /**
   * Returns a collection of route handlers for the given HTTP method.
   *
   * @internal
   */
  public readMethodRoutes(normalizedMethodVerb: RouterMethod): ParsedRoute<BoundAliases>[] {
    const verbs: readonly RouterMethod[] = ['all', normalizedMethodVerb]

    const handlers = verbs.flatMap((verb) => this.routesByVerb.get(verb)!)

    return handlers
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
  public get<ExpectedParams = {}, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this.appendMethodRoutes('get', ...args)
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
  public post<ExpectedParams = {}, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this.appendMethodRoutes('post', ...args)
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
  public put<ExpectedParams = {}, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this.appendMethodRoutes('put', ...args)
  }

  /**
   * Defines a handler for incoming `PATCH` requests.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH Documentation on MDN}
   *
   * @category HTTP Method Handler
   * @public
   */
  public patch<ExpectedParams = {}, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this.appendMethodRoutes('patch', ...args)
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
  public delete<ExpectedParams = {}, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this.appendMethodRoutes('delete', ...args)
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
  public head<ExpectedParams = {}, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this.appendMethodRoutes('head', ...args)
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
  public options<ExpectedParams = {}, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this.appendMethodRoutes('options', ...args)
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
  public all<ExpectedParams = {}, Data extends IncomingRequestEventData = IncomingRequestEventData>(
    ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
  ): void {
    return this.appendMethodRoutes('all', ...args)
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
    let mountPathPattern: PathPattern
    let fetcher: KeyworkFetcher<any>

    if (args.length > 1) {
      // Path pattern was provided...
      mountPathPattern = normalizePathPattern(args[0] as PathPattern | string, {
        end: false,
      })

      fetcher = args[1] as KeyworkFetcher<any>
    } else {
      // Path pattern defaults to root...
      mountPathPattern = { path: '*', caseSensitive: false, end: true }
      fetcher = args[0] as KeyworkFetcher<any>
    }

    this.appendMethodRoutes('all', mountPathPattern, fetcher)
  }

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
  public $getRoutesByHTTPMethod(): RouteDebugEntrypoint[] {
    return Array.from(this.routesByVerb.entries(), ([routerMethod, parsedRoutes]) => {
      const httpMethod = routerMethodToHTTPMethod.get(routerMethod)!

      const entry: RouteDebugEntrypoint = {
        httpMethod,
        displayName: this.displayName || '',
        kind: 'router',
        entries: parsedRoutes.map(({ compiledPath, ...parsedRoute }) => {
          const entries =
            parsedRoute.kind === 'fetcher' && WorkerRouter.assertIsInstanceOf(parsedRoute.fetcher)
              ? parsedRoute.fetcher.$getRoutesByHTTPMethod()
              : []

          return {
            httpMethod,
            displayName: parsedRoute.displayName || compiledPath.pattern.path || '',
            kind: parsedRoute.kind,
            compiledPath,
            entries,
          }
        }),
      }

      return entry
    })
  }

  /**
   * Outputs the known routes to the console.
   * @category Debug
   * @public
   */
  public $prettyPrintRoutes(routesByHttpMethod = this.$getRoutesByHTTPMethod()): void {
    for (const { httpMethod, entries } of routesByHttpMethod) {
      if (!entries.length) continue

      this.logger.log('METHOD:', httpMethod)

      for (const route of entries) {
        this.logger.log(route.displayName || '', route.compiledPath?.pattern.path, route.compiledPath?.matcher)

        this.$prettyPrintRoutes(route.entries)
      }
    }
  }

  protected $routesEndpoint: RouteRequestHandler<BoundAliases> = () => {
    return this.$getRoutesByHTTPMethod()
  }

  //#endregion

  //#region Options

  /**
   * @ignore
   * @category options
   */
  readonly includeDebugHeaders: boolean
  readonly reactOptions: ReactRendererOptions

  //#endregion

  //#region Fetch

  /**
   * Finds the matching routes for a given pathname.
   * @public
   */
  public match<BoundAliases = {}>(
    parsedRoutes: ParsedRoute<BoundAliases>[],
    pathname: string
  ): RouteMatch<BoundAliases, any>[] {
    const matchedRoutes: RouteMatch<BoundAliases, any>[] = []

    for (const parsedRoute of parsedRoutes) {
      const match = matchPathPrecompiled<any>(parsedRoute.compiledPath, pathname)
      if (!match) continue

      matchedRoutes.push({ match, parsedRoute })
    }

    return matchedRoutes
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
  fetch: MiddlewareFetch<BoundAliases> = async (
    request,
    env,
    eventLike,
    next,
    matchedRoutes
  ): Promise<globalThis.Response> => {
    let event: IncomingRequestEvent<any>

    if (isCloudflareWorkerExecutionContext(eventLike)) {
      event = IncomingRequestEvent.fromCloudflareWorker(eventLike, request, env)
    } else if (IncomingRequestEvent.assertIsInstanceOf(eventLike)) {
      event = eventLike
    } else {
      event = new IncomingRequestEvent(request, env)
    }

    const normalizedMethodVerb = methodVerbToRouterMethod.get(request.method as HTTPMethod)

    if (!normalizedMethodVerb) {
      throw new KeyworkResourceError(`Method \`${request.method}\` is not implemented`, Status.NotImplemented)
    }

    const routes = this.readMethodRoutes(normalizedMethodVerb)
    const requestURL = new URL(request.url)

    if (!matchedRoutes) {
      // Given the current URL, attempt to find a matching route handler...
      matchedRoutes = this.match<BoundAliases>(routes, requestURL.pathname)
    }

    if (!matchedRoutes.length) {
      return null as any
    }

    const [{ match, parsedRoute }, ...fallbackRoutes] = matchedRoutes

    // Update the URL params...
    if (!match.pattern.end) {
      // The current pattern only matches the beginning of the pathname.
      // So, we remove the matched portion which allows any nested routes to
      // behave as if the pathname did not include any unforseen prefixes.
      const pathNameOffset = findSubstringStartOffset(requestURL.pathname, match.pathnameBase)
      if (pathNameOffset) {
        // Add '/' to allow omitting of trailing-slash.
        match.pathname = requestURL.pathname.substring(pathNameOffset) || '/'
        match.pathnameBase = '/'

        requestURL.pathname = match.pathname
      }
    }

    event.request = new globalThis.Request(requestURL, request)
    event.match = match as any
    event.params = match.params

    next =
      next ||
      ((
        _request = event.request,
        _env = env,
        _event = event,
        _next = this.fetch as any,
        _matchedRoutes = fallbackRoutes
      ) => {
        return _next(request, _env, _event, this.terminateMiddleware, _matchedRoutes)
      })

    let possibleResponse: globalThis.Response | null
    this.logger.debug(
      `Delegating \`${requestURL.pathname}\` to ${parsedRoute.kind}`,
      parsedRoute.displayName || parsedRoute.compiledPath
    )
    try {
      if (parsedRoute.kind === 'routeHandler') {
        possibleResponse = await parsedRoute.fetch(event, next as any)
      } else {
        possibleResponse = await parsedRoute.fetcher.fetch(event.request, env, event, next)
      }
    } catch (error) {
      this.logger.error(error)

      return this.applyHeaders(
        new ErrorResponse(
          error,
          'A server error occurred while delegating the request. See logs for additional information.'
        )
      )
    }

    const response =
      possibleResponse || (await next()) || this.applyHeaders(new ErrorResponse(Status.NotFound, undefined))

    return cloneAsMutableResponse(response)
  }

  /**
   * Applies the default headers for a given Keywork request.
   *
   * @returns Mutable instance of the given response
   * @ignore
   */
  protected applyHeaders(response: globalThis.Response): globalThis.Response {
    const mutableResponse = cloneAsMutableResponse(response)

    if (this.includeDebugHeaders) {
      for (const [key, value] of Object.entries(KeyworkHeaders)) {
        mutableResponse.headers.set(key, value)
      }
    }

    return mutableResponse
  }

  protected terminateMiddleware = () => {
    return this.applyHeaders(new ErrorResponse(Status.NotFound, undefined))
  };

  //#endregion

  //#region Internal

  /** @ignore */
  readonly [kInstance] = true as boolean
  /** @ignore */
  static readonly [kObjectName] = true as boolean

  static assertIsInstanceOf<BoundAliases = {}>(
    routerLike: KeyworkFetcher<BoundAliases> | WorkerRouter<BoundAliases>
  ): routerLike is WorkerRouter<BoundAliases> {
    return Boolean(routerLike instanceof WorkerRouter || kInstance in routerLike)
  }

  //#endregion

  //#region Lifecyle

  constructor(options?: WorkerRouterOptions) {
    this.displayName = options?.displayName || 'Keywork Router'
    this.logger = new PrefixedLogger(this.displayName)

    this.reactOptions = {
      streamRenderer: renderReactStream,
      ...options?.react,
    }

    this.includeDebugHeaders =
      typeof options?.debug?.includeHeaders !== 'undefined' ? options.debug.includeHeaders : true

    if (options?.debug?.endpoints) {
      const endpoints: WorkerRouterDebugEndpoints =
        typeof options.debug.endpoints === 'boolean'
          ? {
              routes: true,
            }
          : options.debug.endpoints
      // TODO: flesh out
      // this.use(new WorkerRouterDebugMiddleware(options?.debug))

      if (endpoints.routes) {
        this.get('/keywork/routes', this.$routesEndpoint)
      }
    }

    if (options?.middleware) {
      for (const middlewareDeclaration of options.middleware) {
        if (isMiddlewareDeclarationOption(middlewareDeclaration)) {
          this.use(...middlewareDeclaration)
        } else {
          this.use(middlewareDeclaration)
        }
      }
    }
  }

  dispose(reason = 'default') {
    this.logger.debug('Disposing...', reason)
    this.routesByVerb.clear()
  }

  //#endregion
}
