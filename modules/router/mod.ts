/**
 * Designed with familiarity in mind, the server-side routing API is inspired by
 * Express.js, React Router, and the native Cloudflare Workers platform.
 *
 * ```ts title="worker.ts" runtime="cloudflare"
 * import { KeyworkRouter } from 'keywork/router'
 *
 * const app = new KeyworkRouter()
 *
 * app.get('/', () => 'Hello there! 👋')
 *
 * export default app
 * ```
 *
 * ```ts title="./your-project/server/mod.tsx" runtime="deno"
 * import { KeyworkRouter } from 'https://deno.land/x/keywork/modules/router/mod.ts'
 * import { serve } from 'https://deno.land/std@0.140.0/http/server.ts'
 *
 * const app = new KeyworkRouter()
 * serve((request) => app.fetch(request))
 * ```
 *
 * ```ts title="worker.ts" runtime="browser"
 * import { KeyworkRouter } from 'https://esm.sh/keywork/router'
 *
 * const app = new KeyworkRouter()
 *
 * app.get('/', () => 'Hello there! 👋')
 * ```
 *
 * ## Creating a RESTful API
 *
 * Instances of {@link Keywork#Router.KeyworkRouter `KeyworkRouter`} define each route handler by
 * invoking methods that correspond with HTTP method of the same name:
 *
 * | HTTP Method | Usage                                                |
 * | ----------- | ---------------------------------------------------- |
 * | `'GET'`     | `app.get([path pattern], [RouteRequestHandler])`     |
 * | `'POST'`    | `app.post([path pattern], [RouteRequestHandler])`    |
 * | `'PATCH'`   | `app.patch([path pattern], [RouteRequestHandler])`   |
 * | `'DELETE'`  | `app.delete([path pattern], [RouteRequestHandler])`  |
 * | `'HEAD'`    | `app.head([path pattern], [RouteRequestHandler])`    |
 * | `'OPTIONS'` | `app.options([path pattern], [RouteRequestHandler])` |
 * | `'*'`       | `app.all([path pattern], [RouteRequestHandler])`     |
 *
 * ### `GET` (`app.get([path pattern], [...RouteRequestHandler])`)
 *
 * ```ts title="GET http://localhost:8788"
 * app.get('/', () => 'Hello there! 👋')
 * // Hello there! 👋
 * ```
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
 * ### `POST` (`app.post([path pattern], [...RouteRequestHandler])`)
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
 * Routes are defined with a
 * [`path-to-regexp` style](https://www.npmjs.com/package/path-to-regexp) path patterns.
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
 * :::warning
 * You may need a polyfill if your app uses on a runtime that hasn't yet added
 * [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) class.
 *
 * [**_Learn more from the URI Module_ ›**](/modules/uri)
 *
 * :::
 *
 * ### `IsomorphicFetchEvent`
 *
 * When creating a {@link Keywork#Router.RouteRequestHandler `RouteRequestHandler`} callback,
 * you have access to an {@link Keywork#Events.IsomorphicFetchEvent `IsomorphicFetchEvent`}:
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
 * const authenticationRouter = new KeyworkRouter()
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
 * Providing a `request` argument will override the path param parsing within `KeyworkRouter`.
 * This can be useful if your middleware needs to modify or omit some request
 * information before reaching the next route handler.
 *
 * ## Additional Perks
 *
 * The `KeyworkRouter` class also provides some small quality-of-life improvements
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
 * - {@link Keywork#HTTP/Response.CachableResponse `CachableResponse`}
 * - {@link Keywork#HTTP/Response.HTMLResponse `HTMLResponse`}
 * - {@link Keywork#HTTP/Response.JSONResponse `JSONResponse`}
 * - {@link Keywork#HTTP/Response.ErrorResponse `ErrorResponse`}
 *
 * ### Errors
 *
 * Errors in your code are caught before they crash the runtime.
 * See {@link Keywork#Errors.KeyworkResourceError `KeyworkResourceError`} for further details.
 *
 * ### Sessions
 *
 * Support for cookie-based sessions is automatically handled.
 * See {@link Keywork#Session.SessionMiddleware `SessionMiddleware`} for further details.
 *
 * ## Related Entries
 *
 * - {@link Keywork#URIUtils URI Module}
 * - {@link Keywork#Session Session Module}
 * - {@link Keywork#Middleware Middleware Module}
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
