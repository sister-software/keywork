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

import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import { exec } from 'child_process'
import path from 'path'
import { getPackage, packagesDirectory, projectRoot } from '../packages.mjs'

ExtractorConfig._declarationFileExtensionRegExp = /\.d\.m?ts$/i
// eslint-disable-next-line @typescript-eslint/no-empty-function
Extractor._checkCompilerCompatibility = () => {}

// @ts-check

export function generateTypes() {
  console.log(`Generating types...`)

  return new Promise((resolve, reject) =>
    exec(`tsc -b`, (err, stdout, stderr) => {
      console.log(stdout)
      console.error(stderr)
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  )
}

/** @type {import('@microsoft/api-extractor').IConfigFile} */
const configObject = {
  projectFolder: '<lookup>',
  mainEntryPointFilePath: '<projectFolder>/packages/<unscopedPackageName>/dist/index.d.ts',
  compiler: { tsconfigFilePath: path.join(projectRoot, 'tsconfig.json') },
  apiReport: {
    enabled: true,
    reportFileName: '<unscopedPackageName>.api.md',
    reportFolder: '<projectFolder>/api-extractor/etc',
    reportTempFolder: '<projectFolder>/api-extractor/temp',
  },
  docModel: {
    enabled: true,
    apiJsonFilePath: '<projectFolder>/api-extractor/temp/<unscopedPackageName>/<unscopedPackageName>.api.json',
  },
  dtsRollup: {
    enabled: true,
    untrimmedFilePath: '',
    betaTrimmedFilePath: '',
    publicTrimmedFilePath: '<projectFolder>/packages/<unscopedPackageName>/dist/index.d.ts',
    omitTrimmingComments: false,
  },
  tsdocMetadata: {
    enabled: false,
    tsdocMetadataFilePath: '<lookup>',
  },
  messages: {
    compilerMessageReporting: {
      default: { logLevel: 'warning' },
      TS2687: { logLevel: 'none' },
      TS2430: { logLevel: 'none' },
      TS2717: { logLevel: 'none' },
      TS2315: { logLevel: 'none' },
      TS6200: { logLevel: 'none' },
      TS2508: { logLevel: 'none' },
      TS2344: { logLevel: 'none' },
      TS1259: { logLevel: 'none' },
    },
    extractorMessageReporting: {
      default: { logLevel: 'warning' },
      'ae-missing-release-tag': { logLevel: 'none' },
    },
  },
}
/**
 * Creates a prepared API extractor config.
 * @param {string} packageName
 */
export async function createExtractorConfig(packageName) {
  const packageRoot = path.join(packagesDirectory, packageName)

  const extractorConfig = ExtractorConfig.prepare({
    projectFolderLookupToken: projectRoot,
    packageJsonFullPath: path.join(packageRoot, 'package.json'),
    packageJson: await getPackage(packageRoot),
    configObjectFullPath: path.join(packageRoot, 'api-extractor.json'),
    configObject,
  })

  return extractorConfig
}
