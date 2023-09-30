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

import { IsomorphicFetchEvent } from 'keywork/events'
import { RequestRouter } from 'keywork/router'
import { readGlobalScope } from 'keywork/utils'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { transformIncomingMessageToRequest } from './transformers.js'

function readNodeEnv<BoundAliases = {}>(): BoundAliases {
  const globalScope = readGlobalScope()

  return (globalScope as any).process?.env || null
}

/**
 * Given a `RequestRouter`, responds to an incoming request from a Node server.
 *
 * ```ts
 * import * as http from 'node:http'
 * import { RequestRouter } from 'keywork/router'
 * import { respondWithRouter } from 'keywork/router/node'
 *
 * const router = new RequestRouter()
 * http.createServer((req, res) => {
 *   respondWithRouter(router, req, res)
 * })
 * ```
 *
 * @see {createServerHandler}
 */
export async function respondWithRouter<BoundAliases = {}>(
  router: RequestRouter<BoundAliases>,
  incomingMessage: IncomingMessage,
  serverResponse: ServerResponse
): Promise<void> {
  const request = transformIncomingMessageToRequest(incomingMessage)
  const env = readNodeEnv<BoundAliases>()
  const event = new IsomorphicFetchEvent('fetch', { request, originalURL: request.url, env })

  const fetchResponse = await router.fetch(request, env, event)

  serverResponse.statusCode = fetchResponse.status
  serverResponse.statusMessage = fetchResponse.statusText

  fetchResponse.headers.forEach((value, name) => {
    serverResponse.setHeader(name, value)
  })

  await processWebStreamToNodeStream(fetchResponse, serverResponse)
    .then(() => event.flushTasks())
    .catch((error) => {
      router.logger?.error(error)
    })
    .finally(() => {
      serverResponse.end()
    })
}

/**
 * Processes a `ReadableStream` from a `fetch` response into a Node `ServerResponse`.
 */
async function processWebStreamToNodeStream(fetchResponse: Response, serverResponse: ServerResponse): Promise<void> {
  if (!fetchResponse.body) return

  const bodyReader = fetchResponse.body.getReader()

  let chunkResult: ReadableStreamReadResult<Uint8Array>

  do {
    chunkResult = await bodyReader.read()

    if (chunkResult.done) break

    if (chunkResult.value) {
      serverResponse.write(chunkResult.value)
    }
  } while (!chunkResult.done)
}
