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

import { MarkdownTheme } from '@keywork/docgen/theme'
import attemptExternalResolution from '@keywork/docgen/theme/resources/helpers/attemptExternalResolution'
import breadcrumbsHelper from '@keywork/docgen/theme/resources/helpers/breadcrumbs'
import commentHelper from '@keywork/docgen/theme/resources/helpers/comment'
import commentsHelper from '@keywork/docgen/theme/resources/helpers/comments'
import declarationTitleHelper from '@keywork/docgen/theme/resources/helpers/declaration-title'
import escapeHelper from '@keywork/docgen/theme/resources/helpers/escape'
import frontmatter from '@keywork/docgen/theme/resources/helpers/frontmatter'
import hierarchyHelper from '@keywork/docgen/theme/resources/helpers/hierarchy'
import humanizeReflectionName from '@keywork/docgen/theme/resources/helpers/humanizeReflectionName'
import ifIsReference from '@keywork/docgen/theme/resources/helpers/if-is-reference'
import ifNamedAnchors from '@keywork/docgen/theme/resources/helpers/if-named-anchors'
import ifShowBreadcrumbsHelper from '@keywork/docgen/theme/resources/helpers/if-show-breadcrumbs'
import ifShowNamedAnchorsHelper from '@keywork/docgen/theme/resources/helpers/if-show-named-anchors'
import ifShowPageTitleHelper from '@keywork/docgen/theme/resources/helpers/if-show-page-title'
import ifShowReturnsHelper from '@keywork/docgen/theme/resources/helpers/if-show-returns'
import ifShowTypeHierarchyHelper from '@keywork/docgen/theme/resources/helpers/if-show-type-hierarchy'
import indexSignatureTitleHelper from '@keywork/docgen/theme/resources/helpers/index-signature-title'
import parameterTableHelper from '@keywork/docgen/theme/resources/helpers/parameter-table'
import propertyTableHelper from '@keywork/docgen/theme/resources/helpers/property-table'
import referenceMember from '@keywork/docgen/theme/resources/helpers/reference-member'
import reflectionPathHelper from '@keywork/docgen/theme/resources/helpers/reflection-path'
import reflectionTitleHelper from '@keywork/docgen/theme/resources/helpers/reflection-title'
import relativeUrlHelper from '@keywork/docgen/theme/resources/helpers/relative-url'
import returns from '@keywork/docgen/theme/resources/helpers/returns'
import signatureTitleHelper from '@keywork/docgen/theme/resources/helpers/signature-title'
import tocHelper from '@keywork/docgen/theme/resources/helpers/toc'
import typeHelper from '@keywork/docgen/theme/resources/helpers/type'
import typeAndParentHelper from '@keywork/docgen/theme/resources/helpers/type-and-parent'
import typeParameterTableHelper from '@keywork/docgen/theme/resources/helpers/type-parameter-table'
import usageTabsHelper from '@keywork/docgen/theme/resources/helpers/usage-tabs'
import Handlebars from 'handlebars'
import { readFileSync, readdirSync } from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATE_PATH = path.join(__dirname, 'resources', 'templates')

export const indexTemplate = Handlebars.compile(readFileSync(path.join(TEMPLATE_PATH, 'index.hbs'), 'utf8'))

export const reflectionTemplate = Handlebars.compile(readFileSync(path.join(TEMPLATE_PATH, 'reflection.hbs'), 'utf8'))

export const reflectionMemberTemplate = Handlebars.compile(
  readFileSync(path.join(TEMPLATE_PATH, 'reflection.member.hbs'), 'utf8')
)

export function registerPartials() {
  const partialsFolder = path.join(__dirname, 'resources', 'partials')
  const partialFiles = readdirSync(partialsFolder)

  for (const partialFile of partialFiles) {
    const partialName = path.basename(partialFile, '.hbs')
    const partialContent = readFileSync(partialsFolder + '/' + partialFile, 'utf8')
    Handlebars.registerPartial(partialName, partialContent)
  }
}

export function registerHelpers(theme: MarkdownTheme) {
  frontmatter()
  attemptExternalResolution(theme)
  breadcrumbsHelper(theme)
  commentHelper(theme)
  commentsHelper()
  humanizeReflectionName()
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
  usageTabsHelper()
  reflectionTitleHelper(theme)
  relativeUrlHelper(theme)
  returns()
  signatureTitleHelper(theme)
  tocHelper(theme)
  typeHelper()
  typeAndParentHelper()
  typeParameterTableHelper()
}
