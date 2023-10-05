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

// organize-imports-ignore

/**
 * Whether you're handling errors in your V8 Worker, Node.JS, or even the browser,
 * Keywork includes error utilities that pair nicely with HTTP requests.
 *
 * ```ts runtime="node"
 * import { KeyworkResourceError, StatusCodes } from 'keywork/errors'
 *
 * if (isLoggedIn(someUser)) {
 *   throw new KeyworkResourceError("You must be logged in to do that", StatusCodes.UNAUTHORIZED)
 * }
 * ```
 *
 * ```ts runtime="browser"
 * let { KeyworkResourceError, StatusCodes } = await import('https://esm.sh/keywork/errors')
 *
 * if (isLoggedIn(someUser)) {
 *   throw new KeyworkResourceError("You must be logged in to do that", StatusCodes.UNAUTHORIZED)
 * }
 * ```
 *
 * {@link Keywork#Errors **_Explore the Errors Module_ ›**}
 */
export * from 'keywork/errors'
//
export * from 'keywork/events'
//
/**
 * Keywork includes utilities for working with files,
 * such as determining the MIME type while handling an incoming HTTP request.
 *
 * ```ts
 * import { FileUtils } from 'keywork'
 * import * as FileUtils 'keywork/files'
 * ```
 *
 * {@link Keywork#FileUtils **_Explore the File Utilities Module_ ›**}
 */
export * from 'keywork/files'
//
/**
 * Keywork includes utilities for working with incoming HTTP requests,
 * and extends the native [`Request` class](https://developer.mozilla.org/en-US/docs/Web/API/Request)
 * for use with [Cloudflare Workers](https://developers.cloudflare.com/workers/runtime-apis/request/#requestinitcfproperties)
 *
 * See each of HTTP's submodules for additional details.
 *
 * ```ts
 * import { CachableResponse, ErrorResponse, isRedirection, ...etc } from 'keywork/http'
 * ```
 *
 * {@link Keywork#HTTP **_Explore the HTTP Module_ ›**}
 */
export * from 'keywork/http'
export * from 'keywork/utils'
//
/**
 * Keywork includes an isomorphic logger available in both browser and worker environments.
 *
 * ```ts
 * import { Logger } from 'keywork/utils'
 * const logger = new Logger('Todo API')
 *
 * logger.info('Fetching todo', todoID)
 * logger.error('Unexpected error')
 * ```
 *
 * {@link Keywork#Logger **_Explore the Logger Module_ ›**}
 */
export * from 'keywork/utils'
//
/**
 * Keywork includes support for _middleware_ as instances of `RequestRouter`.
 * Middleware can perform any task that of single router such as...
 *
 * - Executing any code
 * - Make changes to the request and the response of another router
 * - Terminate a request
 * - Intercept a request to check for authentication
 * - Call the next route handler in the stack
 * - Automatic response compression
 * - Cross-Origin Resource Sharing (CORS)
 *
 * {@link Keywork#Middleware **_Explore the Middleware Module_ ›**}
 */
export * from 'keywork/middleware'
//
/**
 * While optional, Keywork uses React as its primary HTML templating engine.
 *
 * {@link Keywork#ReactUtils **_Explore the React Utilities Module_ ›**}
 */
export * from 'keywork/ssr'
export * from 'keywork/uri'
//
/**
 * Designed with familiarity in mind, the server-side routing API
 * is inspired by Express.js, React Router, and the native Cloudflare Workers platform.
 *
 * {@link Keywork#Router **_Explore the Router Module_ ›**}
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
 * import { RequestRouter } from 'https://deno.land/x/keywork/modules/router'
 * import { serve } from 'https://deno.land/std@0.140.0/http/'
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
 */
export * from 'keywork/router'
//
/**
 * Keywork uses JavaScript's built-in [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) to create pattern matchers.
 * The syntax is based on [path-to-regexp](https://github.com/pillarjs/path-to-regexp).
 * Wildcards, named capture groups, regular groups, and group modifiers are all supported.
 *
 * ```ts
 * import * as mod from 'keywork/utils'
 * ```
 *
 * {@link Keywork#URIUtils **_Explore the Common Utilities Module_ ›**}
 */
export * from 'keywork/utils'
export * from 'keywork/cloudflare'
export * from 'keywork/client'
