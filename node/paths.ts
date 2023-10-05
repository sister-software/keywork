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

import { readParsedTSConfig } from '@sister.software/typescript-esm-packager'
import { readFileSync } from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

type Join<T extends readonly string[], S extends string = '/'> = T extends []
  ? ''
  : T extends [infer F, ...infer R]
  ? R extends []
    ? `${F & string}`
    : F extends string
    ? `${F & string}${S}${Join<Extract<R, readonly string[]>, S>}`
    : never
  : string

type ConstantPath<T extends readonly string[]> = Join<T>

type RepoRoot = '~keywork'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * The root repo directory.
 * @internal
 * @ignore
 */
export const KEYWORK_PROJECT_ROOT = path.resolve(__dirname, '..', '..') as RepoRoot

/**
 * Path builder relative to the repo root.
 * @internal
 * @ignore
 */
export function projectRootPathBuilder<S extends string[]>(...pathSegments: S) {
  return path.join(KEYWORK_PROJECT_ROOT, ...pathSegments) as ConstantPath<[RepoRoot, ...S]>
}

/**
 * Absolute path to built project directory.
 * @internal
 * @ignore
 */
export const KEYWORK_PROJECT_DIST_FILENAME = 'dist'

/**
 * Absolute path to built project directory.
 * @internal
 * @ignore
 */
export const KEYWORK_PROJECT_DIST = projectRootPathBuilder(KEYWORK_PROJECT_DIST_FILENAME)

/**
 * Absolute path to project docs.
 * @internal
 * @ignore
 */
export const KEYWORK_PROJECT_DOCS = projectRootPathBuilder('docs')

/**
 * Absolute path to generated project docs.
 * @internal
 * @ignore
 */
export const KEYWORK_PROJECT_DOCS_GENERATED = projectRootPathBuilder('docs', 'modules')

/**
 * Package.json definition for the Keywork project.
 * @internal
 * @ignore
 */
export interface KeyworkPackageJSON {
  name: string
  version: string
  exports: PackageExportsRecord
  dependencies: PackageDependencyRecord
  peerDependencies: PackageDependencyRecord
  peerDependencyExports: PackageDependencyExportsRecord
}

export type PackageDependencyExportsRecord = Record<string, string[] | undefined>

/**
 * @internal
 * @ignore
 */
export type PackageDependencyRecord = Record<string, string>

/**
 * @internal
 * @ignore
 */
export interface PackageExportDeclaration {
  import: string
  types: string
}

/**
 * @internal
 * @ignore
 */
export type PackageExportsRecord = Record<string, PackageExportDeclaration>

/**
 * @returns Contents of Keywork's package.json file.
 * @internal
 * @ignore
 */
export function readKeyworkPackageJSON(): KeyworkPackageJSON {
  const packageJSONContents = readFileSync(projectRootPathBuilder('./package.json'), 'utf-8')

  return JSON.parse(packageJSONContents)
}
/**
 * @returns Parsed TSConfig used by Keywork.
 * @internal
 * @ignore
 */
export function readKeyworkTSConfig() {
  return readParsedTSConfig(projectRootPathBuilder('tsconfig.json'))
}
