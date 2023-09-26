import { createServerHandler } from '@keywork/node'
import { Logger, RequestRouter } from 'keywork'
import * as http from 'node:http'

const logger = new Logger('Test Server')

// Create a router as you usually do...
const router = new RequestRouter()
router.get('/', () => 'Hello from Node')

// And then wrap the router with `createServerHandler`
const server = http.createServer(createServerHandler(router))
const host = process.env.HUGBOX_HOST || 'localhost'
const port = process.env.HUGBOX_PORT || '8080'
const serverURL = new URL(`http://${host}:${port}`)

logger.info('Starting server...')

server.listen(parseInt(serverURL.port, 10), serverURL.hostname, () => {
  logger.info(`Listening on ${serverURL}`)
})

process.on('SIGINT', () => {
  server.close()
})
