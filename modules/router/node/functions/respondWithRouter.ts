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

import HTTP from '../../../__internal/http.ts'

import { IncomingMessage, ServerResponse } from 'http'
import { IsomorphicFetchEvent } from '../../../events/mod.ts'
import { readGlobalScope } from '../../../__internal/functions/readGlobalScope.ts'
import { KeyworkRouter } from '../../classes/KeyworkRouter.ts'

/** @internal */
export type ProcessChunkCallback = (chunkResult: ReadableStreamDefaultReadResult<Uint8Array>) => Promise<void>

function readNodeEnv<BoundAliases = {}>(): BoundAliases {
  const globalScope = readGlobalScope()

  return (globalScope as any).process?.env || null
}

/**
 * Given a `KeyworkRouter`, responds to an incoming request from a Node server.
 *
 * ```ts
 * import * as http from 'node:http'
 * import { KeyworkRouter } from 'keywork/router'
 * import { respondWithRouter } from 'keywork/router/node'
 *
 * const router = new KeyworkRouter()
 * http.createServer((req, res) => {
 *   respondWithRouter(router, req, res)
 * })
 * ```
 * @see {createServerHandler}
 * @beta Node support is currently experimental and may change in the near future.
 */
export async function respondWithRouter<BoundAliases = {}>(
  router: KeyworkRouter<BoundAliases>,
  nodeRequest: IncomingMessage,
  nodeResponse: ServerResponse
): Promise<void> {
  const request = new HTTP.Request(nodeRequest.url || 'http://0.0.0.0', nodeRequest as unknown as RequestInit)
  const env = readNodeEnv<BoundAliases>()
  const event = new IsomorphicFetchEvent({ request, env })

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
