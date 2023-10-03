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
  peerDependenciesMeta: PackageDependencyMetaRecord
}

export interface PackageDependencyMeta {
  optional: boolean
  exports?: string[]
}

export type PackageDependencyMetaRecord = Record<string, PackageDependencyMeta | undefined>

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
 * Plucks an import map friendly record of sub-package exports.
 * @internal
 * @ignore
 */
export function pluckPublicExports(packageJSON: KeyworkPackageJSON): PackageExportsRecord {
  const exports: PackageExportsRecord = {}

  for (const [alias, declaration] of Object.entries(packageJSON.exports)) {
    if (typeof declaration === 'string') continue
    if (alias.endsWith('.json')) continue
    if (alias.includes('*')) continue

    exports[alias] = declaration
  }

  return exports
}

/**
 * @returns Parsed TSConfig used by Keywork.
 * @internal
 * @ignore
 */
export function readKeyworkTSConfig() {
  return readParsedTSConfig(projectRootPathBuilder('tsconfig.json'))
}
