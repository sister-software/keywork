/**
 * _Middleware_ are instances of the {@link Keywork#Router.KeyworkRouter `KeyworkRouter`},
 * each with single responsibility
 * e.g. (users, blog posts, payments, authentication, etc.)
 *
 * ```ts
 * import { UsersRouter } from '@local/worker/routers/UsersRouter'
 * import { BlogRouter } from '@local/worker/routers/BlogRouter'
 * import { AuthenticationRouter } from '@local/worker/routers/AuthenticationRouter'
 * import { CloudflarePagesAssetRouter } from 'keywork/assets'
 * import { KeyworkRouter } from 'keywork/router'
 *
 * // Create a router to receive all incoming requests...
 * const app = new KeyworkRouter({
 *   // Here we combine our routers...
 *   // highlight-start
 *   middleware: [
 *     AuthenticationRouter,
 *     UsersRouter,
 *     BlogRouter,
 *     // And serve static assets...
 *     new CloudflarePagesAssetRouter(),
 *   ],
 *   // highlight-end
 * })
 * ```
 *
 * Middleware routers can perform any task that of single router such as...
 *
 * - Executing any code
 * - Make changes to the request and the response of another router
 * - Terminate a request
 * - Intercept a request to check for authentication
 * - Call the next route handler in the stack
 *
 * ## Built-in Middleware
 *
 * Keywork includes a number of built-in middleware for common use cases:
 *
 * - {@link Keywork#Middleware.CompressionMiddleware Automatic response compression}
 * - {@link Keywork#Middleware.SessionMiddleware Basic session management}
 * - {@link Keywork#Middleware.CORSMiddleware Cross-Origin Resource Sharing (CORS)}
 * - Cloudflare
 *   - {@link Keywork#Middleware.CloudflarePagesAssetRouter Serve static assets from _Cloudflare Pages_}
 *   - {@link Keywork#Middleware.WorkerSitesAssetRouter Serve static assets from a _Worker Site_}
 *   - {@link Keywork#Middleware.ServiceBindingRouter Proxy requests directly to another Cloudflare Worker}
 * *
 * @packageDocumentation
 * @module Keywork#Middleware

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
