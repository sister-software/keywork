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
import { createReadStream } from 'fs'
import { readdir, writeFile } from 'fs/promises'
import path from 'path'
import { createInterface } from 'readline'
import { cleanBuild } from './clean.mjs'
import { getPackage, packagesDirectory, packagesList, projectRoot } from './packages.mjs'

ExtractorConfig._declarationFileExtensionRegExp = /\.d\.m?ts$/i
// eslint-disable-next-line @typescript-eslint/no-empty-function
Extractor._checkCompilerCompatibility = () => {}

// @ts-check

const extractorBaseOutputDir = path.join(projectRoot, 'temp')
const extractorTypesOutputDir = path.join(extractorBaseOutputDir, 'types')
const docsOutputDir = path.join(projectRoot, 'site', 'docs', 'api')

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

const createAPIJSONFilePath = (packageName) =>
  path.join(extractorTypesOutputDir, packageName, `${packageName}.api.json`)

/** @type {import('@microsoft/api-extractor').IConfigFile} */
const configObject = {
  projectFolder: '<lookup>',
  mainEntryPointFilePath: '<projectFolder>/packages/<unscopedPackageName>/dist/index.d.ts',
  compiler: { tsconfigFilePath: path.join(projectRoot, 'tsconfig.json') },
  apiReport: {
    enabled: true,
    reportFileName: '<unscopedPackageName>.api.md',
    reportFolder: '<projectFolder>/etc/',
    reportTempFolder: extractorBaseOutputDir,
  },
  docModel: {
    enabled: true,
    // TODO: title case this.
    apiJsonFilePath: createAPIJSONFilePath('<unscopedPackageName>'),
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
export async function runAPIExtractor() {
  console.log(`Extracting types...`)

  await cleanBuild(extractorBaseOutputDir)

  let errorCount = 0
  let warningCount = 0

  for (const packageName of packagesList) {
    console.log(`\n--> Bundling ${packageName}'s types...`)
    const packageRoot = path.join(packagesDirectory, packageName)

    const extractorConfig = ExtractorConfig.prepare({
      projectFolderLookupToken: projectRoot,
      packageJsonFullPath: path.join(packageRoot, 'package.json'),
      packageJson: await getPackage(packageRoot),
      configObjectFullPath: path.join(packageRoot, 'api-extractor.json'),
      configObject,
    })

    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true,
    })

    if (!extractorResult.succeeded) {
      process.exit(1)
    }

    errorCount += extractorResult.errorCount
    warningCount += extractorResult.warningCount
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
}

export async function generateDocs() {
  for (const packageName of packagesList) {
    await generatePackageDocs(packageName)
  }
}

const EMPTY_COMMENT = '<!-- -->'

async function generatePackageDocs(packageName) {
  console.log(`Generating docs...`)

  const packageDocInputDir = path.dirname(createAPIJSONFilePath(packageName))
  const packageDocOutputDir = path.join(docsOutputDir, packageName)

  await new Promise((resolve, reject) =>
    exec(`api-documenter markdown -i ${packageDocInputDir} -o ${packageDocOutputDir}`, (err, stdout, stderr) => {
      console.log(stdout)
      console.error(stderr)
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  )

  console.log(`Preparing docs for Docusaurus...`)

  const allDocFiles = await readdir(packageDocOutputDir)
  const docFiles = allDocFiles.filter((docFile) => {
    return path.extname(docFile) === '.md'
  })

  for (const docFile of docFiles) {
    const { name: id } = path.parse(docFile)

    try {
      const docPath = path.join(packageDocOutputDir, docFile)
      const input = createReadStream(docPath)
      const output = []
      const lines = createInterface({
        input,
        crlfDelay: Infinity,
      })

      let title = ''
      lines.on('line', (line) => {
        let skip = false
        if (!title) {
          const titleLine = line.match(/## (.*)/)
          if (titleLine) {
            title = titleLine[1]
          }
        }
        const homeLink = line.match(/\[Home\]\(.\/index\.md\) &gt; (.*)/)
        if (homeLink) {
          // Skip the breadcrumb for the toplevel index file.
          if (id !== 'keywork') {
            output.push(homeLink[1])
          }
          skip = true
        }

        // See issue #4. api-documenter expects \| to escape table
        // column delimiters, but docusaurus uses a markdown processor
        // that doesn't support this. Replace with an escape sequence
        // that renders |.
        if (line.startsWith('|')) {
          line = line.replace(/\\\|/g, '&#124;')
        }

        if (line.includes(EMPTY_COMMENT)) {
          line = line.replaceAll(EMPTY_COMMENT, '')
        }

        if (!skip) {
          output.push(line)
        }
      })

      await new Promise((resolve) => lines.once('close', resolve))
      input.close()

      const header = ['---', `id: ${id}`, `title: ${title}`, `hide_title: true`, '---']

      await writeFile(docPath, header.concat(output).join('\n'))
    } catch (err) {
      console.error(`Could not process ${docFile}: ${err}`)
    }
  }
}
