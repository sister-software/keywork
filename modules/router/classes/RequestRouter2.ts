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

// import { KeyworkResourceError, Status } from '../../errors/mod.ts'
// import { IsomorphicFetchEvent, IsomorphicFetchEventInit } from '../../events/mod.ts'
// import {
//   cloneAsMutableResponse,
//   ErrorResponse,
//   HTTPMethod,
//   methodVerbToRouterMethod,
//   NextMiddlewareResponse,
//   ResponseHandler,
//   ResponseLike,
//   RouterMethod,
//   routerMethodToHTTPMethod,
// } from '../../http/mod.ts'
// import { Logger } from '../../logger/mod.ts'
// import { renderReactStream } from '../../react/worker/mod.ts'
// import { normalizeURLPattern, URLPatternLike } from '../../uri/mod.ts'
// import type { Disposable } from '../../__internal/interfaces/disposable.ts'
// import {
//   findRoutesMatchingURL,
//   isMiddlewareDeclarationOption,
//   isServiceBinding,
//   RouteMatchResult,
// } from '../functions/mod.ts'
// import type { FetchEventHandler, RequestHandler, RequestRouterOptions } from '../interfaces/mod.ts'
// import type { RequestMiddleware, RequestResponseMapper } from '../types/mod.ts'

// /**
//  * Used in place of the reference-sensitive `instanceof`
//  * @see {RequestRouter.assertIsInstanceOf}
//  * @internal
//  */
export const kObjectName = 'Keywork.RequestRouter'

// /**
//  * @internal
//  */
// export const kInstance = 'Keywork.RequestRouter.instance'

// /**
//  * @internal
//  */
// export const kResponseHandler = 'Keywork.RequestRouter.responseParser'

// /**
//  * Routes incoming HTTP requests from the user's browser to your app's route endpoints.
//  *
//  * {@link https://keywork.app/modules/router Keywork Documentation}
//  *
//  * {@link https://keywork.app/modules/router/classes/RequestRouter Keywork API}
//  *
//  * @category Router
//  * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
//  */
// export class RequestRouter<BoundAliases = {}> implements Disposable {
//   /**
//    * This router's known routes, categorized by their normalized HTTP method verbs into arrays of route handlers.
//    *
//    * e.g.
//    *
//    * ```js
//    * GET: [{'/', routeHandler1}, {'/foo/' routeHandler2}, {'/bar/', routeHandler3}...]
//    * POST: [{'/', routeHandler1}, {'/foo/' routeHandler2}, {'/bar/', routeHandler3}...]
//    * //...etc
//    * ```
//    *
//    * Route handlers are prioritized in order of insertion,
//    * however, a handler can act as middleware by continuing the chain by returning `next()`
//    *
//    * @internal
//    */
//   public readonly routesByVerb = new Map<RouterMethod, Map<URLPattern, RequestResponseMapper<BoundAliases>>>(
//     Array.from(methodVerbToRouterMethod.values(), (normalizedVerb) => {
//       return [normalizedVerb, new Map()]
//     })
//   )

//   /**
//    * Given a normalized HTTP method verb, create a method handler.
//    * This is mostly for internal use.
//    * @ignore
//    */
//   public appendMethodRoutes(
//     normalizedVerb: RouterMethod,
//     urlPatternLike: URLPatternLike,
//     ...middlewares: RequestMiddleware<BoundAliases, any, any>[]
//   ): void {
//     if (normalizedVerb === 'all') {
//       for (const verb of methodVerbToRouterMethod.values()) {
//         this.appendMethodRoutes(verb, urlPatternLike, ...middlewares)
//       }
//       return
//     }

//     const routesOfVerb = this.routesByVerb.get(normalizedVerb)

//     if (!routesOfVerb) {
//       throw new KeyworkResourceError(`Method \`${normalizedVerb}\` is not implemented`, Status.NotImplemented)
//     }

//     const urlPattern = normalizeURLPattern(urlPatternLike)

//     for (const middleware of middlewares) {
//       routesOfVerb.set(urlPattern, this._createRequestMapper(middleware, urlPattern))
//     }
//   }

//   /**
//    * Returns a collection of route handlers for the given HTTP method.
//    *
//    * @internal
//    */
//   public readMethodRoutes(normalizedMethodVerb: RouterMethod) {
//     return this.routesByVerb.get(normalizedMethodVerb)!
//   }

//   /** @internal */
//   public match(request: Request): RouteMatchResult[] {
//     const url = new URL(request.url)
//     const normalizedMethodVerb = methodVerbToRouterMethod.get(request.method as HTTPMethod)

//     if (!normalizedMethodVerb) {
//       throw new KeyworkResourceError(`Method \`${request.method}\` is not implemented`, Status.NotImplemented)
//     }

//     return findRoutesMatchingURL(this.readMethodRoutes(normalizedMethodVerb), url)
//   }

//   //#region Route declaration methods

//   /**
//    * Defines a handler for incoming `GET` requests.
//    *
//    * The HTTP GET method requests a representation of the specified resource.
//    * Requests using GET should only be used to request data.
//    *
//    * The `params` object in the `IsomorphicFetchEvent` contains matched URL patterns
//    * which can be used to pass routing data from a client.
//    *
//    * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET Documentation via MDN}
//    *
//    * @category HTTP Method Handler
//    * @public
//    */
//   public get<ExpectedParams = {}, Data = {}>(
//     /**
//      * Either an instance of `URLPattern`,
//      * or a string representing the `pathname` portion of a `URLPattern`
//      *
//      * - ["Parsing path parameters"](https://keywork.app/modules/router#path-parameters) via Keywork's documentation.
//      * - [`URLPattern` Documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) via MDN
//      * - [`RequestHandler` interface](https://keywork.app/modules/router/interfaces/RouteRequestHandler) via Keywork's documentation.
//      *
//      * ---
//      */
//     urlPattern: URLPatternLike,
//     /**
//      * One or more callbacks to handle the matching incoming request.
//      *
//      * See [`RequestHandler`](https://keywork.app/modules/router/classes/RequestRouter) for more details.
//      *
//      * ---
//      */
//     ...handlers: RequestHandler<BoundAliases, ExpectedParams, Data>[]
//   ): void {
//     return this.appendMethodRoutes('get', urlPattern, ...handlers)
//   }

//   /**
//    * Defines a handler for incoming `POST` requests.
//    *
//    * The HTTP POST method sends data to the server.
//    * The file type of the body of the request is indicated by the `Content-Type` header.
//    *
//    * #### Related
//    *
//    * - {@link Keywork#HTTP#Headers#ContentType.fileExtensionToContentTypeHeader}
//    *
//    * @category HTTP Method Handler
//    * @public
//    */
//   public post<ExpectedParams = {}, Data = {}>(
//     /**
//      * Either an instance of `URLPattern`,
//      * or a string representing the `pathname` portion of a `URLPattern`
//      *
//      * - ["Parsing path parameters"](https://keywork.app/modules/router#path-parameters) via Keywork's documentation.
//      * - [`URLPattern` Documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) via MDN
//      * - [`RequestHandler` interface](https://keywork.app/modules/router/interfaces/RouteRequestHandler) via Keywork's documentation.
//      *
//      * ---
//      */
//     urlPattern: URLPatternLike,
//     /**
//      * One or more callbacks to handle the matching incoming request.
//      *
//      * See [`RequestHandler`](https://keywork.app/modules/router/classes/RequestRouter) for more details.
//      *
//      * ---
//      */
//     ...handlers: RequestHandler<BoundAliases, ExpectedParams, Data>[]
//   ): void {
//     return this.appendMethodRoutes('post', urlPattern, ...handlers)
//   }

//   /**
//    * Defines a handler for incoming `PUT` requests.
//    *
//    * The HTTP PUT request method creates a new resource
//    * or replaces a representation of the target resource with the request payload.
//    *
//    * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT Documentation via MDN}
//    *
//    * @category HTTP Method Handler
//    * @public
//    */
//   public put<ExpectedParams = {}, Data = {}>(
//     /**
//      * Either an instance of `URLPattern`,
//      * or a string representing the `pathname` portion of a `URLPattern`
//      *
//      * - ["Parsing path parameters"](https://keywork.app/modules/router#path-parameters) via Keywork's documentation.
//      * - [`URLPattern` Documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) via MDN
//      * - [`RequestHandler` interface](https://keywork.app/modules/router/interfaces/RouteRequestHandler) via Keywork's documentation.
//      *
//      * ---
//      */
//     urlPattern: URLPatternLike,
//     /**
//      * One or more callbacks to handle the matching incoming request.
//      *
//      * See [`RequestHandler`](https://keywork.app/modules/router/classes/RequestRouter) for more details.
//      *
//      * ---
//      */
//     ...handlers: RequestHandler<BoundAliases, ExpectedParams, Data>[]
//   ): void {
//     return this.appendMethodRoutes('put', urlPattern, ...handlers)
//   }

//   /**
//    * Defines a handler for incoming `PATCH` requests.
//    *
//    * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH Documentation via MDN}
//    *
//    * @category HTTP Method Handler
//    * @public
//    */
//   public patch<ExpectedParams = {}, Data = {}>(
//     /**
//      * Either an instance of `URLPattern`,
//      * or a string representing the `pathname` portion of a `URLPattern`
//      *
//      * - ["Parsing path parameters"](https://keywork.app/modules/router#path-parameters) via Keywork's documentation.
//      * - [`URLPattern` Documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) via MDN
//      * - [`RequestHandler` interface](https://keywork.app/modules/router/interfaces/RouteRequestHandler) via Keywork's documentation.
//      *
//      * ---
//      */
//     urlPattern: URLPatternLike,
//     /**
//      * One or more callbacks to handle the matching incoming request.
//      *
//      * See [`RequestHandler`](https://keywork.app/modules/router/classes/RequestRouter) for more details.
//      *
//      * ---
//      */
//     ...handlers: RequestHandler<BoundAliases, ExpectedParams, Data>[]
//   ): void {
//     return this.appendMethodRoutes('patch', urlPattern, ...handlers)
//   }

//   /**
//    * Defines a handler for incoming `DELETE` requests.
//    *
//    * The HTTP DELETE request method deletes the specified resource.
//    *
//    * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE Documentation via MDN}
//    *
//    * @category HTTP Method Handler
//    * @public
//    */
//   public delete<ExpectedParams = {}, Data = {}>(
//     /**
//      * Either an instance of `URLPattern`,
//      * or a string representing the `pathname` portion of a `URLPattern`
//      *
//      * - ["Parsing path parameters"](https://keywork.app/modules/router#path-parameters) via Keywork's documentation.
//      * - [`URLPattern` Documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) via MDN
//      * - [`RequestHandler` interface](https://keywork.app/modules/router/interfaces/RouteRequestHandler) via Keywork's documentation.
//      *
//      * ---
//      */
//     urlPattern: URLPatternLike,
//     /**
//      * One or more callbacks to handle the matching incoming request.
//      *
//      * See [`RequestHandler`](https://keywork.app/modules/router/classes/RequestRouter) for more details.
//      *
//      * ---
//      */
//     ...handlers: RequestHandler<BoundAliases, ExpectedParams, Data>[]
//   ): void {
//     return this.appendMethodRoutes('delete', urlPattern, ...handlers)
//   }

//   /**
//    * Defines a handler for incoming `HEAD` requests.
//    *
//    * The HTTP HEAD method requests the headers that would be returned
//    * if the HEAD request's URL was instead requested with the HTTP GET method.
//    * For example, if a URL might produce a large download,
//    * a HEAD request could read its Content-Length header to check the filesize
//    * without actually downloading the file.
//    *
//    * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD Documentation via MDN}
//    * @category HTTP Method Handler
//    * @public
//    */
//   public head<ExpectedParams = {}, Data = {}>(
//     /**
//      * Either an instance of `URLPattern`,
//      * or a string representing the `pathname` portion of a `URLPattern`
//      *
//      * - ["Parsing path parameters"](https://keywork.app/modules/router#path-parameters) via Keywork's documentation.
//      * - [`URLPattern` Documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) via MDN
//      * - [`RequestHandler` interface](https://keywork.app/modules/router/interfaces/RouteRequestHandler) via Keywork's documentation.
//      *
//      * ---
//      */
//     urlPattern: URLPatternLike,
//     /**
//      * One or more callbacks to handle the matching incoming request.
//      *
//      * See [`RequestHandler`](https://keywork.app/modules/router/classes/RequestRouter) for more details.
//      *
//      * ---
//      */
//     ...handlers: RequestHandler<BoundAliases, ExpectedParams, Data>[]
//   ): void {
//     return this.appendMethodRoutes('head', urlPattern, ...handlers)
//   }

//   /**
//    * Defines a handler for incoming `OPTIONS` requests.
//    *
//    * The HTTP OPTIONS method requests permitted communication options for a given URL or server.
//    * A client can specify a URL with this method, or an asterisk (*) to refer to the entire server.
//    *
//    * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS Documentation via MDN}
//    * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS Understanding CORS on MDN}
//    *
//    * @category HTTP Method Handler
//    * @public
//    */
//   public options<ExpectedParams = {}, Data = {}>(
//     /**
//      * Either an instance of `URLPattern`,
//      * or a string representing the `pathname` portion of a `URLPattern`
//      *
//      * - ["Parsing path parameters"](https://keywork.app/modules/router#path-parameters) via Keywork's documentation.
//      * - [`URLPattern` Documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) via MDN
//      * - [`RequestHandler` interface](https://keywork.app/modules/router/interfaces/RouteRequestHandler) via Keywork's documentation.
//      *
//      * ---
//      */
//     urlPattern: URLPatternLike,
//     /**
//      * One or more callbacks to handle the matching incoming request.
//      *
//      * See [`RequestHandler`](https://keywork.app/modules/router/classes/RequestRouter) for more details.
//      *
//      * ---
//      */
//     ...handlers: RequestHandler<BoundAliases, ExpectedParams, Data>[]
//   ): void {
//     return this.appendMethodRoutes('options', urlPattern, ...handlers)
//   }

//   /**
//    * Defines a handler for any incoming request, regardless of the HTTP method sent.
//    *
//    * This will always be a **higher priority** than an explicitly defined method handler.
//    * If you're creating a router as middleware, `RequestRouter#all` can be especially useful for intercepting incoming requests.
//    *
//    * @category HTTP Method Handler
//    * @public
//    */
//   public all<ExpectedParams = {}, Data = {}>(
//     /**
//      * Either an instance of `URLPattern`,
//      * or a string representing the `pathname` portion of a `URLPattern`
//      *
//      * - ["Parsing path parameters"](https://keywork.app/modules/router#path-parameters) via Keywork's documentation.
//      * - [`URLPattern` Documentation](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) via MDN
//      * - [`RequestHandler` interface](https://keywork.app/modules/router/interfaces/RouteRequestHandler) via Keywork's documentation.
//      *
//      * ---
//      */
//     urlPattern: URLPatternLike,
//     /**
//      * One or more callbacks to handle the matching incoming request.
//      *
//      * See [`RequestHandler`](https://keywork.app/modules/router/classes/RequestRouter) for more details.
//      *
//      * ---
//      */
//     ...handlers: RequestHandler<BoundAliases, ExpectedParams, Data>[]
//   ): void {
//     this.appendMethodRoutes('all', urlPattern, ...handlers)
//   }

//   //#endregion

//   //#region Router extension.

//   /**
//    * Combines additional routers and their respective route handlers to this router.
//    *
//    * Route handlers are matched in the order of their declaration:
//    *
//    * ```ts
//    * const app = new RequestRouter()
//    *
//    * app.get('/foo', ({request}) => {
//    *   return new Response('This handler got here first!')
//    * })
//    *
//    * app.get('/foo', ({request}) => {
//    *   return new Response('This handler won't be called!')
//    * })
//    * ```
//    *
//    * However, if you want another router to act as middleware,
//    * Call `use` before defining your route handlers:
//    *
//    * ```ts
//    * const authenticationRouter = new RequestRouter()
//    *
//    * authenticationRouter.all('*', ({request, next}) => {
//    *   if (!hasAuthCookie(request)) {
//    *     return new KeyworkResourceError(401, "You need to be signed in to do that!")
//    *   }
//    *
//    *   // Pass the request along to the next matching route handler.
//    *   return next()
//    * })
//    *
//    * const app = new RequestRouter()
//    *
//    * app.use('/', authenticationRouter)
//    *
//    * app.get('/user/profile', ({request}) => {
//    *   return new Response("Some user only content.")
//    * })
//    * ```
//    *
//    * @public
//    * @category Middleware
//    */
//   public use<BoundAliasesOverride = BoundAliases>(
//     /**
//      * The middleware to mount.
//      * The given middleware will execute _before_ any other request handlers
//      * that are defined _after_ invoking `use(...)`.
//      */
//     middleware: RequestMiddleware<BoundAliasesOverride>
//   ): void
//   public use<BoundAliasesOverride = BoundAliases>(
//     /** A `URLpattern` of where the given middleware should be mounted.  */
//     mountURLPattern: URLPatternLike,
//     /** The middleware to mount. */
//     middleware: RequestMiddleware<BoundAliasesOverride>
//   ): void
//   public use(...args: unknown[]): void {
//     let mountURLPattern: URLPatternLike
//     let middleware: RequestMiddleware<BoundAliases>

//     if (args.length > 1) {
//       // Path pattern was provided...
//       mountURLPattern = normalizeURLPattern(args[0] as URLPatternLike, {
//         appendWildcard: true,
//       })

//       middleware = args[1] as RequestMiddleware<BoundAliases>
//     } else {
//       // Path pattern defaults to root...
//       mountURLPattern = normalizeURLPattern('*', {
//         appendWildcard: false,
//       })
//       middleware = args[0] as RequestMiddleware<BoundAliases>
//     }

//     this.appendMethodRoutes('all', mountURLPattern, middleware)
//   }

//   //#endregion

//   //#region Debugging

//   /**
//    * A display name used for debugging and log messages.
//    * @category Debug
//    */
//   public get displayName() {
//     return this.fetch.displayName
//   }

//   /**
//    * A server-side logger.
//    *
//    * Read more via the [Logger module](https://keywork.app/modules/logger/classes/Logger)
//    * @category Debug
//    */
//   public readonly logger: Logger

//   //#endregion

//   //#region Fetch

//   /**
//    * A Cloudflare Workers specific method for handling incoming requests via the `fetch` event.
//    *
//    * Generally, this method does not need to be invoked directly within your app.
//    * Instead, export the instance of your `RequestRouter`:
//    *
//    * ```ts
//    * const app = new RequestRouter()
//    *
//    * app.get('/', () => 'Hello from Keywork')
//    *
//    * export default app
//    * ```
//    *
//    * `app.fetch` will automatically called by the Worker runtime when an incoming request is received.
//    *
//    * @category Request
//    * @public
//    */
//   public fetch: FetchEventHandler<BoundAliases> = async (request, env, event) => {
//     return this.mapToResponse(new IsomorphicFetchEvent<BoundAliases>({ ...event, request, env }))
//   }

//   /**
//    * The router's primary method for mapping an incoming request to a response.
//    *
//    * {@link RequestRouter.fetch} will delegate to a HTTP-method specific handler previously defined by yourself,
//    * such as with {@link RequestRouter.get}, or intercepted by previously defined middleware,
//    * such as {@link RequestRouter.use}.
//    */
//   public mapToResponse: RequestResponseMapper<BoundAliases, {}, {}, Response | Promise<Response>>

//   /**
//    * @internal
//    */
//   public _createRequestMapper = <ExpectedReturn extends ResponseLike = ResponseLike>(
//     middleware?: RequestMiddleware<BoundAliases>
//   ) => {
//     const requestResponseMapper: RequestResponseMapper<BoundAliases> = async (...args) => {
//       let fetchEventInit: IsomorphicFetchEventInit<BoundAliases>
//       let next: Parameters<RequestHandler<BoundAliases, ExpectedReturn>>[1]

//       if (args[0] instanceof Request) {
//         fetchEventInit = { request: args[0], env: args[1] as BoundAliases }
//       } else {
//         ;[fetchEventInit] = args as Parameters<RequestHandler<BoundAliases, ExpectedReturn>>
//       }

//       const { request, env } = fetchEventInit

//       this.logger.debug('[Stage #1]', `Normalizing '${request.method}' request...`)
//       const requestURL = new URL(request.url)

//       this.logger.debug('[Stage #2]', 'Searching for matching routes...')
//       this.logger.debug('>>>>, request', request)

//       const matchResults = [
//         // Given the current URL, attempt to find a matching route handler...
//         ...this.match(request),
//         // Blend the parent routes...
//         ...(fetchEventInit.matchResults && fetchEventInit.controlFlow === 'direct' ? fetchEventInit.matchResults : []),
//       ]

//       if (!matchResults.length) {
//         this.logger.debug('[Stage #2]', 'No matched routes found at this layer.')
//         return next()
//       }

//       this.logger.debug('[Stage #2]', `Found ${matchResults.length} matching route(s)!`)

//       for (const matchResult of matchResults) {
//         this.logger.debug('[Stage #2]', `...Route: ${matchResult.mapper.displayName || 'anonymous'}`)
//       }

//       if (!matchResults || matchResults?.length === 0) {
//         this.logger.debug('[Stage #3]', 'Next handler does not have any match results to work with...')
//         return next()
//       }

//       const [{ match, mapper }, ...fallbackMatchResults] = matchResults

//       this.logger.debug('[Stage #3]', mapper.displayName, 'Normalizing request URL path...')
//       const normalizedURL = new URL(requestURL)
//       const pathnameGroups = match.pathname.groups['0']

//       if (pathnameGroups) {
//         normalizedURL.pathname = pathnameGroups
//       }

//       this.logger.debug('[Stage #3]', mapper.displayName, 'Creating request event...')

//       const fetchEvent = new IsomorphicFetchEvent({
//         // The current pattern only matches the beginning of the pathname.
//         // So, we remove the matched portion which allows any nested routes to
//         // behave as if the pathname did not include any unforseen prefixes.
//         request: new Request(normalizedURL, request),
//         env,
//         matchResults: fallbackMatchResults,
//       })

//       this.logger.debug('[Stage #3]', 'Sending request', requestURL.pathname, mapper.displayName)

//       for (const fallbackMatchResult of fallbackMatchResults) {
//         console.debug('>>> FALLBACK', fallbackMatchResult.mapper.displayName)
//       }

//       // TODO: this is a hack to get around the fact that the `next` function
//       // is not being passed to the middleware. This is a temporary fix until
//       // I can figure out a better way to handle this.
//       const handler = middleware || mapper
//       let possibleResponse: Response | null = null

//       try {
//         if (typeof handler === 'function') {
//           this.logger.debug('[Stage #4]', 'Sending request to function', requestURL.pathname, mapper.displayName)

//           const middlewareResult = await (handler as RequestHandler)(fetchEvent)
//           possibleResponse = await this.responseHandler.convert(middlewareResult)
//         } else if (RequestRouter.assertIsInstanceOf(handler)) {
//           possibleResponse = await handler.mapToResponse(fetchEvent)
//         } else if (isServiceBinding(handler)) {
//           possibleResponse = await handler.fetch(fetchEvent.request, fetchEvent.env)
//         } else {
//           possibleResponse = new ErrorResponse(
//             Status.InternalServerError,
//             `Unexpected request middleware type: ${typeof middleware}`
//           )
//         }
//       } catch (error) {
//         this.logger.error(error)

//         return new ErrorResponse(
//           error,
//           'A server error occurred while delegating the request. See logs for additional information.'
//         )
//       }

//       if (possibleResponse === null) {
//         this.logger.debug('[Stage #4]', 'Response was a NextMiddlewareResponse. Delegating to next middleware...')
//         return next()
//       }

//       this.logger.debug('[Stage #4]', 'Sending a fully qualified response!')

//       return possibleResponse
//     }

//     return requestResponseMapper as RequestResponseMapper<BoundAliases, {}, {}, ExpectedReturn>
//   }

//   //#endregion

//   //#region Internal

//   /** @internal */
//   protected responseHandler: ResponseHandler

//   /** @internal */
//   protected readonly [kInstance] = true as boolean
//   /** @internal */
//   protected static readonly [kObjectName] = true as boolean

//   /** @internal */
//   static assertIsInstanceOf<BoundAliases = any>(routerLike: any): routerLike is RequestRouter<BoundAliases> {
//     return Boolean(routerLike && (routerLike instanceof RequestRouter || kInstance in routerLike))
//   }

//   //#endregion

//   //#region Lifecyle

//   constructor({
//     displayName = 'Unnamed RequestRouter',
//     responseHandler = new ResponseHandler({ streamRenderer: renderReactStream }),
//     debug = {},
//     middleware,
//   }: RequestRouterOptions = {}) {
//     this.logger = new Logger(displayName)

//     this.responseHandler = responseHandler
//     this.mapToResponse = this._createRequestMapper<Response | Promise<Response>>()

//     if (debug) {
//       const debugOptions = typeof debug === 'boolean' ? {} : debug

//       if (typeof debugOptions.includeHeaders === 'undefined' || debugOptions.includeHeaders) {
//         this.use(includeDebugHeadersMiddleware)
//       }
//     }

//     if (middleware) {
//       for (const middlewareDeclaration of middleware) {
//         if (isMiddlewareDeclarationOption(middlewareDeclaration)) {
//           this.use(...middlewareDeclaration)
//         } else {
//           this.use(middlewareDeclaration)
//         }
//       }
//     }
//   }

//   /** @internal */
//   dispose(reason = 'default') {
//     this.logger.debug('Disposing...', reason)
//     this.routesByVerb.clear()
//   }

//   //#endregion
// }

// /** @internal */
// const terminateMiddleware = () => {
//   return new ErrorResponse(Status.NotFound, 'No matching route was found.')
// }

// /**
//  * @internal
//  */
// export const KeyworkHeaders = {
//   'X-Powered-By': 'Keywork',
// }

// export interface RouteDebugEntrypoint {
//   displayName?: string
//   httpMethod?: HTTPMethod
//   urlPattern?: URLPattern
//   entries: RouteDebugEntrypoint[]
// }

// /**
//  * @internal
//  */
// export const includeDebugHeadersMiddleware: RequestHandler = async (_event, next) => {
//   const response = await next()

//   if (!response) {
//     return response
//   }

//   const mutableResponse = cloneAsMutableResponse(response)

//   for (const [key, value] of Object.entries(KeyworkHeaders)) {
//     mutableResponse.headers.set(key, value)
//   }

//   return mutableResponse
// }

// /**
//  * Outputs the known routes to the console.
//  * @category Debug
//  * @internal
//  */
// export function prettyPrintRoutes(router: RequestRouter, debugEndpoints: RouteDebugEntrypoint[]): void {
//   for (const { httpMethod, entries } of debugEndpoints) {
//     if (!entries.length) continue

//     router.logger.log('METHOD:', httpMethod)

//     for (const route of entries) {
//       router.logger.log(route.displayName || '', route.urlPattern?.pathname)

//       prettyPrintRoutes(router, debugEndpoints)
//     }
//   }
// }

// /**
//  * @internal
//  */
// export function includeDebugEndpoint(parentRouter: RequestRouter<any>): RequestHandler {
//   return async (_request, _next) => {
//     return getRoutesByHTTPMethod(parentRouter)
//   }
// }

// /**
//  * Collates the known routes by HTTP method verb.
//  *
//  * @see {RequestRouter#$prettyPrintRoutes}
//  * @category Debug
//  * @internal
//  */
// export function getRoutesByHTTPMethod(router: RequestRouter<any>): RouteDebugEntrypoint[] {
//   return Array.from(router.routesByVerb.entries(), ([routerMethod, routeEntries]) => {
//     const httpMethod = routerMethodToHTTPMethod.get(routerMethod)!

//     const entry: RouteDebugEntrypoint = {
//       httpMethod,
//       displayName: router.displayName || '',
//       entries: Array.from(routeEntries, ([urlPattern, mapper]) => {
//         const entries = RequestRouter.assertIsInstanceOf<any>(mapper) ? getRoutesByHTTPMethod(mapper) : []

//         return {
//           httpMethod,
//           displayName: mapper.displayName,
//           urlPattern: urlPattern,
//           entries,
//         }
//       }),
//     }

//     return entry
//   })
// }

// // Legacy name for backwards compatibility
// export { RequestRouter as KeyworkRouter }
