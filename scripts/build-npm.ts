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

import { build, emptyDir } from 'deno/dnt'
import * as path from 'deno/path'

import { changeExtension, projectPath } from '../paths.ts'
import { ProjectFiles } from '../utilities/files.mjs'
import {
  createRuntimeMappings,
  extractEntrypoints,
  KeyworkRuntime,
  NPMPackageJSON,
  readImportMap,
} from '../utilities/imports.ts'

const packageJSONContents = await Deno.readTextFile(projectPath(ProjectFiles.PackageJSON))
const packageJSON = JSON.parse(packageJSONContents) as NPMPackageJSON

async function preparePackage(runtime: KeyworkRuntime) {
  const distDir = projectPath(ProjectFiles.DistDirectory, runtime)
  const importMap = await readImportMap(runtime)
  const entryPoints = extractEntrypoints(runtime, importMap)

  // Fix for runtime-specific imports.
  const importMapDistPath = projectPath(changeExtension(ProjectFiles.ImportMap, `.${runtime}.json`))
  await Deno.writeTextFile(importMapDistPath, JSON.stringify(importMap, null, 2))

  await emptyDir(distDir)

  await build({
    test: false,
    entryPoints,
    outDir: distDir,
    packageManager: 'yarn',
    importMap: importMapDistPath,
    mappings: {
      ...createRuntimeMappings(
        runtime,
        projectPath('lib', 'react', 'worker', 'mod.ts'),
        projectPath('lib', 'runtime', 'worker', 'mod.ts')
      ),
      [projectPath('lib', 'kv', 'worker', 'mod.ts')]: '@miniflare/kv',
      'https://cdn.skypack.dev/ulidx?dts': {
        name: 'ulidx',
        version: '^0.3.0',
      },
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
      devDependencies: {
        '@miniflare/kv': '^2.5.1',
      },
    },
  })

  Deno.copyFileSync(ProjectFiles.License, path.join(distDir, ProjectFiles.License))
  Deno.copyFileSync(ProjectFiles.Readme, path.join(distDir, ProjectFiles.Readme))
  Deno.copyFileSync('.eslintignore', path.join(distDir, '.eslintignore'))
}

preparePackage('node')
