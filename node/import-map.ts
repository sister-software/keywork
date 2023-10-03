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

import { KeyworkResourceError } from 'keywork/errors'
import type { ImportMap } from 'keywork/files'
import { existsSync } from 'node:fs'
import * as path from 'node:path'
import type { ParsedCommandLine } from 'typescript'
import { changeExtension } from './files.js'
import { KEYWORK_PROJECT_DIST_FILENAME, KeyworkPackageJSON, projectRootPathBuilder } from './paths.js'

/**
 * Creates an import map from a given a TSConfig.
 *
 * @internal
 */
export function transformTSConfigToImportMap(
  tsConfig: ParsedCommandLine,
  packageJSON: KeyworkPackageJSON,
  externalDepHost = `https://esm.sh`
): ImportMap {
  const tsConfigPaths = tsConfig.options.paths
  const packageName = packageJSON.name

  const importMap: ImportMap = {
    imports: {},
  }

  if (!tsConfigPaths) return importMap

  for (const importAlias in tsConfigPaths) {
    const [relativePath] = tsConfigPaths[importAlias]
    const outRelativePath = './' + path.join(KEYWORK_PROJECT_DIST_FILENAME, changeExtension(relativePath, '.js'))
    const absoluteOutPath = projectRootPathBuilder(outRelativePath)

    const publicAlias = importAlias === packageName ? '.' : './' + importAlias.slice(packageName.length + 1)
    const publicExport = packageJSON.exports[publicAlias as keyof typeof packageJSON.exports]

    if (!publicExport) {
      throw new KeyworkResourceError(
        `Missing export for "${publicAlias}" in package.json. Either add an export or remove the import alias from tsconfig.json`
      )
    }

    if (!existsSync(absoluteOutPath)) {
      throw new KeyworkResourceError(
        `Export alias "${publicAlias}" appears to be missing it's corresponding file "${absoluteOutPath}"`
      )
    }

    importMap.imports[importAlias] = outRelativePath
  }

  const externalDeps = [
    // ---
    ...Object.entries(packageJSON.dependencies),
    ...Object.entries(packageJSON.peerDependencies),
  ]

  for (const [depName, depVersion] of externalDeps) {
    importMap.imports[depName] = `${externalDepHost}/${depName}@${depVersion}`

    const peerDepMeta = packageJSON.peerDependenciesMeta[depName]

    for (const peerDepExport of peerDepMeta?.exports || []) {
      importMap.imports[`${depName}/${peerDepExport}`] = `${externalDepHost}/${depName}@${depVersion}/${peerDepExport}`
    }
  }

  return importMap
}
