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
import { SourceReferenceWithGit } from '../../utils/sources.ts'

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

    const sources = (model.sources || []) as SourceReferenceWithGit[]
    for (const source of sources) {
      if (source.url) {
        frontMatter.set('source_url', source.url)
      }

      if (source.editURL) {
        frontMatter.set('custom_edit_url', source.editURL)
      }

      if (source.fileChange) {
        frontMatter.set('last_update', `\n  date: ${source.fileChange.date}\n  author: ${source.fileChange.author}`)
      }
    }

    if (isModule && !model.children?.length) {
      frontMatter.set('draft', 'true')
    }

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
