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
 */
export const repoRoot = path.resolve(__dirname, '..', '..', '..', '..') as RepoRoot

/**
 * Path builder relative to the repo root.
 */

export function repoRootPathBuilder<S extends string[]>(...pathSegments: S) {
  return path.join(repoRoot, ...pathSegments) as ConstantPath<[RepoRoot, ...S]>
}
