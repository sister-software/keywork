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

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { Socket } from 'node:net'
import type { RequestRouter } from '../router/index.js'
import { respondWithRouter } from './respondWithRouter.js'

/**
 * Node-compatible callback for use with `http.createServer`
 */
export type ServerHandler = (req: IncomingMessage, res: ServerResponse) => void

/**
 * Given a `RequestRouter`, creates a Node-compatible server handler.
 *
 * ```ts
 * import * as http from 'node:http'
 * import { RequestRouter } from './router/index.js'
 * import { createServerHandler, applyNodeKeyworkPolyfills } from 'keywork'
 *
 * await applyNodeKeyworkPolyfills()
 *
 * const router = new RequestRouter()
 * http.createServer(createNodeServerHandler(router))
 * ```
 *
 * @see {respondWithRouter}
 * @beta Node support is currently experimental and may change in the near future.
 */
export function createNodeServerHandler<BoundAliases = {}>(
  router: RequestRouter<BoundAliases>,
  env?: BoundAliases
): ServerHandler {
  return (req, res) => respondWithRouter<BoundAliases>(router, req, res, env)
}

/**
 * Given a `RequestRouter`, creates a Node-compatible server.
 */
export function createNodeKeyworkServer<BoundAliases = {}>(
  router: RequestRouter<BoundAliases>,
  server = createServer(createNodeServerHandler(router))
) {
  const connections = new Set<Socket>()
  server.on('connection', (connection) => {
    connections.add(connection)
    connection.on('close', () => connections.delete(connection))
  })

  server.on('close', () => router.dispose('Shutting down...'))

  const onProcessEnd = () => {
    for (const connection of connections) {
      connection.destroy()
    }

    connections.clear()

    server.close(() => process.exit(0))
  }

  process.on('SIGINT', onProcessEnd)
  process.on('SIGTERM', onProcessEnd)

  return server
}
