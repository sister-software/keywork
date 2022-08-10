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

import { copy } from 'deno/fs/copy'
import { Logger } from './logger/mod.ts'
import * as path from 'path'
import { NPMPackageJSON, readNPMPackageJSON } from '@keywork/monorepo/common/imports'
import { projectPath } from '@keywork/monorepo/common/paths'
import * as ProjectFiles from '@keywork/monorepo/common/project'
import deepmerge from 'https://esm.sh/deepmerge@4.2.2'

const outDir = ProjectFiles.OutDirectory
const filePaths: string[] = []
const logger = new Logger('Build')

const createdDirectories = new Set<string>()
function writeFile(filePath: string, fileText: string) {
  const dir = path.dirname(filePath)

  if (!createdDirectories.has(dir)) {
    Deno.mkdirSync(dir, { recursive: true })
    createdDirectories.add(dir)
  }

  Deno.writeTextFileSync(filePath, fileText)
}

const packageJSON = await readNPMPackageJSON(path.join(ProjectFiles.ModulesDirectory, ProjectFiles.PackageJSON))
const tsConfigSrcPath = path.join(ProjectFiles.ModulesDirectory, ProjectFiles.TSConfig)

const importMapPath = ProjectFiles.ImportMap

const shimOptions: ShimOptions = {
  deno: {
    test: false,
  },
}

function copyStaticFiles() {
  const files = new Map<string, string>([
    [path.join(ProjectFiles.ModulesDirectory, 'types'), path.join(outDir, 'types')],
    [path.join(ProjectFiles.ModulesDirectory, ProjectFiles.TSConfig), path.join(outDir, ProjectFiles.TSConfig)],
    [path.join(ProjectFiles.DocsDirectory, 'README.md'), path.join(outDir, 'README.md')],
    [projectPath('LICENSE.md'), path.join(outDir, 'LICENSE.md')],
    [projectPath('.eslintignore'), path.join(outDir, '.eslintignore')],
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
    entryPoints: Object.values(packageJSON.exports)
      .filter((e) => e.import.endsWith('.js'))
      .map((e) => {
        return e.import.replaceAll('.js', '.ts')
      }),
    testShims,
    shims,
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
    package: deepmerge(packageJSON, {
      scripts: undefined,
      installConfig: undefined,
    }),
    transformOutput,
    entryPoints: [],
    testEnabled: false,
    includeEsModule: true,
    includeScriptModule: false,
    includeDeclarations: true,
    includeTsLib: false,
    shims: shimOptions,
  }) as unknown as NPMPackageJSON

  // Remove duplicate peer deps from dependencies...
  for (const packageName of Object.keys(transformedPackageJSON.peerDependencies)) {
    if (packageName in transformedPackageJSON.dependencies) {
      transformedPackageJSON.dependencies[packageName] = undefined as any
    }
  }

  logger.log('Writing package.json...')
  writeFile(path.join(outDir, 'package.json'), JSON.stringify(transformedPackageJSON, undefined, 2))
  // Lockfile ensures that Yarn doesn't co-mingle the workspace node_modules.
  writeFile(path.join(outDir, 'yarn.lock'), '')
}

//#endregion

function build(transformOutput: TransformOutput) {
  logger.log('Building project...')
  const project = createProjectSync({
    tsConfigFilePath: tsConfigSrcPath,
    skipAddingFilesFromTsConfig: true,
  })

  project.compilerOptions.set({
    outDir,
  })

  project.addSourceFilesByPathsSync(path.join(ProjectFiles.ModulesDirectory, 'types', '**', '*.d.ts'))

  const sourceFiles = [...transformOutput.main.files, ...transformOutput.test.files]
  logger.log(`Adding ${sourceFiles.length} source files...`)

  for (const outputFile of sourceFiles) {
    const outputFilePath = path.join(outDir, outputFile.filePath)

    project.createSourceFile(outputFilePath, outputFile.fileText)
  }

  const program = project.createProgram()
  logger.log('Emitting project files...')
  const emitResult = program.emit(
    undefined,
    (filePath, data, writeByteOrderMark) => {
      if (filePath.endsWith('.d.ts')) {
        filePaths.push(filePath)
      }

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
    tsConfigFilePath: tsConfigSrcPath,
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

await emptyDir(outDir)
await copyStaticFiles()
const transformOutput = await createTransformer()

generatePackageJSON(transformOutput)

// TODO: Likely not necessary after Yarn 3
// logger.log('Installing dependencies...')
// await runNpmCommand({
//   bin: 'yarn',
//   args: ['install'],
//   cwd: outDir,
// })

build(transformOutput)
