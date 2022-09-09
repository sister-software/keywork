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
import { createProjectSync } from 'deno/dnt/deps'
import { getPackageJson } from 'deno/dnt/package_json'
import { ShimOptions, shimOptionsToTransformShims } from 'deno/dnt/shims'
import { transform, TransformOutput } from 'deno/dnt/transform'
import FastGlob from 'fast-glob'

import { NPMPackageJSON, readNPMPackageJSON } from '@keywork/monorepo/common/imports'
import { projectPath } from '@keywork/monorepo/common/paths'
import * as ProjectFiles from '@keywork/monorepo/common/project'
import { copy } from 'deno/fs/copy'
import deepmerge from 'https://esm.sh/deepmerge@4.2.2'
import * as path from 'path'
import { Logger } from '../logger/mod.ts'
import { DocusaurusTypeDoc } from './typedoc/mod.ts'

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
    // importMap: importMapPath,
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

const getDest = (filePath: string) => {
  return path.join(ProjectFiles.DocsAPIDirectory, filePath.substring(ProjectFiles.ModulesDirectory.length))
}

function createFileMap(filePaths: string[]): Map<string, string> {
  return new Map<string, string>(
    filePaths.map((filePath) => {
      return [filePath, getDest(filePath)]
    })
  )
}

async function copyModuleDocs() {
  logger.log('Copying static documentation...')

  const ignore = [path.join('**', ProjectFiles.NodeModules)]
  const categoryToDest = await FastGlob(path.join(ProjectFiles.ModulesDirectory, '*', '**', ProjectFiles.Category), {
    ignore,
  }).then(createFileMap)

  const docPathToDest = await FastGlob(path.join(ProjectFiles.ModulesDirectory, '*', '**', '*.{md,mdx}'), {
    ignore,
  }).then(createFileMap)

  await Promise.all(
    [...categoryToDest.values(), ...docPathToDest.values()].map(async (destPath) => {
      await Deno.mkdir(path.dirname(destPath), { recursive: true })
    })
  )

  await Promise.all(
    Array.from([...categoryToDest.entries(), ...docPathToDest.entries()], async ([filePath, destPath]) => {
      return Deno.copyFile(filePath, destPath)
    })
  )
}

async function build(transformOutput: TransformOutput) {
  logger.log('Building project...')
  const project = createProjectSync({
    tsConfigFilePath: tsConfigSrcPath,
    skipAddingFilesFromTsConfig: true,
  })

  project.compilerOptions.set({
    outDir,
  })

  project.addSourceFilesByPathsSync(path.join(ProjectFiles.ModulesDirectory, 'types', '**', '*.d.ts'))

  const outputFiles = [...transformOutput.main.files, ...transformOutput.test.files]
  logger.log(`Adding ${outputFiles.length} source files...`)
  for (const outputFile of outputFiles) {
    project.createSourceFile(outputFile.filePath, outputFile.fileText)
  }

  const program = project.createProgram()
  const typeDocApp = new DocusaurusTypeDoc(program, packageJSON.exports)

  logger.log('Generating documentation...')
  const docsOutPath = path.join(ProjectFiles.DocsAPIDirectory)

  typeDocApp.bootstrap({
    name: 'keywork',
    theme: 'custom-markdown',
    out: docsOutPath,
    filenameSeparator: '/',
    basePath: ProjectFiles.ModulesDirectory,
    tsconfig: tsConfigSrcPath,
    githubPages: false,
    excludeInternal: true,
    excludeExternals: true,
    hideGenerator: true,
    cleanOutputDir: false,
    entryDocument: 'README.mdx',
    readme: 'none',
    hideBreadcrumbs: true,
    hideInPageTOC: true,
    allReflectionsHaveOwnDocument: true,
  })

  const typeDocProject = typeDocApp.convert()

  if (!typeDocProject) {
    throw new Error('Failed to convert Typedoc project')
  }

  logger.log('Generating docs...')
  await typeDocApp.generateDocs(typeDocProject, docsOutPath)

  const urlPathnames = typeDocApp.getURLPathnames(typeDocProject)

  logger.log('Emitting project files...')

  const emitResult = program.emit(
    undefined,
    (filePath, fileContents, writeByteOrderMark) => {
      if (filePath.endsWith('.d.ts')) {
        filePaths.push(filePath)
      }

      // Check if the file contains any documentation URLs...
      const documentationURLPattern = /\(https:\/\/keywork\.app\/modules\/(\S+)\)/g
      let match: RegExpExecArray | null
      const invalidURLPathnames: string[] = []

      while ((match = documentationURLPattern.exec(fileContents)) !== null) {
        if (!match[1]) continue

        const url = new URL(match[1], 'https://keywork.app/modules/')

        if (!urlPathnames.has(url.pathname)) {
          invalidURLPathnames.push(url.pathname)
        }
      }

      if (invalidURLPathnames.length > 0) {
        logger.info('Valid URLs:')
        for (const url of urlPathnames) {
          logger.info(url)
        }

        throw new Error(`Found ${invalidURLPathnames.length} invalid documentation URLs at ${filePath}`)
      }

      if (writeByteOrderMark) {
        fileContents = '\uFEFF' + fileContents
      }

      if (path.basename(filePath) === 'mod.d.ts') {
        // Fixes issue where TypeScript cannot find subpath types.
        writeFile(path.join(path.dirname(filePath), 'index.d.ts'), fileContents)
      }

      writeFile(filePath, fileContents)
    },
    undefined,
    undefined,
    {
      before: [compilerTransforms.transformImportMeta],
    }
  )

  if (emitResult.diagnostics.length > 0) {
    outputDiagnostics(emitResult.diagnostics)
    return
  }
}

await Promise.all([emptyDir(outDir), emptyDir(ProjectFiles.DocsAPIDirectory)])
await Deno.mkdir(ProjectFiles.DocsAPIDirectory, { recursive: true })

await copyStaticFiles()
const transformOutput = await createTransformer()

generatePackageJSON(transformOutput)

await build(transformOutput)
// await copyModuleDocs()
