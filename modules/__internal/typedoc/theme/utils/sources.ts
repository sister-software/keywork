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

import * as ProjectFiles from '@keywork/monorepo/common/project'
import { whichSync } from 'https://deno.land/x/which@0.2.1/mod.ts'
import * as path from 'path'
import { SourceReference } from 'typedoc'
import { KeyworkResourceError } from '../../../../errors/KeyworkResourceError.ts'

const gitCommandPath = whichSync('git')

if (!gitCommandPath) {
  throw new KeyworkResourceError("Git doesn't appear to be installed")
}

interface FileChange {
  author: string
  date: string
}

export interface SourceReferenceWithGit extends SourceReference {
  fileChange?: FileChange
  editURL?: string
  hasReadFromGit?: boolean
}

export const READ_PREFIX = '/nirrius/keywork/blob/main/modules'
export const EDIT_PREFIX = '/nirrius/keywork/edit/main/modules'
const textDecoder = new TextDecoder()

export function readFileChangeFromGit(_source: SourceReference) {
  const source = _source as SourceReferenceWithGit

  if (source.hasReadFromGit) return
  // Omit external deps
  if (source.fileName.includes('deps/deno')) return
  if (source.fileName.includes('node_modules')) return

  const lineNumber = source.line !== 0 ? `#L${source.line}` : ''
  const sourcePath = path.posix.join(ProjectFiles.ModulesDirectory, source.fileName)
  source.url = new URL(path.posix.join(READ_PREFIX, source.fileName) + lineNumber, 'https://github.com').toString()
  source.editURL = new URL(path.posix.join(EDIT_PREFIX, source.fileName) + lineNumber, 'https://github.com').toString()

  if (gitCommandPath) {
    const command = `git`
    const args = [
      //
      '--no-pager',
      `log`,
      '-1',
      `--pretty={"author":"%an", "date":"%ci"}%n`,
      '--',
      sourcePath,
    ]

    try {
      const gitStdOut = textDecoder.decode(Deno.spawnSync(command, { args }).stdout).trim()
      source.fileChange = JSON.parse(gitStdOut)
    } catch (error) {
      console.warn(command, ...args)
      console.warn(source.fileName)
      console.error(error)
    }
  }

  source.hasReadFromGit = true
}