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

import * as http from 'node:http'
import { KeyworkLogLevel, KeyworkLogger } from '../logging/index.js'
import { RequestRouter } from '../router/index.js'
import { createNodeServerHandler } from './createServerHandler.js'
import { applyNodeKeyworkPolyfills } from './polyfills.js'

await applyNodeKeyworkPolyfills()

const logger = new KeyworkLogger('Test Server')

// Create a router as you usually do...
const router = new RequestRouter({
  logLevel: KeyworkLogLevel.Debug,
})
router.get('/', () => 'Hello from Node')

// And then wrap the router with `createServerHandler`
const server = http.createServer(createNodeServerHandler(router))

const host = process.env.KEYWORK_HOST || 'localhost'
const port = process.env.KEYWORK_PORT || '8080'

const serverURL = new URL(`http://${host}:${port}`)

logger.info('Starting server...')

server.listen(parseInt(serverURL.port, 10), serverURL.hostname, () => {
  logger.info(`Listening on ${serverURL}`)
})

process.on('SIGINT', () => {
  router.dispose('Server is shutting down...')
  server.close()
})
