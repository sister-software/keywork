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

import { emptyDir } from 'deno/dnt'
import { outputDiagnostics } from 'deno/dnt/compiler'
import { createProjectSync, ts } from 'deno/dnt/deps'
import { copy } from 'deno/fs'
import * as path from 'deno/path'
import { getPackageJson } from 'https://deno.land/x/dnt@0.28.0/lib/package_json.ts'
import { ShimOptions, shimOptionsToTransformShims } from 'https://deno.land/x/dnt@0.28.0/lib/shims.ts'
import { runNpmCommand } from 'https://deno.land/x/dnt@0.28.0/lib/utils.ts'
import { transform } from 'https://deno.land/x/dnt@0.28.0/transform.ts'
import { projectPath } from '../paths.ts'
import { ProjectFiles } from '../utilities/files.mjs'
import { extractEntrypoints, ImportMap, NPMPackageJSON } from '../utilities/imports.ts'

const createdDirectories = new Set<string>()
function writeFile(filePath: string, fileText: string) {
  const dir = path.dirname(filePath)

  if (!createdDirectories.has(dir)) {
    Deno.mkdirSync(dir, { recursive: true })
    createdDirectories.add(dir)
  }

  Deno.writeTextFileSync(filePath, fileText)
}

const packageJSONContents = await Deno.readTextFile(projectPath(ProjectFiles.PackageJSON))
const packageJSON = JSON.parse(packageJSONContents) as NPMPackageJSON
const distDir = projectPath(ProjectFiles.DistDirectory)

const runtime = 'node'

const importMapPath = projectPath(ProjectFiles.ImportMap)
const importMap = JSON.parse(Deno.readTextFileSync(importMapPath)) as ImportMap

const entryPoints = extractEntrypoints(runtime, importMap)

const files = new Map<string, string>([
  [projectPath('lib', 'types'), path.join(distDir, 'lib', 'types')],
  [ProjectFiles.TSConfig, path.join(distDir, ProjectFiles.TSConfig)],
  [ProjectFiles.License, path.join(distDir, ProjectFiles.License)],
  [ProjectFiles.Readme, path.join(distDir, ProjectFiles.Readme)],
  ['.eslintignore', path.join(distDir, '.eslintignore')],
])

const tsconfigPath = projectPath(ProjectFiles.TSConfig)
const result = ts.parseConfigFileTextToJson(tsconfigPath, Deno.readTextFileSync(tsconfigPath))

const project = createProjectSync({
  compilerOptions: result.config.compilerOptions,
})

const program = project.createProgram()

// Install dependencies in order to prepare for checking TS diagnostics
function installDeps() {
  console.log(`Running yarn install...`)

  return runNpmCommand({
    bin: 'yarn',
    args: ['install'],
    cwd: distDir,
  })
}

async function prepare() {
  const shimOptions: ShimOptions = { deno: true }

  const transformOutput = await transform({
    entryPoints: entryPoints.map((e) => e.path),
    testShims: [],
    shims: shimOptionsToTransformShims(shimOptions).shims,
    mappings: {
      // ...createRuntimeMappings(runtime, projectPath('lib', 'react', 'worker', 'mod.ts')),
      // [projectPath('lib', 'kv', 'worker', 'mod.ts')]: '@miniflare/kv',
      // 'https://cdn.skypack.dev/ulidx?dts': {
      //   name: 'ulidx',
      //   version: '^0.3.0',
      // },
    },
    target: 'Latest',
    importMap: importMapPath,
  })

  for (const outputFile of transformOutput.main.files) {
    console.log(outputFile)

    const outputFilePath = path.join(distDir, 'lib', outputFile.filePath)

    project.createSourceFile(outputFilePath, outputFile.fileText)
  }

  const packageJsonObj = getPackageJson({
    entryPoints,
    transformOutput,
    package: {
      ...packageJSON,
      devDependencies: {
        '@miniflare/kv': '^2.5.1',
      },
    },
    testEnabled: false,
    includeEsModule: true,
    includeScriptModule: false,
    includeDeclarations: true,
    includeTsLib: false,
    shims: shimOptions,
  })

  writeFile(path.join(distDir, 'package.json'), JSON.stringify(packageJsonObj, undefined, 2))

  await Promise.all(
    Array.from(files.entries(), ([src, dest]) => {
      return copy(src, dest)
    })
  )
}

console.log('Building project...')

function emitBuild() {
  const emitResult = program.emit(undefined, (filePath, data, writeByteOrderMark) => {
    if (writeByteOrderMark) {
      data = '\uFEFF' + data
    }

    writeFile(filePath, data)
  })

  if (emitResult.diagnostics.length > 0) {
    outputDiagnostics(emitResult.diagnostics)
    throw new Error(`Had ${emitResult.diagnostics.length} emit diagnostics.`)
  }
}

function typeCheck() {
  console.log('Type checking...')
  const diagnostics = ts.getPreEmitDiagnostics(program)

  if (diagnostics.length > 0) {
    outputDiagnostics(diagnostics)
    throw new Error(`Had ${diagnostics.length} diagnostics.`)
  }
}

if (!Date.now) {
  await emptyDir(distDir)
}
await prepare()
await installDeps()
emitBuild()
// typeCheck()
