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

import { Extractor } from '@microsoft/api-extractor'
import { packagesList } from '../packages.mjs'
import { createExtractorConfig } from './common.mjs'

export async function runAPIExtractor() {
  console.log(`Extracting types...`)

  let errorCount = 0
  let warningCount = 0

  for (const packageName of packagesList) {
    console.log(`\n--> Bundling ${packageName}'s types...`)
    const extractorConfig = await createExtractorConfig(packageName)

    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true,
    })

    if (!extractorResult.succeeded) {
      process.exit(1)
    }

    errorCount += extractorResult.errorCount
    warningCount += extractorResult.warningCount
  }

  const failed = errorCount + warningCount > 0
  const colour = failed ? 31 : 32

  console.log(
    [
      `\n\x1b[${colour}mBundled all types `,
      `with ${errorCount} error(s) and ${warningCount} warning(s)`,
      '\x1b[39m',
    ].join('')
  )
}
