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

import { Application, ParameterType } from 'typedoc'
import { MarkdownThemeOptionsReader } from './options-reader.ts'
import { MarkdownTheme } from './theme.ts'

export interface MarkdownThemeOptions {
  /**
   * Do not render page title.
   * @defaultValue false
   */
  hidePageTitle: boolean

  /**
   * Do not render breadcrumbs in template.
   * @defaultValue false
   */
  hideBreadcrumbs: boolean

  /**
   * Specifies the base path that all links to be served from. If omitted all urls will be relative.
   */
  publicPath: string

  /**
   * Use HTML named anchors as fragment identifiers for engines that do not automatically assign header ids. Should be set for Bitbucket Server docs.
   * @defaultValue false
   */
  namedAnchors: boolean

  /**
   * Output all reflections into seperate output files.
   * @defaultValue false
   */
  allReflectionsHaveOwnDocument: boolean

  /**
   * Separator used to format filenames.
   * @defaultValue '.'
   */
  filenameSeparator: string

  /**
   * The file name of the entry document.
   * @defaultValue 'README.md'
   */
  entryDocument: string

  /**
   * Do not render in-page table of contents items.
   * @defaultValue false
   */
  hideInPageTOC: boolean

  /** Customise the index page title. */
  indexTitle: string

  /**
   * Do not add special symbols for class members.
   * @defaultValue false
   */
  hideMembersSymbol: boolean

  /**
   * Preserve anchor casing when generating links.
   * @defaultValue false
   */
  preserveAnchorCasing: boolean
}

export function load(app: Application) {
  app.renderer.defineTheme('markdown', MarkdownTheme)
  app.options.addReader(new MarkdownThemeOptionsReader())

  app.options.addDeclaration({
    help: '[Markdown Plugin] Do not render page title.',
    name: 'hidePageTitle',
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] Do not render breadcrumbs in template.',
    name: 'hideBreadcrumbs',
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] Specifies the base path that all links to be served from. If omitted all urls will be relative.',
    name: 'publicPath',
    type: ParameterType.String,
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] Use HTML named anchors as fragment identifiers for engines that do not automatically assign header ids. Should be set for Bitbucket Server docs.',
    name: 'namedAnchors',
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] Output all reflections into seperate output files.',
    name: 'allReflectionsHaveOwnDocument',
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] Separator used to format filenames.',
    name: 'filenameSeparator',
    type: ParameterType.String,
    defaultValue: '.',
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] The file name of the entry document.',
    name: 'entryDocument',
    type: ParameterType.String,
    defaultValue: 'README.md',
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] Do not render in-page table of contents items.',
    name: 'hideInPageTOC',
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] Customise the index page title.',
    name: 'indexTitle',
    type: ParameterType.String,
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] Do not add special symbols for class members.',
    name: 'hideMembersSymbol',
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  app.options.addDeclaration({
    help: '[Markdown Plugin] Preserve anchor casing when generating links.',
    name: 'preserveAnchorCasing',
    type: ParameterType.Boolean,
    defaultValue: false,
  })
}

export { MarkdownTheme }
