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

import * as fsExtra from 'fs-extra'
import * as fs from 'fs/promises'
import path from 'path'
import TypeDoc from 'typedoc'
import { cleanBuild } from '../clean.mjs'
import { packagesDirectory, packagesList, projectRoot } from '../packages.mjs'
import { changeExtension } from '../paths.mjs'

// @ts-check

const FileNames = {
  Readme: 'README.md',
  Index: 'index.md',
  TypeScriptIndex: 'index.ts',
  Overview: 'overview.md',
  Category: '_category_.json',
  CNAME: 'CNAME',
  ModuleIndex: 'modules.md',
}

const defaultCategory = {
  collapsible: true,
  position: 1,
}

// This seems to be hardcoded.
const typeDocModulesDirName = 'modules'
const APIOutputDir = path.join(projectRoot, 'site', 'api')

export async function generateDocs() {
  await cleanBuild(APIOutputDir)

  const app = new TypeDoc.Application()

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new TypeDoc.TSConfigReader())
  app.options.addReader(new TypeDoc.TypeDocReader())

  // const packageDocAPIOutputDir = path.join(APIOutputDir, packageName)
  console.log(path.join(packagesDirectory, 'utils', FileNames.TypeScriptIndex))
  app.bootstrap({
    entryPoints: packagesList.map((packageName) => {
      return path.join(packagesDirectory, packageName, FileNames.TypeScriptIndex)
    }),
    out: APIOutputDir,
    plugin: 'typedoc-plugin-markdown',
    githubPages: false,
    excludeInternal: true,
    hideGenerator: true,
    hideBreadcrumbs: true,
  })

  /** @type {TypeDoc.Theme}  */
  const MarkdownTheme = app.renderer.themes.get('markdown')

  if (!MarkdownTheme) throw new Error('Markdown theme not present')

  class ExtendedMarkdownTheme extends MarkdownTheme {
    get readme() {
      return 'none'
    }
    set readme(value) {
      return
    }

    toUrl(mapping, reflection) {
      const value = super.toUrl(mapping, reflection)
      // TODO: I'm guessing we need something like a rewrite rule
      return changeExtension(value, '.foo.md')
    }
  }
  app.renderer.themes.set('markdown', ExtendedMarkdownTheme)

  Object.defineProperty(app.renderer, 'cname', {
    get() {
      return ''
    },
  })

  Object.defineProperty(app.renderer, 'githubPages', {
    get() {
      return ''
    },
  })

  const project = app.convert()

  if (!project) {
    throw new Error(`TypeDoc could not parse packages`)
  }

  await app.generateDocs(project, APIOutputDir)

  const omittedFiles = [
    //
    path.join(APIOutputDir, FileNames.Readme),
    // path.join(APIOutputDir, FileNames.CNAME),
  ]

  // Fixes issues surrounding indexing.
  await Promise.all(
    omittedFiles.map((filePath) => {
      return fs.rm(filePath)
    })
  )

  // await fsExtra.move(
  //   path.join(APIOutputDir, FileNames.ModuleIndex),
  //   path.join(APIOutputDir, typeDocModulesDirName, FileNames.ModuleIndex)
  // )

  await Promise.all(
    packagesList.map(async (packageName) => {
      const normalizedPackageName = packageName.replaceAll('-', '_')
      const packageDocAPIOutputDir = path.join(APIOutputDir, typeDocModulesDirName, normalizedPackageName)
      const indexName = `${normalizedPackageName}.md`

      await fs.mkdir(packageDocAPIOutputDir)

      await fsExtra.move(
        path.join(APIOutputDir, typeDocModulesDirName, indexName),
        path.join(packageDocAPIOutputDir, indexName)
      )

      await fs.copyFile(
        path.join(packagesDirectory, packageName, FileNames.Category),
        path.join(packageDocAPIOutputDir, FileNames.Category)
      )
    })
  )

  await fs.writeFile(
    path.join(APIOutputDir, typeDocModulesDirName, FileNames.Category),
    JSON.stringify(
      {
        ...defaultCategory,
        collapsible: false,
        collapsed: false,
        label: 'API Overview',
      },
      null,
      2
    )
  )
}
