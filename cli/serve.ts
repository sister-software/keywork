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

import * as path from 'node:path'
import type { Argv } from 'yargs'
import { KeyworkResourceError, Status } from '../errors/index.js'
import { KeyworkLogger } from '../logging/index.js'
import {
  NodeStaticFileRouter,
  applyNodeKeyworkPolyfills,
  createNodeKeyworkServer,
  projectRootPathBuilder,
} from '../node/index.js'
import { FetcherModuleExports, RequestRouter } from '../router/index.js'
import type { StrictYargsOptionsToInterface } from './yargs.js'

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
  logger.info('CLI Args', serveArgs)

  const absolutePublicDirPath = path.resolve(serveArgs.publicDir)
  const absoluteScriptPath = path.resolve(serveArgs.routerScript)

  const scriptModule: Partial<FetcherModuleExports> = await import(absoluteScriptPath)

  if (!scriptModule || !('default' in scriptModule)) {
    throw new KeyworkResourceError(
      `Router script ${absoluteScriptPath} does not export a valid fetcher.`,
      Status.InternalServerError
    )
  }

  const router = scriptModule.default

  if (!router || !RequestRouter.assertIsInstanceOf(router)) {
    throw new KeyworkResourceError(
      `Router script ${absoluteScriptPath} does not export a valid request router.`,
      Status.InternalServerError
    )
  }

  router.get(
    '/dist/*',
    new NodeStaticFileRouter({
      filesDirectoryPath: projectRootPathBuilder('dist'),
      mountPath: '/dist',
    }).fetchStaticFile
  )

  router.use(
    new NodeStaticFileRouter({
      filesDirectoryPath: absolutePublicDirPath,
    })
  )

  router.$prettyPrintRoutes()

  const server = createNodeKeyworkServer(router)

  logger.info('Starting...')

  server.listen(port, host, () => {
    const serverURL = new URL(`http://${host}:${port}`)
    logger.info(`Listening on ${serverURL}`)
  })
}
