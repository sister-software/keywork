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

/**
 * A type utility for joining POSIX paths.
 *
 * This is a recursive type that will join a tuple of strings into a POSIX path.
 * Useful for building constant type-safe paths.
 *
 * ```ts
 * import * as path from 'node:path';
 * import { fileURLToPath } from 'node:url';
 *
 * export type ProjectRoot = '~';
 *
 * const __dirname = path.dirname(fileURLToPath(import.meta.url));
 *
 * export const projectRoot = path.resolve(__dirname, '..', 'etc', 'etc') as ProjectRoot;
 *
 * export function projectPathBuilder<S extends string[]>(...pathSegments: S) {
 *   return path.join(repoRoot, ...pathSegments) as Join<[ProjectRoot, ...S]>;
 * }
 * ```
 *
 * @see {@linkcode normalizePathSegments}
 */
export type PathJoinFn<
  /**
   * The tuple of strings to join.
   */
  PathSegments extends readonly string[],
  /**
   * The separator to use when joining the strings.
   * @default '/' POSIX path separator
   */
  Separator extends string = '/',
> = PathSegments extends []
  ? ''
  : PathSegments extends [infer F, ...infer R]
  ? R extends []
    ? `${F & string}`
    : F extends string
    ? `${F & string}${Separator}${PathJoinFn<Extract<R, readonly string[]>, Separator>}`
    : never
  : string

/**
 * Resolves a POSIX-like path into slash delineated segments.
 *
 * @category Path Parsing
 */
export function normalizePathSegments(...pathSegments: Array<string | undefined | null>) {
  return pathSegments
    .filter((piece) => !!piece)
    .join('/')
    .replaceAll(`//`, '/')
}
