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

import { Status } from 'deno/http/http_status'
import { KeyworkResourceError } from 'keywork/errors'
import { KeyworkHeaders, mergeHeaders } from 'keywork/headers'
import HTTP from 'keywork/platform/http'
import { ReactRendererOptions } from 'keywork/react/common'
import { renderReactStream } from 'keywork/react/worker'
import { convertToResponse, ErrorResponse } from 'keywork/responses'
import {
  NormalizedRequestArgs,
  HTTPMethod,
  IncomingRequestEvent,
  IncomingRequestEventData,
  isKeyworkFetcher,
  KeyworkFetcher,
  methodVerbToRouterMethod,
  ParsedRoute,
  RouteMatch,
  RouteMethodDeclaration,
  RouteRequestHandler,
  RouterMethod,
  routerMethodToHTTPMethod,
  isInstanceOfRequest,
  MiddlewareFetch,
} from 'keywork/routing/common'
import { KeyworkSession, KeyworkSessionOptions } from 'keywork/sessions'
import { compilePath, matchPathPrecompiled, normalizePathPattern, PathPattern } from 'keywork/uri'
import { Disposable, findSubstringStartOffset, PrefixedLogger } from 'keywork/utilities'
import { CloudflareWorkerRequestHandler, WaitUntilCallback } from 'keywork/routing/worker/cloudflare'
import { isMiddlewareDeclarationOption, WorkerRouterOptions } from './common.ts'

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
 * Routes incoming HTTP requests from the user's browser to your app's route endpoints.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam Data Optional extra data to be passed to a route handler.
 *
 * @category Router
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
      const fetch: RouteRequestHandler<BoundAliases, any, any, globalThis.Response> = async (event) => {
        const responseLike = await fetcherLike(event)
        const response = convertToResponse(responseLike, this.reactOptions)

        mergeHeaders(response.headers, this._createDefaultHeaders(event))

        return response
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
  public get<ExpectedParams extends {} | null = null, Data extends IncomingRequestEventData = IncomingRequestEventData>(
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
  public post<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
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
  public put<ExpectedParams extends {} | null = null, Data extends IncomingRequestEventData = IncomingRequestEventData>(
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
  public patch<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
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
  public delete<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
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
  public head<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
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
  public options<
    ExpectedParams extends {} | null = null,
    Data extends IncomingRequestEventData = IncomingRequestEventData
  >(...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>): void {
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
  public all<ExpectedParams extends {} | null = null, Data extends IncomingRequestEventData = IncomingRequestEventData>(
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

      this.logger.log('METHOD:', httpMethod)

      for (const parsedRoute of parsedRoutes) {
        this.logger.log(
          parsedRoute.displayName || '',
          parsedRoute.compiledPath.pattern.path,
          parsedRoute.compiledPath.matcher
        )

        if (parsedRoute.kind === 'fetcher' && WorkerRouter.assertIsInstanceOf(parsedRoute.fetcher)) {
          parsedRoute.fetcher.$prettyPrintRoutes()
        }
      }
    }
  }

  //#endregion

  //#region Options

  /**
   * @ignore
   * @category options
   */
  readonly includeDebugHeaders: boolean

  /**
   * @ignore
   * @category options
   */
  readonly session:
    | {
        enabled: true
        options: KeyworkSessionOptions
      }
    | {
        enabled: false
      }

  readonly reactOptions: ReactRendererOptions

  //#endregion

  //#region Fetch

  /**
   * Normalizes the given arguments into an `IncomingRequestEvent`
   *
   * @throws KeyworkResourceError Invalid methods
   */
  protected normalizeFetchArgs: {
    (...args: Parameters<RouteRequestHandler<BoundAliases, any, any>>): NormalizedRequestArgs<BoundAliases>
    (...args: Parameters<CloudflareWorkerRequestHandler<BoundAliases>>): NormalizedRequestArgs<BoundAliases>
  } = (...args: unknown[]): NormalizedRequestArgs<BoundAliases> => {
    if (args.length === 1 && !isInstanceOfRequest(args[0])) {
      // Arguments have already been normalized.
      return args[0] as NormalizedRequestArgs<BoundAliases>
    }

    // Arguments are coming directly from an unprocessed incoming request.
    const [request, env, context] = args as Parameters<CloudflareWorkerRequestHandler<BoundAliases>>

    if (!request) {
      this.logger.warn(
        'This method should receive 1 argument: `IncomingRequestEvent`...',
        '...Or, 3 arguments: [request, env, executionContext]'
      )
      this.logger.warn(`\`normalizeFetchArgs\` received ${args.length} argument(s).`)
      this.logger.warn(args)

      throw new KeyworkResourceError(
        'A server error occurred while parsing the request. See logs for additional details',
        Status.BadRequest
      )
    }

    const normalizedMethodVerb = methodVerbToRouterMethod.get(request.method as HTTPMethod)

    if (!normalizedMethodVerb) {
      throw new KeyworkResourceError(`Method \`${request.method}\` is not implemented`, Status.NotImplemented)
    }

    const routes = this.readMethodRoutes(normalizedMethodVerb)
    const originalURL = new URL(request.url)

    // Given the current URL, attempt to find a matching route handler...
    const matchedRoutes = this.match(routes, originalURL.pathname)
    const normalizedArgs: NormalizedRequestArgs<BoundAliases> = {
      request,
      originalURL,
      env: env || (null as any),
      waitUntil: context?.waitUntil || noopWaitUntil,
      matchedRoutes,
    }

    return normalizedArgs
  }

  /**
   * Finds the matching routes for a given pathname.
   * @public
   */
  public match(parsedRoutes: ParsedRoute<any>[], pathname: string): RouteMatch<any>[] {
    const matchedRoutes: RouteMatch<any>[] = []

    for (const parsedRoute of parsedRoutes) {
      const match = matchPathPrecompiled(parsedRoute.compiledPath, pathname)
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
  fetch: {
    (...args: Parameters<RouteRequestHandler<BoundAliases, any, any>>):
      | globalThis.Response
      | Promise<globalThis.Response>
    (...args: Parameters<CloudflareWorkerRequestHandler<BoundAliases>>):
      | globalThis.Response
      | Promise<globalThis.Response>
  } = async (...args: any[]): Promise<globalThis.Response> => {
    let argsByName: NormalizedRequestArgs<BoundAliases>

    try {
      // eslint-disable-next-line prefer-spread
      argsByName = this.normalizeFetchArgs.apply(this, args as any)
    } catch (error) {
      this.logger.error(error)

      return ErrorResponse.fromUnknownError(
        error,
        'A server error occurred while parsing the request. See logs for additional information.',
        this._createDefaultHeaders(null)
      )
    }

    const { request, matchedRoutes, env, waitUntil } = argsByName
    try {
      const response = await this.delegateAsMiddleware(request.url, request, matchedRoutes, env, waitUntil)

      if (!response) {
        return this._createHTTPError(Status.NotFound, `No route matches \`${argsByName.originalURL.pathname}\``)
      }
      return response
    } catch (error) {
      this.logger.error(error)

      return ErrorResponse.fromUnknownError(
        error,
        'A server error occurred while parsing the request. See logs for additional information.',
        this._createDefaultHeaders(null)
      )
    }
  }

  public delegateAsMiddleware: MiddlewareFetch<BoundAliases> = async (
    input,
    requestInit,
    matchedRoutes,
    env,
    waitUntil = noopWaitUntil
  ) => {
    if (!input || !matchedRoutes || !matchedRoutes.length) {
      return null
    }
    for (const { match, parsedRoute } of matchedRoutes) {
      /** A clone of the initial request, with a new URL to match the remaining pathname parameters.  */
      const request = new HTTP.Request(input, requestInit)
      const requestURL = new URL(request.url)
      const session = this.session.enabled ? new KeyworkSession(request, this.session.options) : null

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

      const next: MiddlewareFetch<BoundAliases> = (
        input = request.url,
        requestInit = request,
        _matchedRoutes = matchedRoutes.slice(1),
        _env = env,
        _waitUntil = waitUntil
      ) => {
        return this.delegateAsMiddleware(input, requestInit, _matchedRoutes, _env, _waitUntil)
      }

      const event: IncomingRequestEvent<BoundAliases, any, any> = {
        env: env!,
        waitUntil,
        session,
        request,
        originalURL: request.url,
        ...match,
        data: {},
        next,
      }

      let response: globalThis.Response | null
      if (parsedRoute.kind === 'routeHandler') {
        response = await parsedRoute.fetch(event)
      } else {
        response = await parsedRoute.fetcher.fetch(event)
      }

      if (!response) {
        return next(request.url, request, matchedRoutes)
      }
    }

    return null
  }

  /**
   * Creates the default headers for a given Keywork request.
   *
   * @ignore
   */
  protected _createDefaultHeaders(event: IncomingRequestEvent<BoundAliases, any, any> | null): globalThis.Headers {
    const headers = new HTTP.Headers()

    if (this.includeDebugHeaders) {
      for (const [key, value] of Object.entries(KeyworkHeaders)) {
        headers.set(key, value)
      }
    }

    if (event?.session) {
      event.session._assignSessionHeaders(headers)
    }

    return headers
  }

  /**
   * Creates an either a default `ErrorResponse`, or if defined, a fallback route matching the HTTP status code.
   * @beta
   */
  private _createHTTPError(status: number, publicReason?: string): globalThis.Response {
    const response = new ErrorResponse(status, publicReason)
    mergeHeaders(response.headers, this._createDefaultHeaders(null))

    return response
  }

  //#endregion

  //#region Internal

  /** @ignore */
  readonly [kInstance] = true as boolean
  /** @ignore */
  static readonly [kObjectName] = true as boolean

  static assertIsInstanceOf<BoundAliases extends {} | null = null>(
    routerLike: KeyworkFetcher<BoundAliases> | WorkerRouter<BoundAliases>
  ): routerLike is WorkerRouter<BoundAliases> {
    return Boolean(routerLike instanceof WorkerRouter || kInstance in routerLike)
  }

  //#endregion

  //#region Lifecyle

  constructor(options?: WorkerRouterOptions) {
    this.displayName = options?.displayName || 'Keywork Router'
    this.logger = new PrefixedLogger(this.displayName)
    this.includeDebugHeaders = options?.includeDebugHeaders || true

    if (options?.session) {
      this.session = {
        enabled: true,
        options: typeof options.session === 'boolean' ? {} : options.session,
      }
    } else {
      this.session = { enabled: false }
    }

    this.reactOptions = {
      streamRenderer: renderReactStream,
      ...options?.react,
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

/** @internal */
const noopWaitUntil: WaitUntilCallback = (..._args: any[]) => Promise<void>
