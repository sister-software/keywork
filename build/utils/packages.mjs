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
import path from 'path'
import { packagesDirectory, projectPath } from '../../paths.mjs'
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
  const relativeEntryPoints = []

  if (typeof packageJSON.exports === 'string') {
    relativeEntryPoints.push(packageJSON.exports)
  } else if (typeof packageJSON.exports === 'object') {
    for (const relativeExportPath of Object.values(packageJSON.exports)) {
      if (!relativeExportPath.endsWith('.js')) continue
      relativeEntryPoints.push(relativeExportPath)
    }
  } else if (packageJSON.main) {
    relativeEntryPoints.push(packageJSON.main)
  }

  const absoluteEntryPoints = relativeEntryPoints.map((relativeEntryPoint) => {
    return path.resolve(packagePath, relativeEntryPoint)
  })

  return absoluteEntryPoints
}

export const allPackageEntryPoints = await Promise.all(
  packagesList.map(async (packageName) => {
    const packagePath = path.join(packagesDirectory, packageName)
    const entryPoints = await readPackageEntryPoints(packagePath)
    const outputPath = path.resolve(packagePath, 'dist', 'lib')

    // console.log('RAW', entryPoints)
    return entryPoints.map((entryPoint) => {
      const relativePath = path.resolve(
        outputPath,
        path.relative(entryPoint, outputPath),
        'lib',
        path.relative(outputPath, entryPoint)
      )

      return path.join(path.dirname(relativePath), 'index.ts')
    })
    // return path.join(packagesDirectory, packageName, 'index.ts')
  })
).then(($) => $.flat())
