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

import FastGlob from 'fast-glob'
import fs from 'fs/promises'
import path from 'path'
import { changeExtension, projectPath } from '../../paths-legacy.mjs'
import { ProjectFiles } from '../../scripts/utilities/files.mjs'

const outDir = projectPath('dist')

export async function readPackageEntryPoints() {
  const packageJSON = JSON.parse(await fs.readFile(path.join(outDir, 'package.json'), 'utf8'))
  const absoluteEntryPoints = new Set()

  if (typeof packageJSON.exports === 'string') {
    absoluteEntryPoints.add(packageJSON.exports)
  } else if (typeof packageJSON.exports === 'object') {
    for (const relativeExportPath of Object.values(packageJSON.exports)) {
      if (relativeExportPath.import.endsWith('.json')) continue
      const absolutePath = path.resolve(outDir, relativeExportPath.import)
      absoluteEntryPoints.add(absolutePath)
    }
  } else if (packageJSON.main) {
    absoluteEntryPoints.add(packageJSON.main)
  }

  return Array.from(absoluteEntryPoints)
}

export async function readAllPackageEntryPoints() {
  const entryPoints = await readPackageEntryPoints()
  const sourceMapPaths = entryPoints.map((entryPoint) => {
    return changeExtension(entryPoint, '.js.map')
  })

  return Promise.all(
    sourceMapPaths.map(async (sourceMapPath) => {
      const content = await fs.readFile(sourceMapPath, 'utf8')
      const sourceMap = JSON.parse(content)
      const [relativePath] = sourceMap.sources

      const partialPath = path.resolve(path.dirname(sourceMapPath), relativePath)
      // return partialPath
      return changeExtension(partialPath, '.d.ts')
      // return partialPath.replace(outDir, projectPath())
    })
  )
}
