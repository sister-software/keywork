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

import { exec } from 'child_process'
import { createReadStream, existsSync } from 'fs'
import { copyFile, readdir, rm, writeFile } from 'fs/promises'
import path from 'path'
import { createInterface } from 'readline'
import { cleanBuild } from '../clean.mjs'
import { checkFileExists } from '../files.mjs'
import { packagesDirectory, packagesList, projectRoot } from '../packages.mjs'
import { createExtractorConfig } from './common.mjs'

// @ts-check

const EMPTY_COMMENT = '<!-- -->'
const FileNames = {
  Readme: 'README.md',
  Index: 'index.md',
  Overview: 'overview.md',
  Category: '_category_.json',
}

const docsOutputDir = path.join(projectRoot, 'site', 'docs')
const rootReadmePath = path.join(projectRoot, 'README.md')

export async function generateDocs() {
  await cleanBuild(docsOutputDir)

  for (const packageName of packagesList) {
    await generatePackageDocs(packageName)
  }

  await copyFile(rootReadmePath, path.join(docsOutputDir, FileNames.Index))
}

/**
 *
 * @param {string} packageName
 */
async function generatePackageDocs(packageName) {
  console.log(`Generating docs for ${packageName}...`)
  const extractorConfig = await createExtractorConfig(packageName)

  const packageRoot = path.join(packagesDirectory, packageName)
  const packageDocInputDir = path.dirname(extractorConfig.apiJsonFilePath)
  const packageDocOutputDir = path.join(docsOutputDir, packageName)
  const packageDocAPIOutputDir = path.join(packageDocOutputDir, 'api')

  await new Promise((resolve, reject) =>
    exec(`api-documenter markdown -i ${packageDocInputDir} -o ${packageDocAPIOutputDir}`, (err, stdout, stderr) => {
      console.log(stdout)
      console.error(stderr)
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  )

  console.log(`Preparing ${packageName} docs for Docusaurus...`)

  const allDocFiles = await readdir(packageDocAPIOutputDir)
  const relativeDocPaths = allDocFiles.filter((docFile) => {
    return path.extname(docFile) === '.md'
  })

  for (const relativeDocPath of relativeDocPaths) {
    let { name: docID } = path.parse(relativeDocPath)
    const absoluteDocPath = path.join(packageDocAPIOutputDir, relativeDocPath)
    const input = createReadStream(absoluteDocPath)
    const docIndexID = `${packageName}.md`
    const docIsPackageIndex = docID === packageName

    try {
      const output = []
      const lines = createInterface({
        input,
        crlfDelay: Infinity,
      })
      let title = ''

      lines.on('line', (line) => {
        line = line.replaceAll('\\_\\_', '__')

        if (line.includes(docIndexID)) {
          line = line.replaceAll(docIndexID, `${packageName}/api`)
        }

        let skip = false
        if (!title) {
          const titleLine = line.match(/## (.*)/)
          if (titleLine) {
            title = titleLine[1]
          }
        }

        const homeLink = line.match(/\[Home\]\(.\/index\.md\) &gt; (.*)/)
        if (homeLink) {
          // Skip the breadcrumb for the toplevel index file.
          if (docID !== 'keywork') {
            output.push(homeLink[1])
          }
          skip = true
        }

        // See issue #4. api-documenter expects \| to escape table
        // column delimiters, but docusaurus uses a markdown processor
        // that doesn't support this. Replace with an escape sequence
        // that renders |.
        if (line.startsWith('|')) {
          line = line.replace(/\\\|/g, '&#124;')
        }

        if (line.includes(EMPTY_COMMENT)) {
          line = line.replaceAll(EMPTY_COMMENT, '')
        }

        if (!skip) {
          output.push(line)
        }
      })

      await new Promise((resolve) => lines.once('close', resolve))
      input.close()

      // Fix double escaping
      title = title.replaceAll('\\_', '_')

      if (docIsPackageIndex) {
        title = 'API'
        docID = 'index'
      }

      const header = [
        //
        '---',
        `id: ${docID}`,
        `title: ${title}`,
        `hide_title: true`,
        '---',
      ]

      const fileContent = header.concat(output).join('\n')

      await writeFile(absoluteDocPath, fileContent)
    } catch (err) {
      console.error(`Could not process ${relativeDocPath}: ${err}`)
    } finally {
      input.destroy()
    }
  }

  // Copy static files...
  const apiIndexPath = path.join(packageDocAPIOutputDir, `${packageName}.md`)
  const packageDocs = new Map([
    // API Index
    [apiIndexPath, path.join(packageDocAPIOutputDir, FileNames.Index)],
    // Category
    [path.join(packageRoot, FileNames.Category), path.join(packageDocOutputDir, FileNames.Category)],
  ])

  await Promise.all(
    Array.from(packageDocs.entries(), async ([from, to]) => {
      const exists = await checkFileExists(from)

      if (exists) {
        await copyFile(from, to)
      }
    })
  )

  // Fixes issues surrounding indexing.
  await rm(apiIndexPath)

  const absoluteDocReadmePath = path.join(packagesDirectory, FileNames.Readme)

  if (existsSync(absoluteDocReadmePath)) {
    console.log(`Copying ${packageName} README...`)
    const absoluteReadmeDestPath = path.join(packageDocOutputDir, FileNames.Index)
    await copyFile(absoluteDocReadmePath, absoluteReadmeDestPath)
  }
}
