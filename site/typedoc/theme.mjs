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

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { titleCase } from 'title-case'
import TypeDoc from 'typedoc'
import { MarkdownTheme } from 'typedoc-plugin-markdown'
import { checkFileExists } from '../../build/utils/files.mjs'
import { projectPath } from '../../paths-legacy.mjs'
import { ProjectFiles } from '../../scripts/utilities/files.mjs'

// @ts-check

const defaultCategory = {
  collapsible: true,
  collapsed: true,
}

// This seems to be hardcoded.
const typeDocModulesDirName = 'modules'

class DocusaurusMarkdownTheme extends MarkdownTheme {
  // Somewhat brittle but this handles anchor links.
  static _markdownExtensionPattern = /\.md/

  get readme() {
    return 'none'
  }
  set readme(value) {
    return
  }

  /**
   *
   * @param {TypeDoc.DeclarationReflection} model
   *
   */
  _modelToFrontMatter(model) {
    const kindString = model.kindString || 'Index'
    const title = `${kindString}: ${model.name}`
    const sidebarLabel = titleCase(model.name).replaceAll('-', ' ')
    const className = `doc-kind-${kindString.toLowerCase()}`

    return { title, sidebarLabel, className }
  }

  /**
   *
   * @param {TypeDoc.RenderTemplate<TypeDoc.DeclarationReflection>} template
   * @param {TypeDoc.PageEvent<TypeDoc.DeclarationReflection>} pageEvent
   * @returns Template output with front matter
   */
  _renderWithFrontMatter(template, pageEvent) {
    const templateOutput = template(pageEvent)
    const { title, sidebarLabel, className } = this._modelToFrontMatter(pageEvent.model)

    const output = `---
title: "${title}"
sidebar_label: "${sidebarLabel}"
sidebar_class_name: "${className}"
---

${templateOutput}`

    return output
  }

  getIndexTemplate() {
    const indexTemplate = super.getIndexTemplate()

    return (pageEvent) => {
      return this._renderWithFrontMatter(indexTemplate, pageEvent)
    }
  }

  getReflectionTemplate() {
    const reflectionTemplate = super.getReflectionTemplate()

    return (pageEvent) => {
      return this._renderWithFrontMatter(reflectionTemplate, pageEvent)
    }
  }

  /**
   *
   * @param {string} urlPath
   * @returns {string}
   */
  normalizeURLPathSegments(urlPath) {
    return urlPath.replaceAll('_', '-')
  }

  /**
   *
   * @param {string} urlPath
   * @returns {string}
   */
  normalizeURLPath(urlPath) {
    return (
      urlPath
        //
        .replace(DocusaurusMarkdownTheme._markdownExtensionPattern, '')
        .replaceAll('_', '-')
    )
  }

  /**
   *
   * @param {TypeDoc.UrlMapping[]} urlMappings
   */
  _fixURLs(project, urlMappings) {
    for (const urlMapping of urlMappings) {
      if (urlMapping.url === ProjectFiles.Readme) {
        urlMapping.url = path.join(typeDocModulesDirName, ProjectFiles.ModuleIndex)
      }

      urlMapping.url = this.normalizeURLPathSegments(urlMapping.url)

      if (urlMapping.model) {
        urlMapping.model.url = this.normalizeURLPath(urlMapping.model.url)

        if (urlMapping.model.children) {
          for (const child of urlMapping.model.children) {
            child.url = this.normalizeURLPath(child.url)
          }
        }
      }
    }

    return urlMappings
  }

  /**
   *
   * @param {TypeDoc.ProjectReflection} project
   */
  getUrls(project) {
    const urlMappings = this._fixURLs(project, super.getUrls(project))

    return urlMappings
  }
}

export class DocusaurusTypeDoc extends TypeDoc.Application {
  constructor() {
    super()
    this.options.addReader(new TypeDoc.TSConfigReader())
    // this.options.addReader(new TypeDoc.TypeDocReader())
  }

  categories = [
    {
      dirName: 'modules',
      config: {
        collapsible: false,
        collapsed: false,
        label: 'API Overview',
      },
    },
    { dirName: 'classes', config: { label: 'Classes' } },
    { dirName: 'interfaces', config: { label: 'Interfaces' } },
    { dirName: 'enums', config: { label: 'Enums' } },
  ]

  /**
   *
   * @param {TypeDoc.ProjectReflection} project
   * @param {string} out
   */
  async generateDocs(project, out) {
    await super.generateDocs(project, out)

    // Add a category configuration to the API root.
    for (const [index, category] of Object.entries(this.categories)) {
      const categoryDir = path.join(out, category.dirName)
      const exists = await checkFileExists(categoryDir)

      if (!exists) continue

      await fs.writeFile(
        path.join(categoryDir, ProjectFiles.Category),
        JSON.stringify(
          {
            ...defaultCategory,
            position: parseInt(index, 10),
            ...category.config,
          },
          null,
          2
        )
      )
    }
  }

  /**
   * Initialize TypeDoc with the given options object.
   * Patches the Markdown theme to better align with Docusaurus's expected output.
   *
   * @param {Partial<TypeDoc.TypeDocOptions>} [options]  The desired options to set.
   */
  bootstrap(options) {
    super.bootstrap({
      ...options,
      tsconfig: projectPath('dist', 'tsconfig.json'),
      plugin: ['typedoc-plugin-markdown', ...(options.plugin || [])],
    })

    if (!this.renderer.themes.has('markdown')) {
      throw new Error('Markdown theme not present')
    }

    this.renderer.themes.set('markdown', DocusaurusMarkdownTheme)

    Object.defineProperty(this.renderer, 'cname', {
      get() {
        return ''
      },
    })

    Object.defineProperty(this.renderer, 'githubPages', {
      get() {
        return ''
      },
    })
  }
}
