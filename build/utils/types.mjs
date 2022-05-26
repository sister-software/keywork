/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remark Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import path from 'path'
import { getPackage, packagesDirectory, packagesList, projectRoot } from './packages.mjs'

ExtractorConfig._declarationFileExtensionRegExp = /\.d\.m?ts$/i
// eslint-disable-next-line @typescript-eslint/no-empty-function
Extractor._checkCompilerCompatibility = () => {}

// TODO: consider using more of api-extractor, it's got lots of nifty features
//  (automatic API docs in package READMEs?)

/** @type {import('@microsoft/api-extractor').IConfigFile} */
const extractorCfgObject = {
  projectFolder: '<lookup>',
  mainEntryPointFilePath: '<projectFolder>/packages/<unscopedPackageName>/dist/_types/src/index.d.ts',
  compiler: { tsconfigFilePath: path.join(projectRoot, 'tsconfig.json') },
  apiReport: {
    enabled: false,
    reportFileName: '<unscopedPackageName>.api.md',
    reportFolder: '<projectFolder>/etc/',
    reportTempFolder: '<projectFolder>/temp/',
  },
  docModel: {
    enabled: true,
    apiJsonFilePath: '<projectFolder>/.tmp/types/<unscopedPackageName>.api.json',
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
 * Bundle types for each package into single .d.ts files and run other checks
 * on definitions (e.g. forgotten exports). Requires `tsc` be run in the root
 * of the repository before running this script.
 * @returns {Promise<void>}
 */
async function buildTypes() {
  let errorCount = 0
  let warningCount = 0
  for (const name of packagesList) {
    console.log(`\n--> Bundling ${name}'s types...`)
    const pkgRoot = path.join(packagesDirectory, name)

    const extractorCfg = ExtractorConfig.prepare({
      projectFolderLookupToken: projectRoot,
      packageJsonFullPath: path.join(pkgRoot, 'package.json'),
      packageJson: await getPackage(pkgRoot),
      configObjectFullPath: path.join(pkgRoot, 'api-extractor.json'),
      configObject: extractorCfgObject,
    })

    const extractorRes = Extractor.invoke(extractorCfg, {
      localBuild: true,
      showVerboseMessages: true,
    })
    errorCount += extractorRes.errorCount
    warningCount += extractorRes.warningCount
  }
  const failed = errorCount + warningCount > 0
  const colour = failed ? 31 : 32

  console.log(
    [
      `\n\x1b[${colour}mBundled all types `,
      `with ${errorCount} error(s) and ${warningCount} warning(s)`,
      '\x1b[39m',
    ].join('')
  )
  // if (failed) process.exit(1)
}

// Bundle all packages' types
await buildTypes()
