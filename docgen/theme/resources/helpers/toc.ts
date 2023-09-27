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
import type { MarkdownTheme } from 'keywork/docgen/theme/MarkdownTheme'
import { escapeChars } from 'keywork/docgen/theme/utils'
import { DeclarationReflection, ProjectReflection, ReflectionGroup } from 'typedoc'

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper('toc', function (this: ProjectReflection | DeclarationReflection) {
    const md: string[] = []

    const { hideInPageTOC } = theme

    const isVisible = this.groups?.some((group) => group.allChildrenHaveOwnDocument())

    function pushGroup(group: ReflectionGroup, md: string[]) {
      const children = group.children.map((child) => {
        return `- [\`${escapeChars(child.name)}\`](${Handlebars.helpers.relativeURL(child.url)})`
      })
      md.push(children.join('\n'))
    }

    if ((!hideInPageTOC && this.groups) || (isVisible && this.groups)) {
      if (!hideInPageTOC) {
        md.push(`## Table of contents\n\n`)
      }
      const headingLevel = hideInPageTOC ? `##` : `###`
      this.groups?.forEach((group) => {
        const groupTitle = group.title
        if (group.categories) {
          group.categories.forEach((category) => {
            md.push(`${headingLevel} ${category.title} ${groupTitle}\n\n`)
            pushGroup(category as any, md)
            md.push('\n')
          })
        } else {
          if (!hideInPageTOC || group.allChildrenHaveOwnDocument()) {
            md.push(`${headingLevel} ${groupTitle}\n\n`)
            pushGroup(group, md)
            md.push('\n')
          }
        }
      })
    }
    return md.length > 0 ? md.join('\n') : null
  })
}
