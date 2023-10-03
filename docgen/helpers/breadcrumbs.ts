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
import type { MarkdownTheme } from 'keywork/docgen/theme'
import { escapeChars } from 'keywork/docgen/utils'
import { PageEvent } from 'typedoc'

export function breadcrumbsHelper(theme: MarkdownTheme) {
  Handlebars.registerHelper('breadcrumbs', function (this: PageEvent) {
    const { entryPoints, entryDocument, project, readme } = theme

    if (!project) {
      return ''
    }

    const hasReadmeFile = !readme.endsWith('none')
    const breadcrumbs: string[] = []
    const globalsName = entryPoints.length > 1 ? 'Modules' : 'Exports'
    breadcrumbs.push(
      this.url === entryDocument ? project.name : `[${project.name}](${Handlebars.helpers.relativeURL(entryDocument)})`
    )
    if (hasReadmeFile) {
      breadcrumbs.push(
        this.url === project.url ? globalsName : `[${globalsName}](${Handlebars.helpers.relativeURL('modules.md')})`
      )
    }
    const breadcrumbsOut = breadcrumb(this, this.model, breadcrumbs)
    return breadcrumbsOut
  })
}

function breadcrumb(page: PageEvent, model: any, md: string[]) {
  if (model && model.parent) {
    breadcrumb(page, model.parent, md)
    if (model.url) {
      md.push(
        page.url === model.url
          ? `${escapeChars(model.name)}`
          : `[${escapeChars(model.name)}](${Handlebars.helpers.relativeURL(model.url)})`
      )
    }
  }
  return md.join(' / ')
}
