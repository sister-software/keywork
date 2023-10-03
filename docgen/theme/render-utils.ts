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
import { MarkdownTheme } from 'keywork/docgen/theme'

import {
  attemptExternalResolutionHelper,
  breadcrumbsHelper,
  commentHelper,
  commentsHelper,
  declarationTitleHelper,
  escapeHelper,
  frontmatterHelper,
  hierarchyHelper,
  humanizeReflectionName,
  ifIsReference,
  ifNamedAnchors,
  ifShowBreadcrumbsHelper,
  ifShowNamedAnchorsHelper,
  ifShowPageTitleHelper,
  ifShowReturnsHelper,
  ifShowTypeHierarchyHelper,
  indexSignatureTitleHelper,
  parameterTableHelper,
  propertyTableHelper,
  referenceMemberHelper,
  reflectionPathHelper,
  reflectionTitleHelper,
  relativeURLHelper,
  returnsHelper,
  signatureTitleHelper,
  tocHelper,
  typeAndParentHelper,
  typeHelper,
  typeParameterTableHelper,
  usageTabsHelper,
} from 'keywork/docgen/helpers'
import { projectRootPathBuilder } from 'keywork/node'
import { readFileSync, readdirSync } from 'node:fs'
import * as path from 'node:path'

const TEMPLATE_PATH = projectRootPathBuilder('docgen', 'templates')

export const indexTemplate = Handlebars.compile(readFileSync(path.join(TEMPLATE_PATH, 'index.hbs'), 'utf8'))

export const reflectionTemplate = Handlebars.compile(readFileSync(path.join(TEMPLATE_PATH, 'reflection.hbs'), 'utf8'))

export const reflectionMemberTemplate = Handlebars.compile(
  readFileSync(path.join(TEMPLATE_PATH, 'reflection.member.hbs'), 'utf8')
)

export function registerPartials() {
  const partialsFolder = projectRootPathBuilder('docgen', 'partials')
  const partialFiles = readdirSync(partialsFolder)

  for (const partialFile of partialFiles) {
    const partialName = path.basename(partialFile, '.hbs')
    const partialContent = readFileSync(partialsFolder + '/' + partialFile, 'utf8')
    Handlebars.registerPartial(partialName, partialContent)
  }
}

export function registerHelpers(theme: MarkdownTheme) {
  frontmatterHelper()
  attemptExternalResolutionHelper(theme)
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
  referenceMemberHelper()
  reflectionPathHelper()
  usageTabsHelper()
  reflectionTitleHelper(theme)
  relativeURLHelper(theme)
  returnsHelper()
  signatureTitleHelper(theme)
  tocHelper(theme)
  typeHelper()
  typeAndParentHelper()
  typeParameterTableHelper()
}
