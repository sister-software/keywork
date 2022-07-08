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

import { build, emptyDir } from 'deno:dnt'
import { PackageJsonObject } from 'deno:dnt/types'
import * as path from 'deno:path'

import { projectPath } from '../paths.ts'
import { ProjectFiles } from '../utilities/files.mjs'

const distDir = projectPath(ProjectFiles.NodeDistDirectory)
const packageJSONContents = await Deno.readTextFile(projectPath(ProjectFiles.PackageJSON))
const packageJSON = JSON.parse(packageJSONContents) as PackageJsonObject

async function preparePackage() {
  await emptyDir(distDir)

  await build({
    test: false,
    entryPoints: [
      //
      projectPath('lib', 'utilities', 'index.ts'),
      projectPath('lib', 'routing', 'index.ts'),
    ],
    outDir: distDir,
    packageManager: 'yarn',
    importMap: projectPath('import_map.json'),
    mappings: {
      [projectPath('lib', 'react', 'worker', 'stream', 'render.deno.ts')]: projectPath(
        'lib',
        'react',
        'worker',
        'stream',
        'render.node.ts'
      ),
    },
    shims: {
      deno: true,
      undici: true,
      custom: [
        {
          module: 'node:stream/web',
          globalNames: ['TransformStream', 'ReadableStream'],
        },
      ],
    },
    compilerOptions: {
      target: 'ES2021',
      lib: ['es2021', 'esnext', 'dom', 'dom.iterable'],
    },
    package: {
      ...packageJSON,
      devDependencies: {},
    },
  })

  // await formatFiles(path.join(distDir, 'esm'))

  Deno.copyFileSync(ProjectFiles.License, path.join(distDir, ProjectFiles.License))
  Deno.copyFileSync(ProjectFiles.Readme, path.join(distDir, ProjectFiles.Readme))
}

preparePackage()
