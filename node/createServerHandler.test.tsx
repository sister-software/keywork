import { createNodeServerHandler } from 'keywork/node/createServerHandler'
import { applyNodeKeyworkPolyfills } from 'keywork/node/polyfills'
import { RequestRouter } from 'keywork/router'
import { Logger } from 'keywork/utils'
import * as http from 'node:http'

await applyNodeKeyworkPolyfills()

const logger = new Logger('Test Server')

// Create a router as you usually do...
const router = new RequestRouter({
  logLevel: 'Debug',
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
