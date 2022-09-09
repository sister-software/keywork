/**
 * Designed with familiarity in mind, the server-side routing API is inspired by
 * Express.js, React Router, and the native Cloudflare Workers platform.
 *
 * ```ts title="worker.ts" runtime="cloudflare"
 * import { RequestRouter } from 'keywork/router'
 *
 * const app = new RequestRouter()
 *
 * app.get('/', () => 'Hello there! 👋')
 *
 * export default app
 * ```
 *
 * ```ts title="./your-project/server/mod.tsx" runtime="deno"
 * import { RequestRouter } from 'https://deno.land/x/keywork/modules/router/mod.ts'
 * import { serve } from 'https://deno.land/std@0.140.0/http/server.ts'
 *
 * const app = new RequestRouter()
 * serve((request) => app.fetch(request))
 * ```
 *
 * ```ts title="worker.ts" runtime="browser"
 * import { RequestRouter } from 'https://esm.sh/keywork/router'
 *
 * const app = new RequestRouter()
 *
 * app.get('/', () => 'Hello there! 👋')
 * ```
 *
 * ## Creating a RESTful API
 *
 * Instances of [`RequestRouter`](https://keywork.app/modules/router/classes/RequestRouter)
 * define each route handler by invoking methods that correspond with HTTP method of the same name:
 *
 * | HTTP Method | Usage                                                |
 * | ----------- | ---------------------------------------------------- |
 * | `'GET'`     | `app.get([path pattern], [RequestHandler])`     |
 * | `'POST'`    | `app.post([path pattern], [RequestHandler])`    |
 * | `'PATCH'`   | `app.patch([path pattern], [RequestHandler])`   |
 * | `'DELETE'`  | `app.delete([path pattern], [RequestHandler])`  |
 * | `'HEAD'`    | `app.head([path pattern], [RequestHandler])`    |
 * | `'OPTIONS'` | `app.options([path pattern], [RequestHandler])` |
 * | `'*'`       | `app.all([path pattern], [RequestHandler])`     |
 *
 * ### HTTP GET
 *
 * The HTTP GET method requests a representation of the specified resource.
 * Requests using GET should only be used to request data.
 *
 * #### Return a string
 *
 * ```ts title="GET http://localhost:8788"
 * app.get('/', () => 'Hello there! 👋')
 * // Hello there! 👋
 * ```
 *
 * #### Returning a string with a URL parameter
 *
 * ```ts title="GET http://localhost:8788/greet/jessie"
 * app.get('/greet/:firstName', ({ params }) => `Hello there, ${params.firstName}!`)
 * // Hello there, Jessie!
 * ```
 *
 * ```ts title="GET http://localhost:8788/datetime"
 * app.get('/datetime', () => `The current datetime is: ${new Date().toLocaleTimeString()}`)
 * // The current datetime is: 11:35:00 AM
 * ```
 *
 * ### HTTP POST
 *
 * The HTTP POST method sends data to the server.
 * The file type of the body of the request is indicated by the `Content-Type` header.
 *
 * #### Creating a user from a request payload
 *
 * ```ts title="POST http://localhost:8788/users"
 * interface NewUserPayload {
 *   displayName: string
 *   email: string
 * }
 *
 * app.post('/users', async ({ request }) => {
 *   const user: NewUserPayload = await request.json()
 *
 *   //...
 * })
 * ```
 *
 * ### Path Parameters
 *
 * Route path parameters are defined with a [`path-to-regexp` style](https://www.npmjs.com/package/path-to-regexp) pattern.
 *
 * ```ts
 * app.get('/users/', ...)
 * app.post('/users/', ...)
 *
 * app.get('/users/:userID/', ...)
 * app.get('/users/:userID/friends/', ...)
 * app.get('/articles/:articleID', ...)
 * ```
 *
 * Path matching is implemented via the JavaScript native
 * [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern)
 *
 * :::tip
 * You may need a polyfill if your app uses on a runtime that hasn't yet added
 * [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) class.
 *
 * [**_Learn more from the URI Module_ ›**](https://keywork.app/modules/uri)
 *
 * :::
 *
 * ### `IsomorphicFetchEvent`
 *
 * When creating a [`RequestHandler`](https://keywork.app/modules/router/interfaces/RouteRequestHandler) callback,
 * you have access to an [`IsomorphicFetchEvent`](https://keywork.app/modules/events/classes/IsomorphicFetchEvent):
 *
 * ```ts title="GET http://localhost:8788"
 * // highlight-next-line
 * app.get('', (event) => {
 *   const {
 *     // highlight-start
 *     request,
 *     params
 *     env,
 *     data,
 *     originalURL
 *     // highlight-end
 *   } = event
 *
 *   return 'Hello there! 👋'
 * })
 * ```
 *
 * #### `IsomorphicFetchEvent.request`
 *
 * The [incoming request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
 * received by the V8 runtime.
 *
 * #### `IsomorphicFetchEvent<ExpectedParams>.params`
 *
 * Parameters parsed from the incoming request's URL and the route's pattern.
 *
 * This can be made type-safe by providing a generic type when defining the route:
 *
 * ```ts title="GET http://localhost:8788/users/cambria"
 * // highlight-start
 * interface UserProps {
 *   userID: string
 * }
 * // highlight-end
 *
 * app.get<UserProps>('/users/:userID', (event) => {
 *   const { userID } = event.params
 * })
 * ```
 *
 * #### `IsomorphicFetchEvent.env`
 *
 * The bound environment aliases.
 * [Bound environment aliases](https://developers.cloudflare.com/workers/platform/environment-variables/)
 * are mostly limited to Cloudflare Workers, and are usually defined in your `wrangler.toml` file.
 *
 * ##### Node.js
 *
 * This is similar to `process.env`.
 *
 * #### `IsomorphicFetchEvent.data`
 *
 * Optional extra data to be passed to a route handler,
 * usually from {@link Keywork#Middleware middleware}.
 *
 * #### `IsomorphicFetchEvent.originalURL`
 *
 * The original request URL, unmodified by Keywork's middleware logic.
 *
 * ## Middleware
 *
 * Similar to Express.js's concept of Middleware, route handlers have access to a
 * `next` function to pass a request off to the next route handler matching the URL pattern.
 *
 * `next` can also be called after checking for some criteria, such as if the user has authenticated:
 *
 * ```ts title="Check if a user is allowed to view a page"
 * const authenticationRouter = new RequestRouter()
 *
 * authenticationRouter.all('*',
 * (event, next) => {
 *   if (!isAuthenticated(event.request)) {
 *     throw new KeyworkResourceError("You need to be logged in to view that!", Status.Forbidden)
 *   }
 *
 *   return next()
 * })
 *
 * app.use(authenticationRouter)
 * app.get('/profile/settings', () => {...})
 * ```
 *
 * ### Overrides
 *
 * Providing a `request` argument will override the path param parsing within `RequestRouter`.
 * This can be useful if your middleware needs to modify or omit some request
 * information before reaching the next route handler.
 *
 * ## Additional Perks
 *
 * The `RequestRouter` class also provides some small quality-of-life improvements
 * over the low-level APIs of the Workers platform.
 *
 * ### Automatic Response Parsing
 *
 * Keywork will automatically infer the appropriate
 * [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * for the return type of your `RouteHandler`, allowing you to skip the ceremony of constructing
 * `Response` with the appropriate headers
 *
 * However, this behavior can be avoided by explicitly providing a `Response` object,
 * or a class that extends from `Response` such as...
 *
 * - [`CachableResponse`](https://keywork.app/modules/http/classes/CachableResponse)
 * - [`HTMLResponse`](https://keywork.app/modules/http/classes/HTMLResponse)
 * - [`JSONResponse`](https://keywork.app/modules/http/classes/JSONResponse)
 * - [`ErrorResponse`](https://keywork.app/modules/http/classes/ErrorResponse)
 *
 * ### Errors
 *
 * Errors in your code are caught before they crash the runtime.
 * See [`KeyworkResourceError`](https://keywork.app/modules/errors/classes/KeyworkResourceError) for further details.
 *
 * ### Sessions
 *
 * Support for cookie-based sessions is automatically handled.
 * See [`SessionMiddleware`](https://keywork.app/modules/middleware/classes/SessionMiddleware) for further details.
 *
 * ## Related Entries
 *
 * - [URI Module](https://keywork.app/modules/uri)
 * - [Middleware Module](https://keywork.app/modules/middleware)
 *
 * ## Further reading
 *
 * - [URLPattern via MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
 * - [RESTful API patterns](https://www.restapitutorial.com/lessons/httpmethods.html)
 *
 * @packageDocumentation
 * @module Keywork#Router
 *
 * @keyword Router
 * @keyword Routing
 * @keyword Cloudflare Pages
 * @keyword Cloudflare Workers
 * @keyword Deno
 *
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
/* eslint-disable header/header */

export * from './classes/mod.ts'
export * from './functions/mod.ts'
export * from './interfaces/mod.ts'
export * from './types/mod.ts'
