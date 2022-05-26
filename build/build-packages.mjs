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

import esbuild from 'esbuild'
import FastGlob from 'fast-glob'
import path from 'path'
import { cleanBuild } from './utils/clean.mjs'
import { getPackage, getPackageDependencies, packagesDirectory, packagesList, projectRoot } from './utils/packages.mjs'

const env = process.env.NODE_ENV || 'development'
const watch = process.argv.some((arg) => arg === '--watch')

/**
 * Common build options for all packages
 * @type {esbuild.BuildOptions}
 */
const buildOptionsBase = {
  platform: 'node',
  target: 'esnext',
  treeShaking: true,
  minify: env === 'production',
  sourcemap: true,
  sourcesContent: false,
  // Mark root package's dependencies as external, include root devDependencies
  // (e.g. test runner) as we don't want these bundled
  external: [
    ...getPackageDependencies(await getPackage(projectRoot), true),
    // Make sure we're not bundling any packages we're building, we want to
    // test against the actual code we'll publish for instance
    'keywork',
    '@keywork/*',
    // Make sure all Jest packages aren't bundled
    '@jest/*',
    'jest*',
    // Mark sites manifest as external, it's added by SitesPlugin
    '__STATIC_CONTENT_MANIFEST',
  ],
  logLevel: watch ? 'info' : 'warning',
  watch,
}

const distDirName = 'dist'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typescriptExtPattern = /\.m[tj]s$/

/**
 * Builds a package and its tests stored in packages/<name>/
 * @param {string} packageName
 * @returns {Promise<void>}
 */
async function buildPackage(packageName) {
  const packageRoot = path.join(packagesDirectory, packageName)
  // const pkg = await getPackage(pkgRoot)
  const sourcePath = path.join(packageRoot, 'src')

  const entryPoints = await FastGlob(path.join(sourcePath, '**/*.{ts,mts,tsx,cts}'))
  const outPath = path.join(packageRoot, distDirName)

  console.log('Building', packageRoot)
  await esbuild.build({
    ...buildOptionsBase,
    outbase: sourcePath,
    format: 'esm',
    entryPoints,
    external: undefined,
    outdir: path.join(outPath),
  })
}

// Clear previous builds.
await Promise.all(
  packagesList.map((packageName) => {
    const packageRoot = path.join(packagesDirectory, packageName)
    const outPath = path.join(packageRoot, distDirName)

    return cleanBuild(outPath)
  })
)

// Bundle all packages
await Promise.all(packagesList.map((pkgName) => buildPackage(pkgName)))
