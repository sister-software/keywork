/**
 * The {@link Keywork#Router.RequestRouter `RequestRouter`}
 * can be made compatible with Node.js
 * via the {@link Keywork#Router#Node.createServerHandler `createServerHandler`} wrapper function:
 *
 * ```ts showLineNumbers
 * import * as http from 'node:http'
 * import { RequestRouter } from './router/index.js'
 * import { createServerHandler } from './router/node/index.js'
 *
 * // Create a router as you usually do...
 * // highlight-next-line
 * const router = new RequestRouter()
 * router.get('/', () => 'Hello from Node')
 *
 * // And then wrap the router with `createServerHandler`
 * // highlight-next-line
 * http.createServer(createServerHandler(router))
 * ```
 *
 * :::caution
 * Node support is currently experimental and may change in the near future.
 * :::
 *
 * @packageDocumentation
 * @module Keywork#Router#Node
 * @tag Node
 * @tag Routing
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

export * from './createServerHandler.js'
export * from './files.js'
export * from './import-map.js'
export * from './paths.js'
export * from './polyfills.js'
export * from './respondWithRouter.js'
export * from './static.js'
