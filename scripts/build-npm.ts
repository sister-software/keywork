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

import { build, emptyDir } from 'dnt'
import { PackageJsonObject } from 'dnt/types'
import * as path from 'path'
import { packagesDirectory, projectPath } from '../paths.ts'

export async function getPackage(packageName: string) {
  console.log(`Preparing package: ${packageName}`)

  const packageDir = path.join(packagesDirectory, packageName)
  const outDir = path.join(packageDir, 'out')
  const distDir = path.join(packageDir, 'dist')

  const packageJSONContents = await Deno.readTextFile(path.join(packageDir, 'package.json'))
  const packageJSON = JSON.parse(packageJSONContents) as PackageJsonObject

  return {
    packageName,
    packageDir,
    outDir,
    distDir,
    packageJSON,
  }
}

async function preparePackage(packageName: string) {
  const { packageDir, distDir, packageJSON } = await getPackage(packageName)

  console.log('>>>', packageJSON)
  await emptyDir(distDir)

  await build({
    test: false,
    entryPoints: [
      path.join(packageDir, 'lib', 'utilities', 'index.ts'),
      path.join(packageDir, 'lib', 'routing', 'index.ts'),
    ],
    outDir: distDir,
    packageManager: 'yarn',
    importMap: projectPath('import_map.json'),
    shims: {
      // see JS docs for overview and more options
      deno: true,
      custom: [
        {
          module: path.join(packageDir, 'lib', 'shims', 'request.ts'),
          globalNames: ['Request', 'Response'],
        },
      ],
    },
    package: packageJSON,
  })

  Deno.copyFileSync('LICENSE', path.join(distDir, 'LICENSE'))
  Deno.copyFileSync('README.md', path.join(distDir, 'README.md'))
}

preparePackage('keywork')
