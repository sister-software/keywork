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

import getFiles from 'deno/getfiles'
import * as path from 'deno/path'
// @ts-expect-error Bad Default export
import prettierTS from 'prettier/parser-typescript'

import prettier from 'prettier'
import { projectPath } from '../../paths.ts'

export async function formatFiles(filesDir: string): Promise<void> {
  console.log(`Formatting build...`)

  const prettierConfig = JSON.parse(Deno.readTextFileSync(projectPath('.prettierrc')))

  if (!prettierConfig) throw Error('Prettier config not found')

  const files = getFiles({
    root: filesDir,
    exclude: [path.join(filesDir, 'node_modules')],
  })

  await Promise.all(
    files.map(async (file) => {
      if (!file.ext.endsWith('js')) return

      const fileContents = await Deno.readTextFile(file.realPath)

      return Deno.writeTextFile(
        file.realPath,
        prettier.format(fileContents, {
          ...prettierConfig,
          plugins: [prettierTS],
        })
      )
    })
  )
}
