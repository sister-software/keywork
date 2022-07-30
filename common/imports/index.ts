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

import * as fs from 'fs/promises'
import * as path from 'path'
import { changeExtension } from '@keywork/monorepo/common/files'
import { OutBuildManifest, OutDirectory } from '@keywork/monorepo/common/project'

/**
 * @internal
 */
export interface EntryPoint {
  /**
   * If the entrypoint is for an npm binary or export.
   * @default "export"
   */
  kind?: 'bin' | 'export'
  /** Name of the entrypoint in the "binary" or "exports". */
  name: string
  /** Path to the entrypoint. */
  path: string
}

/**
 * @internal
 */
export interface ImportMap {
  imports: {
    [specifier: string]: string
  }
}

export interface NPMExportEntry {
  import: string
  require: string
  types: string
}
export interface PackageExports {
  [namedExport: string]: NPMExportEntry
}

export interface NPMPackageJSON {
  name: string
  version: string
  dependencies: Record<string, string>
  peerDependencies: Record<string, string>
  devDependencies: Record<string, string>
  exports: PackageExports
}

export interface BuildManifest {
  filePaths: string[]
}

/**
 * Extract package.json entrypoints from a given import map.
 * @internal
 */
export function extractEntrypoints(packageName: string, importMap: ImportMap) {
  const entryPoints: EntryPoint[] = []
  const packageExports: PackageExports = {}

  for (const [specifier, remappedSpecifier] of Object.entries(importMap.imports)) {
    const pathSegments = specifier.split('/')

    if (pathSegments[0] !== packageName) continue

    const entryPoint: EntryPoint = {
      name: specifier,
      path: remappedSpecifier,
    }
    entryPoints.push(entryPoint)

    const namedExport = './' + path.relative(packageName, specifier)
    const relativeSpecifier = remappedSpecifier.replace('./modules/', './')
    const _import = changeExtension(relativeSpecifier, '.js')
    const _types = changeExtension(relativeSpecifier, '.d.ts')

    packageExports[namedExport] = {
      import: _import,
      // TODO: require is only partially supported for platform polyfills.
      require: _import,
      types: _types,
    }
  }

  return { entryPoints, packageExports }
}

export async function readPackageEntryPoints(): Promise<string[]> {
  const packageJSON: NPMPackageJSON = JSON.parse(await fs.readFile(path.join(OutDirectory, 'package.json'), 'utf8'))
  const absoluteEntryPoints = new Set<string>()

  if (typeof packageJSON.exports === 'string') {
    absoluteEntryPoints.add(packageJSON.exports)
  } else if (typeof packageJSON.exports === 'object') {
    for (const relativeExportPath of Object.values(packageJSON.exports)) {
      if (relativeExportPath.import.endsWith('.json')) continue
      const absolutePath = path.resolve(OutDirectory, relativeExportPath.import)
      absoluteEntryPoints.add(absolutePath)
    }
  }

  return Array.from(absoluteEntryPoints)
}

export async function readAllPackageEntryPoints() {
  const entryPoints = await readPackageEntryPoints()
  const sourceMapPaths = entryPoints.map((entryPoint) => {
    return changeExtension(entryPoint, '.js.map')
  })

  return Promise.all(
    sourceMapPaths.map(async (sourceMapPath) => {
      const content = await fs.readFile(sourceMapPath, 'utf8')
      const sourceMap = JSON.parse(content)
      const [relativePath] = sourceMap.sources

      const partialPath = path.resolve(path.dirname(sourceMapPath), relativePath)
      return changeExtension(partialPath, '.d.ts')
    })
  )
}

export async function writeBuildManifest(filePaths: string[]) {
  const buildManifest: BuildManifest = {
    filePaths: filePaths
      .map((filePath) => {
        return `./${filePath.substring(OutDirectory.length + 1)}`
      })
      .sort((a, b) => a.localeCompare(b)),
  }

  return fs.writeFile(OutBuildManifest, JSON.stringify(buildManifest, null, 2), 'utf8')
}

export async function readNPMPackageJSON(filePath: string): Promise<NPMPackageJSON> {
  const packageJSONContents = await fs.readFile(filePath, 'utf8')
  return JSON.parse(packageJSONContents)
}
