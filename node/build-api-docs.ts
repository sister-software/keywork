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

import fs from 'fs/promises'
import { checkFileExists } from '@keywork/monorepo/common/files'
import { NPMExportEntry, readNPMPackageJSON } from '@keywork/monorepo/common/imports'
import * as ProjectFiles from '@keywork/monorepo/common/project'
import { DocusaurusTypeDoc } from './typedoc.js'
import * as path from 'path'
import TypeDoc from 'typedoc'
import FastGlob from 'fast-glob'

const getDest = (filePath: string) => {
  return path.join(ProjectFiles.APIDocDirectory, filePath.substring(ProjectFiles.LibDirectory.length))
}

function createFileMap(filePaths: string[]): Map<string, string> {
  return new Map<string, string>(
    filePaths.map((filePath) => {
      return [filePath, getDest(filePath)]
    })
  )
}

async function copyModuleDocs() {
  const ignore = [path.join('**', ProjectFiles.NodeModules)]
  const categoryToDest = await FastGlob(path.join(ProjectFiles.LibDirectory, '*', '**', ProjectFiles.Category), {
    ignore,
  }).then(createFileMap)

  const docPathToDest = await FastGlob(path.join(ProjectFiles.LibDirectory, '*', '**', '*.{md,mdx}'), {
    ignore,
  }).then(createFileMap)

  await Promise.all(
    [...categoryToDest.values(), ...docPathToDest.values()].map(async (destPath) => {
      await fs.mkdir(path.dirname(destPath), { recursive: true })
    })
  )

  await Promise.all(
    Array.from(categoryToDest.entries(), async ([filePath, destPath]) => {
      return fs.copyFile(filePath, destPath)
    })
  )

  await Promise.all(
    Array.from(docPathToDest.entries(), async ([filePath, destPath]) => {
      console.log(filePath)
      const exists = await checkFileExists(destPath)

      if (exists) {
        // Likely a module that needs to be merged...
        const currentFileContents = await fs.readFile(destPath, 'utf8')
        const docFileContents = await fs.readFile(filePath, 'utf8')
        await fs.writeFile(destPath, docFileContents)
        await fs.writeFile(destPath, currentFileContents.slice(currentFileContents.indexOf('\n')), { flag: 'a+' })

        return
      }

      return fs.copyFile(filePath, destPath)
    })
  )
}

async function typeDocPlugin(namedExport: string, mapping: NPMExportEntry) {
  const filePath = mapping.import

  const entryPoint = path.join(ProjectFiles.OutDirectory, filePath)
  const outPath = path.join(ProjectFiles.APIDocDirectory, path.dirname(filePath))
  await fs.mkdir(outPath, { recursive: true })

  const app = new DocusaurusTypeDoc()

  app.bootstrap({
    name: namedExport.split('/').pop() || namedExport,
    entryPoints: [entryPoint],
    githubPages: false,
    excludeInternal: true,
    excludeExternals: true,
    hideGenerator: true,
    cleanOutputDir: false,
    entryDocument: 'index.md',
    readme: 'none',
    hideBreadcrumbs: true,
    hideInPageTOC: true,
  })

  const project = app.convert()!
  project.kind = TypeDoc.ReflectionKind.Module

  await app.generateDocs(project, outPath)
}
const packageJSON = await readNPMPackageJSON(path.join(ProjectFiles.OutDirectory, ProjectFiles.PackageJSON))
const modules = Object.entries(packageJSON.exports).filter(([namedExport]) => !namedExport.endsWith('.json'))

const APIOutputDirExists = await checkFileExists(ProjectFiles.APIDocDirectory)

if (APIOutputDirExists) {
  await fs.rm(ProjectFiles.APIDocDirectory, { recursive: true, force: true })
} else {
  await fs.mkdir(ProjectFiles.APIDocDirectory, { recursive: true })
}

for (const [namedExport, exportDeclaration] of modules) {
  await typeDocPlugin(namedExport, exportDeclaration)
}

await copyModuleDocs()
