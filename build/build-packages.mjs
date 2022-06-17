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

/* eslint-disable tsdoc/syntax */

import fs from 'node:fs/promises'
import path from 'node:path'
import { packagesDirectory } from '../paths.mjs'
import { cleanBuild } from './utils/clean.mjs'
import { buildTypeScript, formatBuild } from './utils/extractor/index.mjs'
import { FileNames } from './utils/files.mjs'
import { packagesList } from './utils/packages.mjs'
// const env = process.env.NODE_ENV || 'development'
// const watch = process.argv.some((arg) => arg === '--watch')

/**
 * @param {string} packageName
 */
export function getPackagePaths(packageName) {
  console.log(`Preparing package: ${packageName}`)

  const packageRoot = path.join(packagesDirectory, packageName)
  const outPath = path.join(packageRoot, FileNames.OutDirectory)
  const distPath = path.join(packageRoot, FileNames.DistDirectory)

  return {
    packageRoot,
    outPath,
    distPath,
  }
}

/**
 * @param {string} packageName
 */
async function preparePackage(packageName) {
  const { packageRoot, outPath, distPath } = getPackagePaths(packageName)

  await fs.rename(path.join(outPath, FileNames.LibDirectory), distPath)
  await fs.copyFile(path.join(packageRoot, FileNames.PackageJSON), path.join(distPath, FileNames.PackageJSON))
}

// Clear previous builds.
await Promise.all(
  packagesList.map((packageName) => {
    const { outPath, distPath } = getPackagePaths(packageName)

    return Promise.all([outPath, distPath].map(($) => cleanBuild($)))
  })
)

console.log(`Building ${packagesList.length} package(s)...`)

await buildTypeScript()
await Promise.all(packagesList.map((packageName) => preparePackage(packageName)))

await formatBuild()
