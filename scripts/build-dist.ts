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
import * as compilerTransforms from 'deno/dnt/compiler_transforms'
import { createProjectSync, ts } from 'deno/dnt/deps'
import { getPackageJson } from 'deno/dnt/package_json'
import { ShimOptions, shimOptionsToTransformShims } from 'deno/dnt/shims'
import { transform, TransformOutput } from 'deno/dnt/transform'
import { runNpmCommand } from 'deno/dnt/utils'

import { copy } from 'deno/fs'
import * as path from 'deno/path'
import { projectPath } from '../paths.ts'
import { ProjectFiles } from './utilities/files.mjs'

import { PrefixedLogger } from 'keywork/utilities'
import { extractEntrypoints, ImportMap, NPMPackageJSON } from './utilities/imports.ts'
import { formatFiles } from './utilities/formatting.ts'
const logger = new PrefixedLogger('Build')

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
const outDir = projectPath(ProjectFiles.OutDirectory)

const tsConfigSrcPath = projectPath(ProjectFiles.TSConfig)
const tsConfigDestPath = path.join(outDir, ProjectFiles.TSConfig)

const importMapPath = projectPath(ProjectFiles.ImportMap)
const importMap = JSON.parse(Deno.readTextFileSync(importMapPath)) as ImportMap

const { entryPoints, packageExports } = extractEntrypoints(packageJSON.name, importMap)
const packageExportNames = Object.keys(packageExports)

const shimOptions: ShimOptions = {
  deno: {
    test: false,
  },
}

function copyStaticFiles() {
  const files = new Map<string, string>([
    [tsConfigSrcPath, tsConfigDestPath],
    [projectPath('types'), path.join(outDir, 'types')],
    [ProjectFiles.License, path.join(outDir, ProjectFiles.License)],
    [ProjectFiles.Readme, path.join(outDir, ProjectFiles.Readme)],
    ['.eslintignore', path.join(outDir, '.eslintignore')],
  ])
  logger.log(`Copying ${files.size} files`)

  return Promise.all(
    Array.from(files.entries(), ([src, dest]) => {
      logger.log(src)
      return copy(src, dest, { overwrite: true })
    })
  )
}

async function createTransformer() {
  logger.log('Preparing TypeScript transformer...')

  const { shims, testShims } = shimOptionsToTransformShims(shimOptions)

  const transformOutput = await transform({
    entryPoints: entryPoints.map((e) => e.path),
    testShims,
    shims,
    mappings: {
      'https://cdn.skypack.dev/ulidx?dts': {
        name: 'ulidx',
        version: '^0.3.0',
      },
    },
    target: 'Latest',
    importMap: importMapPath,
  })

  // We remove the entrypoints since `getPackageJson`
  // enforces a strict directory structure...
  transformOutput.main.entryPoints = []
  transformOutput.test.entryPoints = []

  return transformOutput
}

function generatePackageJSON(transformOutput: TransformOutput) {
  logger.log('Generating package.json...')

  const transformedPackageJSON = getPackageJson({
    package: {
      ...packageJSON,
      // Ensures order of outputted JSON.
      dependencies: {},
      devDependencies: packageJSON.devDependencies,
      workspaces: undefined,
      private: undefined,
      exports: {
        ...packageJSON.exports,
        ...packageExports,
      },
    },
    transformOutput,
    entryPoints: [],
    testEnabled: false,
    includeEsModule: true,
    includeScriptModule: false,
    includeDeclarations: true,
    includeTsLib: false,
    shims: shimOptions,
  }) as unknown as NPMPackageJSON

  // Remove duplicate peer deps from  dependencies...
  for (const packageName of Object.keys(transformedPackageJSON.peerDependencies)) {
    if (packageName in transformedPackageJSON.dependencies) {
      transformedPackageJSON.dependencies[packageName] = undefined as any
    }
  }

  logger.log('Writing package.json...')
  writeFile(path.join(outDir, 'package.json'), JSON.stringify(transformedPackageJSON, undefined, 2))
}

//#endregion

function build(transformOutput: TransformOutput) {
  const project = createProjectSync({
    tsConfigFilePath: tsConfigSrcPath,
    skipAddingFilesFromTsConfig: true,
  })

  const sourceFiles = [...transformOutput.main.files, ...transformOutput.test.files]
  logger.log(`Adding ${sourceFiles.length} source files...`)

  for (const outputFile of sourceFiles) {
    const outputFilePath = path.join(outDir, outputFile.filePath)

    project.createSourceFile(outputFilePath, outputFile.fileText)
  }

  logger.log(`Sanitizing source files...`)
  for (const sourceFile of project.getSourceFiles()) {
    // Remove any source files TypeScript may have automatically included from current node_modules.
    if (!sourceFile.fileName.startsWith(outDir)) {
      project.removeSourceFile(sourceFile)
    }
  }

  const program = project.createProgram()

  logger.log('Emitting project files...')
  const emitResult = program.emit(
    undefined,
    (filePath, data, writeByteOrderMark) => {
      if (writeByteOrderMark) {
        data = '\uFEFF' + data
      }

      writeFile(filePath, data)
    },
    undefined,
    undefined,
    {
      before: [compilerTransforms.transformImportMeta],
    }
  )

  if (emitResult.diagnostics.length > 0) {
    outputDiagnostics(emitResult.diagnostics)
  }
}

// TODO: This needs refining.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _checkTypes() {
  logger.log('Checking Types...')

  const originalDir = Deno.cwd()

  Deno.chdir(outDir)
  const project = createProjectSync({
    tsConfigFilePath: tsConfigDestPath,
  })

  project.compilerOptions.set({
    outDir,
    typeRoots: [path.join(outDir, 'node_modules', '@types')],
    noEmit: true,
  })

  const program = project.createProgram()
  const diagnostics = ts.getPreEmitDiagnostics(program)

  if (diagnostics.length > 0) {
    outputDiagnostics(diagnostics)
  }
  Deno.chdir(originalDir)
}

await Promise.all(
  packageExportNames.map((exportName) => {
    return emptyDir(path.join(outDir, exportName))
  })
)
await copyStaticFiles()
const transformOutput = await createTransformer()

generatePackageJSON(transformOutput)

logger.log('Installing dependencies...')
await runNpmCommand({
  bin: 'yarn',
  args: ['install'],
  cwd: outDir,
})

build(transformOutput)

// Fix for doc parsing...
const tsConfigContents = JSON.parse(Deno.readTextFileSync(tsConfigSrcPath))
Object.assign(tsConfigContents, {
  extends: undefined,
  include: ['./**/*'],
})

Deno.writeTextFileSync(tsConfigDestPath, JSON.stringify(tsConfigContents, null, 2))

await formatFiles(outDir, Object.keys(packageExports))
