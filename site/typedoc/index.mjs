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

/* eslint-disable @typescript-eslint/no-var-requires */

import docsPlugin from '@docusaurus/plugin-content-docs'
import { createRequire } from 'module'
import * as fs from 'node:fs/promises'
import path from 'path'
import rimraf from 'rimraf'
import { checkFileExists, DocusaurusTypeDoc } from './theme.mjs'
const require = createRequire(import.meta.url)

const validationUtils = require('@docusaurus/utils-validation')

// @ts-check

/**
 * @param {string} dirtyDirectoryPath
 * @returns {Promise<void>}
 */
function cleanBuild(dirtyDirectoryPath) {
  return new Promise((resolve, reject) => {
    console.info('Clearing path...', dirtyDirectoryPath)
    rimraf(dirtyDirectoryPath, (error) => {
      if (error) {
        return reject(error)
      }

      return resolve()
    })
  })
}

let bootstrapped = false

/**
 *
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {import('@docusaurus/types').PluginOptions} opts
 * @returns {import('@docusaurus/types').Plugin}
 */
export async function typeDocPlugin(context, opts) {
  const APIOutputDir = path.join(context.siteDir, 'api')
  const APIOutputDirExists = await checkFileExists(APIOutputDir)

  if (APIOutputDirExists) {
    if (bootstrapped) {
      await cleanBuild(path.join(APIOutputDir, '**', '*'))
    }
  } else {
    await fs.mkdir(APIOutputDir)
  }

  const app = new DocusaurusTypeDoc()

  app.bootstrap(opts.typeDocOptions)

  const project = app.convert()

  if (!project) {
    throw new Error(`TypeDoc could not parse packages`)
  }

  await app.generateDocs(project, APIOutputDir)

  const docsOptions = docsPlugin.validateOptions({
    validate: validationUtils.normalizePluginOptions,
    options:
      /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
      ({
        path: 'api', // Path to data on filesystem, relative to site dir.
        routeBasePath: '/api', // URL Route.
      }),
  })

  const pluginInstance = await docsPlugin.default(context, docsOptions)
  bootstrapped = true
  return pluginInstance
}
