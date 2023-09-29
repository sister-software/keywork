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

import type { ArgumentsCamelCase, Argv } from 'yargs'

/**
 * Yargs options included in every wrangler command.
 */
export interface CommonYargsOptions {
  v: boolean | undefined
  config: string | undefined
}

export type CommonYargsArgv = Argv<CommonYargsOptions>

export type YargvToInterface<T> = T extends Argv<infer P> ? ArgumentsCamelCase<P> : never

// See http://stackoverflow.com/questions/51465182/how-to-remove-index-signature-using-mapped-types
type RemoveIndex<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K]
}
/**
 * Given some Yargs Options function factory, extract the interface
 * that corresponds to the yargs arguments, remove index types, and only allow camelCase
 */
export type StrictYargsOptionsToInterface<T extends (yargs: CommonYargsArgv) => Argv> = T extends (
  yargs: CommonYargsArgv
) => Argv<infer P>
  ? RemoveIndex<ArgumentsCamelCase<P>>
  : never

export interface CommandProps {
  yargs: Argv
  argv: string[]
  cwd: string
}
