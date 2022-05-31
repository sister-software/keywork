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

import fsExtra from 'fs-extra'
import * as fs from 'fs/promises'
import path from 'path'
import TypeDoc from 'typedoc'
import { cleanBuild } from '../clean.mjs'
import { packagesDirectory, packagesList, projectRoot } from '../packages.mjs'

// @ts-check

const FileNames = {
  Readme: 'README.md',
  Index: 'index.md',
  TypeScriptIndex: 'index.ts',
  Overview: 'overview.md',
  Category: '_category_.json',
  CNAME: 'CNAME',
}

const defaultCategory = {
  collapsible: true,
  position: 1,
}

const docsOutputDir = path.join(projectRoot, 'site', 'docs')
const rootDocsPath = path.join(packagesDirectory, 'docs')
const rootDocsOutputPath = path.join(docsOutputDir, 'overview')

export async function generateDocs() {
  await cleanBuild(docsOutputDir)

  for (const packageName of packagesList) {
    await generatePackageDocs(packageName)
  }

  // TODO: something about async makes TypeDoc blow up.
  // await Promise.all(
  //   packagesList.map((packageName) => {
  //     return generatePackageDocs(packageName)
  //   })
  // )

  fsExtra.copy(rootDocsPath, rootDocsOutputPath)
}

// This seems to be hardcoded.
const typeDocModulesDirName = 'modules'

/**
 *
 * @param {string} packageName
 */
async function generatePackageDocs(packageName) {
  console.log(`Generating docs for ${packageName}...`)

  const packageRoot = path.join(packagesDirectory, packageName)
  const packageDocOutputDir = path.join(docsOutputDir, packageName)
  const packageDocAPIOutputDir = path.join(packageDocOutputDir, typeDocModulesDirName)

  await fs.mkdir(packageDocAPIOutputDir, { recursive: true })

  const app = new TypeDoc.Application()

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new TypeDoc.TSConfigReader())
  app.options.addReader(new TypeDoc.TypeDocReader())

  app.bootstrap({
    // typedoc options here
    entryPoints: [path.join(packageRoot, FileNames.TypeScriptIndex)],
    out: packageDocAPIOutputDir,
    plugin: 'typedoc-plugin-markdown',
    cname: false,
    githubPages: false,
    excludeInternal: true,
    hideGenerator: true,
    hideBreadcrumbs: true,
    // hidePageTitle: true,
  })

  const project = app.convert()

  if (!project) {
    throw new Error(`TypeDoc could not parse ${packageName}`)
  }

  await app.generateDocs(project, packageDocAPIOutputDir)

  const packageDocsPath = path.join(packageRoot, 'docs')
  fsExtra.copy(packageDocsPath, packageDocOutputDir)

  await fs.writeFile(
    path.join(packageDocAPIOutputDir, FileNames.Category),
    JSON.stringify(
      {
        ...defaultCategory,
        label: 'API',
      },
      null,
      2
    )
  )

  const omittedFiles = [
    path.join(packageDocAPIOutputDir, FileNames.Readme),
    path.join(packageDocAPIOutputDir, FileNames.CNAME),
  ]

  // Fixes issues surrounding indexing.
  await Promise.all(
    omittedFiles.map((filePath) => {
      return fs.rm(filePath)
    })
  )
}
