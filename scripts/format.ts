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

import fs from 'fs/promises'
import * as path from 'path'

import FastGlob from 'fast-glob'
import prettier from 'prettier'
import { projectPath } from '@keywork/monorepo/common/paths'
import { OutDirectory } from '@keywork/monorepo/common/project'

export async function formatFiles(filesDir: string): Promise<void> {
  console.log(`Formatting build...`)

  const prettierConfig = JSON.parse(await fs.readFile(projectPath('.prettierrc'), 'utf8'))

  if (!prettierConfig) throw Error('Prettier config not found')

  const filePaths = await FastGlob(path.join(filesDir, '**', '*.{js,mjs}'), {
    ignore: [path.join(filesDir, 'node_modules')],
  })

  await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContents = await fs.readFile(filePath, 'utf8')

      return fs.writeFile(filePath, prettier.format(fileContents, prettierConfig), 'utf8')
    })
  )
}

await formatFiles(OutDirectory)
