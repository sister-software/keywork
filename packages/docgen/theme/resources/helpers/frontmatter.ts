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

import { parseModel } from '@keywork/docgen/theme/utils/model'
import { SourceReferenceWithGit } from '@keywork/docgen/theme/utils/sources'
import Handlebars from 'handlebars'
import { ContainerReflection, PageEvent } from 'typedoc'

export default function () {
  /**
   * @returns Template output with front matter
   */
  Handlebars.registerHelper('frontmatter', function <T extends ContainerReflection>(this: PageEvent<T>) {
    const { model } = this
    const { title, isModule } = parseModel(model)
    const frontMatter = new Map<string, string>()
    const kindString = model.kindString || 'Index'
    const tags: string[] = [kindString]

    if (isModule) {
      frontMatter.set('sidebar_position', '-1')
    }

    const commentTags = model.comment?.getTags(`@tag`)

    if (commentTags && commentTags.length) {
      tags.push(...commentTags.map((tag) => tag.content[0].text))
    }

    frontMatter.set('id', isModule ? 'README' : model.getAlias())

    if (model.originalName === 'Keywork') {
      frontMatter.set('title', JSON.stringify('Keywork Modules'))
      frontMatter.set('sidebar_label', 'Modules Overview')
    } else {
      frontMatter.set('title', JSON.stringify(isModule ? `${kindString}: ${title}` : title))
      frontMatter.set('sidebar_label', isModule ? 'Module Overview' : JSON.stringify(model.originalName))
      frontMatter.set('pagination_label', JSON.stringify(isModule ? `${kindString}: ${title}` : title))
    }

    frontMatter.set('sidebar_class_name', `doc-kind-${kindString.toLowerCase()}`)

    frontMatter.set(
      'tags',
      tags.reduce((acc, tag) => `${acc}\n  - ${JSON.stringify(tag)}`, '')
    )

    const keywordTags = model.comment?.getTags(`@keyword`)

    if (keywordTags && keywordTags.length) {
      frontMatter.set(
        'keywords',
        tags.reduce((acc, tag) => `${acc}\n  - ${JSON.stringify(tag)}`, '')
      )
    }

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
