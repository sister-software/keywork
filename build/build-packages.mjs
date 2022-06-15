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

import path from 'path'
import { packagesDirectory } from '../paths.mjs'
import { cleanBuild } from './utils/clean.mjs'
import { buildTypeScript, formatBuild } from './utils/extractor/index.mjs'
import { packagesList } from './utils/packages.mjs'
// const env = process.env.NODE_ENV || 'development'
// const watch = process.argv.some((arg) => arg === '--watch')

const distDirName = 'dist'
// Clear previous builds.
await Promise.all(
  packagesList.map((packageName) => {
    const packageRoot = path.join(packagesDirectory, packageName)
    const outPath = path.join(packageRoot, distDirName)

    return cleanBuild(outPath)
  })
)

console.log(`Building ${packagesList.length} packages...`)
// await Promise.all(packagesList.map((pkgName) => buildPackage(pkgName)))

await buildTypeScript()
// await runAPIExtractor()
await formatBuild()
