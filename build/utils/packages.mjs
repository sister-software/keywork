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
import { changeExtension, packagesDirectory, projectPath } from '../../paths.mjs'
import { readJSON } from './files.mjs'
const tsconfig = await readJSON(projectPath('tsconfig.json'))

/** @type string[] Package names */
export const packagesList = tsconfig.references.map((reference) => {
  return path.basename(reference.path)
})

export const scope = '@keywork'

/** @typedef {import('../../packages/keywork/package.json') T_npm_packageJSON } */

/**
 * Gets a list of dependency names from the passed package
 * @param {T_npm_packageJSON} pkg
 * @param {boolean} [includeDev]
 * @returns {Set<string>} packageDependencies
 */
export function getPackageDependencies(pkg, includeDev) {
  return new Set([
    ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
    ...(includeDev && pkg.devDependencies ? Object.keys(pkg.devDependencies) : []),
    ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []),
    ...(pkg.optionalDependencies ? Object.keys(pkg.optionalDependencies) : []),
  ])
}

/**
 * Gets the contents of the package.json file in <packagePath>
 * @param {string} packagePath
 *
 * @returns {Promise<(T_npm_packageJSON>}
 */
export async function readPackageJSON(packagePath) {
  return JSON.parse(await fs.readFile(path.join(packagePath, 'package.json'), 'utf8'))
}

/**
 * @param {string} packagePath
 */
export async function readPackageEntryPoints(packagePath) {
  const packageJSON = await readPackageJSON(packagePath)
  const absoluteEntryPoints = new Set()

  if (typeof packageJSON.exports === 'string') {
    absoluteEntryPoints.add(packageJSON.exports)
  } else if (typeof packageJSON.exports === 'object') {
    for (const relativeExportPath of Object.values(packageJSON.exports)) {
      if (relativeExportPath.endsWith('.json')) continue
      const absolutePath = path.resolve(packagePath, relativeExportPath)
      const entries = await FastGlob(absolutePath)

      console.log('pattern', absolutePath, entries)
      entries.forEach((entry) => absoluteEntryPoints.add(entry))
    }
  } else if (packageJSON.main) {
    absoluteEntryPoints.add(packageJSON.main)
  }

  return Array.from(absoluteEntryPoints)
}

export function readAllPackageEntryPoints() {
  return Promise.all(
    packagesList.map(async (packageName) => {
      const packagePath = path.join(packagesDirectory, packageName)
      const entryPoints = await readPackageEntryPoints(packagePath)
      const sourceMapPaths = entryPoints.map((entryPoint) => {
        return changeExtension(entryPoint, '.js.map')
      })

      return Promise.all(
        sourceMapPaths.map(async (sourceMapPath) => {
          const content = await fs.readFile(sourceMapPath, 'utf8')
          const sourceMap = JSON.parse(content)
          const [relativePath] = sourceMap.sources

          return path.resolve(sourceMapPath, '..', relativePath)
        })
      )
    })
  ).then(($) => $.flat())
}
