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

/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs/promises'
import { checkFileExists } from '@keywork/monorepo/common/files'
import { readBuildManifest } from '@keywork/monorepo/common/imports'
import * as ProjectFiles from '@keywork/monorepo/common/project'
import { DocusaurusTypeDoc } from './typedoc.js'
import * as path from 'path'
import TypeDoc from 'typedoc'

async function typeDocPlugin() {
  const APIOutputDirExists = await checkFileExists(ProjectFiles.APIDocDirectory)

  if (APIOutputDirExists) {
    await fs.rm(ProjectFiles.APIDocDirectory, { recursive: true, force: true })
  } else {
    await fs.mkdir(ProjectFiles.APIDocDirectory, { recursive: true })
  }

  const packageJSON = await readBuildManifest()

  for (const [namedExport, mapping] of Object.entries(packageJSON.exports)) {
    if (namedExport.endsWith('.json')) continue
    const filePath = mapping.import

    const entryPoint = path.join(ProjectFiles.OutDirectory, filePath)
    const readmePath = path.join(ProjectFiles.LibDirectory, filePath.replace('.d.ts', '.md'))

    const outPath = path.join(ProjectFiles.APIDocDirectory, path.dirname(filePath))
    await fs.mkdir(outPath, { recursive: true })
    console.log('Created', outPath, entryPoint)
    console.log({ entryPoint, readmePath })
    const readmeExists = await checkFileExists(readmePath)
    const app = new DocusaurusTypeDoc()

    console.log('>>>>>> README EXISTS', readmePath)
    app.bootstrap({
      name: namedExport.split('/').pop() || namedExport,
      entryPoints: [entryPoint],
      githubPages: false,
      excludeInternal: true,
      hideGenerator: true,
      ['entryDocument' as any]: 'overview.md',
      readme: readmeExists ? readmePath : (false as any),
      // readme: 'none',
      ['hideBreadcrumbs' as any]: true,
      ['hideInPageTOC' as any]: true,
    })
    app.convertAndWatch
    const project = app.convert()!
    project.kind = TypeDoc.ReflectionKind.Module
    console.log(project.readme)
    // if (!readmeExists) {
    //   project.readme = undefined
    // }
    // console.log(project.children?.map((child) => [child.name, child.kind, child.kindString]))
    // project.name = path.basename(filePath)

    await app.generateDocs(project, outPath)
  }
}

await typeDocPlugin()
