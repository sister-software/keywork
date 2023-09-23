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

import { readGlobalScope } from 'keywork/__internal/functions/readGlobalScope'
import { IsomorphicFetchEvent } from 'keywork/events'
import { RequestRouter } from 'keywork/router/classes/RequestRouter'
import { IncomingMessage, ServerResponse } from 'node:http'

/** @internal */
export type ProcessChunkCallback = (chunkResult: ReadableStreamReadResult<Uint8Array>) => Promise<void>

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
 * @see {createServerHandler}
 * @beta Node support is currently experimental and may change in the near future.
 */
export async function respondWithRouter<BoundAliases = {}>(
  router: RequestRouter<BoundAliases>,
  nodeRequest: IncomingMessage,
  nodeResponse: ServerResponse
): Promise<void> {
  const request = new Request(nodeRequest.url || 'http://0.0.0.0', nodeRequest as unknown as RequestInit)
  const env = readNodeEnv<BoundAliases>()
  const event = new IsomorphicFetchEvent('fetch', { request, originalURL: request.url, env })

  const response = await router.fetch(request, env, event)

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

  await event.flushTasks()
}
