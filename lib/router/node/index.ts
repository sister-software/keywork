/* eslint-disable header/header */
// @ts-no-check
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

/**
 * ### `keywork/router/node`
 *
 * Everything you need to handle incoming requests in a Worker environment.
 *
 * @packageDocumentation
 * @module router.node
 */

import { WorkerRouter } from 'keywork/router'
import HTTP from 'keywork/platform/http'

import { IncomingMessage, ServerResponse } from 'http'
import { CloudflareFetchEvent } from 'keywork/request/cloudflare'
import { readGlobalScope } from '../../polyfills/platform/index.ts'

// const { IncomingMessage, ServerResponse } = await import('node:' + 'http')

/**
 * Node-compatible callback for use with `http.createServer`
 */
export type ServerHandler = (req: IncomingMessage, res: ServerResponse) => void

/** @internal */
export type ProcessChunkCallback = (chunkResult: ReadableStreamDefaultReadResult<Uint8Array>) => Promise<void>

/**
 * Given a `WorkerRouter`, responds to an incoming request from a Node server.
 *
 * @example
 *
 * ```ts
 * import * as http from 'node:http'
 * import { WorkerRouter } from 'keywork/router'
 * import { respondWithRouter } from 'keywork/router/node'
 *
 * const router = new WorkerRouter()
 * http.createServer((req, res) => {
 *   respondWithRouter(router, req, res)
 * })
 * ```
 * @see {createServerHandler}
 * @beta Node support is currently experimental and may change in the near future.
 */
export async function respondWithRouter<BoundAliases extends {} | null = null>(
  router: WorkerRouter<BoundAliases>,
  nodeRequest: IncomingMessage,
  nodeResponse: ServerResponse
): Promise<void> {
  const request = new HTTP.Request(nodeRequest.url || 'http://0.0.0.0', nodeRequest as unknown as RequestInit)
  const runtimeFetchEvent = new CloudflareFetchEvent(request)

  const response = await router.fetch(request, readNodeEnv<BoundAliases>(), runtimeFetchEvent)

  nodeResponse.statusCode = response.status
  nodeResponse.statusMessage = response.statusText

  for (const [name, value] of response.headers.entries()) {
    nodeResponse.setHeader(name, value)
  }

  if (response.body) {
    const reader = response.body.getReader()
    const processChunk: ProcessChunkCallback = async ({ done, value }) => {
      nodeResponse.write(value)

      if (!done) {
        await reader.read().then(processChunk)
      }
    }

    await reader.read().then(processChunk)
  }

  await runtimeFetchEvent.flushTasks()
}

/**
 * Given a `WorkerRouter`, creates a Node-compatible server handler.
 *
 * @example
 *
 * ```ts
 * import * as http from 'node:http'
 * import { WorkerRouter } from 'keywork/router'
 * import { createServerHandler } from 'keywork/router/node'
 *
 * const router = new WorkerRouter()
 * http.createServer(createServerHandler(router))
 * ```
 *
 * @see {respondWithRouter}
 * @beta Node support is currently experimental and may change in the near future.
 */
export function createServerHandler<BoundAliases extends {} | null = null>(
  router: WorkerRouter<BoundAliases>
): ServerHandler {
  return (req, res) => respondWithRouter<BoundAliases>(router, req, res)
}

function readNodeEnv<BoundAliases extends {} | null = null>(): BoundAliases {
  const globalScope = readGlobalScope()

  return (globalScope as any).process?.env || null
}
