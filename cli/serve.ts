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

import type { StrictYargsOptionsToInterface } from 'keywork/cli/yargs'
import { KeyworkResourceError, Status } from 'keywork/errors'
import { NodeStaticFileRouter, createNodeServerHandler, projectRootPathBuilder } from 'keywork/node'
import { applyNodeKeyworkPolyfills } from 'keywork/node/polyfills'
import { FetcherModuleExports, RequestRouter } from 'keywork/router'
import { KeyworkLogger } from 'keywork/utils'
import * as http from 'node:http'
import { Socket } from 'node:net'
import * as path from 'node:path'
import type { Argv } from 'yargs'

await applyNodeKeyworkPolyfills()

/**
 * Yargs command for creating a Keywork local development server.
 */
export function serveCommand(yargs: Argv) {
  return yargs
    .option('routerScript', {
      alias: 's',
      type: 'string',
      default: '_worker.js',
      description: "Path to the file containing a Keywork router's entrypoint.",
    })
    .option('port', {
      alias: 'p',
      type: 'number',
      description: 'The port to listen on.',
      default: 3000,
    })
    .default('port', 3000)
    .option('host', {
      alias: 'h',
      type: 'string',
      description: 'The host to listen on.',
      default: 'localhost',
    })
    .positional('publicDir', {
      type: 'string',
      description: 'The directory of public files to be served alongside the router.',
      demandOption: true,
    })
}
export type ServeArgs = StrictYargsOptionsToInterface<typeof serveCommand>

/**
 * Yargs command for building a Keywork local development server.
 */
export async function serveBuilder({ port, host, ...serveArgs }: ServeArgs) {
  const logger = new KeyworkLogger('Keywork Server')
  logger.info('>>>>', serveArgs)

  const absolutePublicDirPath = path.resolve(serveArgs.publicDir)
  const absoluteScriptPath = path.resolve(serveArgs.routerScript)

  const scriptModule: Partial<FetcherModuleExports> = await import(absoluteScriptPath)

  if (!scriptModule || !('default' in scriptModule)) {
    throw new KeyworkResourceError(
      `Router script ${absoluteScriptPath} does not export a valid fetcher.`,
      Status.InternalServerError
    )
  }

  const fetcher = scriptModule.default

  if (!fetcher || !RequestRouter.assertIsInstanceOf(fetcher)) {
    throw new KeyworkResourceError(
      `Router script ${absoluteScriptPath} does not export a valid request router.`,
      Status.InternalServerError
    )
  }

  fetcher.get(
    '/dist/*',
    new NodeStaticFileRouter({
      filesDirectoryPath: projectRootPathBuilder('dist'),
      mountPath: 'dist',
    }).fetchStaticFile
  )

  // fetcher.use(
  //   new NodeStaticFileRouter({
  //     filesDirectoryPath: absolutePublicDirPath,
  //   })
  // )

  // And then wrap the router with `createServerHandler`
  const server = http.createServer(createNodeServerHandler(fetcher))

  const connections = new Set<Socket>()
  server.on('connection', (connection) => {
    connections.add(connection)
    connection.on('close', () => connections.delete(connection))
  })

  server.on('close', () => fetcher.dispose('Shutting down...'))

  const onProcessEnd = () => {
    for (const connection of connections) {
      connection.destroy()
    }

    connections.clear()

    server.close(() => process.exit(0))
  }

  process.on('SIGINT', onProcessEnd)
  process.on('SIGTERM', onProcessEnd)

  logger.info('Starting...')

  server.listen(port, host, () => {
    const serverURL = new URL(`http://${host}:${port}`)
    logger.info(`Listening on ${serverURL}`)
  })
}
