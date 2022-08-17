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
import * as path from 'path'
import attemptExternalResolution from './resources/helpers/attemptExternalResolution.ts'
import breadcrumbsHelper from './resources/helpers/breadcrumbs.ts'
import commentHelper from './resources/helpers/comment.ts'
import commentsHelper from './resources/helpers/comments.ts'
import declarationTitleHelper from './resources/helpers/declaration-title.ts'
import escapeHelper from './resources/helpers/escape.ts'
import hierarchyHelper from './resources/helpers/hierarchy.ts'
import ifIsReference from './resources/helpers/if-is-reference.ts'
import ifNamedAnchors from './resources/helpers/if-named-anchors.ts'
import ifShowBreadcrumbsHelper from './resources/helpers/if-show-breadcrumbs.ts'
import ifShowNamedAnchorsHelper from './resources/helpers/if-show-named-anchors.ts'
import ifShowPageTitleHelper from './resources/helpers/if-show-page-title.ts'
import ifShowReturnsHelper from './resources/helpers/if-show-returns.ts'
import ifShowTypeHierarchyHelper from './resources/helpers/if-show-type-hierarchy.ts'
import indexSignatureTitleHelper from './resources/helpers/index-signature-title.ts'
import parameterTableHelper from './resources/helpers/parameter-table.ts'
import propertyTableHelper from './resources/helpers/property-table.ts'
import referenceMember from './resources/helpers/reference-member.ts'
import reflectionPathHelper from './resources/helpers/reflection-path.ts'
import reflectionTitleHelper from './resources/helpers/reflection-title.ts'
import relativeUrlHelper from './resources/helpers/relative-url.ts'
import returns from './resources/helpers/returns.ts'
import signatureTitleHelper from './resources/helpers/signature-title.ts'
import tocHelper from './resources/helpers/toc.ts'
import typeHelper from './resources/helpers/type.ts'
import typeAndParentHelper from './resources/helpers/type-and-parent.ts'
import typeParameterTableHelper from './resources/helpers/type-parameter-table.ts'
import { MarkdownTheme } from './theme.ts'
import { fileURLToPath } from 'url'
import frontmatter from './resources/helpers/frontmatter.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_PATH = path.join(__dirname, 'resources', 'templates')

export const indexTemplate = Handlebars.compile(Deno.readTextFileSync(path.join(TEMPLATE_PATH, 'index.hbs')))

export const reflectionTemplate = Handlebars.compile(Deno.readTextFileSync(path.join(TEMPLATE_PATH, 'reflection.hbs')))

export const reflectionMemberTemplate = Handlebars.compile(
  Deno.readTextFileSync(path.join(TEMPLATE_PATH, 'reflection.member.hbs'))
)

export function registerPartials() {
  const partialsFolder = path.join(__dirname, 'resources', 'partials')
  const partialFiles = Deno.readDirSync(partialsFolder)

  for (const partialFile of partialFiles) {
    const partialName = path.basename(partialFile.name, '.hbs')
    const partialContent = Deno.readTextFileSync(partialsFolder + '/' + partialFile.name)
    Handlebars.registerPartial(partialName, partialContent)
  }
}

export function registerHelpers(theme: MarkdownTheme) {
  frontmatter()
  attemptExternalResolution(theme)
  breadcrumbsHelper(theme)
  commentHelper(theme)
  commentsHelper()
  declarationTitleHelper(theme)
  escapeHelper()
  hierarchyHelper()
  ifIsReference()
  ifNamedAnchors(theme)
  ifShowBreadcrumbsHelper(theme)
  ifShowNamedAnchorsHelper(theme)
  ifShowPageTitleHelper(theme)
  ifShowReturnsHelper()
  ifShowTypeHierarchyHelper()
  indexSignatureTitleHelper()
  parameterTableHelper()
  propertyTableHelper()
  referenceMember()
  reflectionPathHelper()
  reflectionTitleHelper(theme)
  relativeUrlHelper(theme)
  returns()
  signatureTitleHelper(theme)
  tocHelper(theme)
  typeHelper()
  typeAndParentHelper()
  typeParameterTableHelper()
}
