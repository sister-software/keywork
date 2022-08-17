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

import Handlebars from 'handlebars'
import { ContainerReflection, PageEvent, ReflectionKind } from 'typedoc'
// import { camelToTitleCase } from '../../utils.ts'
import * as ProjectFiles from '@keywork/monorepo/common/project'
import * as path from 'path'

interface FileChange {
  author: string
  date: string
}
const READ_PREFIX = '/nirrius/keywork/blob/main/modules'
const EDIT_PREFIX = '/nirrius/keywork/edit/main/modules'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _isContentPresent(value: string): boolean {
  value = value.trim()
  if (!value) return false

  const lineCount = (value.match(/\n/g) || '').length + 1
  // Empty entries only have the title and newline
  return lineCount > 2
}

export default function () {
  /**
   * @returns Template output with front matter
   */
  Handlebars.registerHelper('frontmatter', function <T extends ContainerReflection>(this: PageEvent<T>) {
    const { model } = this
    const frontMatter = new Map<string, string>()
    const isModule = model.kind === ReflectionKind.Module
    const kindString = model.kindString || 'Index'
    const tags: string[] = [kindString]

    if (isModule) {
      frontMatter.set('position', '999')
    }

    frontMatter.set('id', isModule ? 'index' : model.getAlias())
    frontMatter.set('title', JSON.stringify(isModule ? `${kindString}: ${model.name}` : model.name))
    frontMatter.set('sidebar_label', JSON.stringify(model.originalName))
    frontMatter.set('sidebar_class_name', `doc-kind-${kindString.toLowerCase()}`)
    frontMatter.set(
      'tags',
      tags.reduce((acc, tag) => `${acc}\n  - ${JSON.stringify(tag)}`, '')
    )

    if (!Date.now() && model.sources?.[0]) {
      const [source] = model.sources

      // Omit Deno deps
      if (!source.fileName.includes('deps/deno')) {
        const sourceMapPath = source.fullFileName + '.map'
        const sourceMap = JSON.parse(Deno.readTextFileSync(sourceMapPath))
        const [baseSourceFileName] = sourceMap.sources
        const sourcePath = path.join(
          path.dirname(source.fullFileName).substring(ProjectFiles.OutDirectory.length),
          baseSourceFileName
        )
        const localSourcePath = path.join(ProjectFiles.ModulesDirectory, sourcePath)
        const command = `git --no-pager log -1 --pretty='format:{"author":"%an", "date":"%ci"}%n' -- ${localSourcePath}`

        const gitStdOut = Deno.spawnSync(command).stdout.toString()

        try {
          const fileChange: FileChange = JSON.parse(gitStdOut)

          frontMatter.set('last_update', `\n  date: ${fileChange.date}\n  author: ${fileChange.author}`)
        } catch (error) {
          console.warn(command)
          console.warn(source.fileName)
          console.error(error)
        }

        // Cast to URL to ensure paths are encoded correctly.
        const sourceURL = new URL(path.posix.join(READ_PREFIX, sourcePath), 'https://github.com')
        const customEditURL = new URL(path.posix.join(EDIT_PREFIX, sourcePath), 'https://github.com')

        if (!source.url) {
          source.url = sourceURL.toString()
        }

        // console.log(source)
        // console.log(sourceMapPath)
        // console.log(customEditURL)
        frontMatter.set('source_url', sourceURL.toString())
        frontMatter.set('custom_edit_url', customEditURL.toString())
      }
    }

    // if (!isContentPresent(templateOutput)) {
    //   frontMatter.set('draft', 'true')
    // }

    const output: string[] = [
      //
      '---',
      ...Array.from(frontMatter.entries(), (pair) => pair.join(': ')),
      '---',
      '\n',
      '\n',
    ]

    return output.join('\n')
  })
}
