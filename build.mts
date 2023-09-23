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

import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  SimpleProgramConfig,
  TSPathTransformer,
  cleanTSBuildDirectory,
  createPrettierWriteFileCallback,
  createSimpleTSProgram,
  createSimpleTSProgramWithWatcher,
  readParsedTSConfig,
} from '@sister.software/typescript-esm-packager'

// ESM modules don't have __dirname, so we have to use import.meta.url...
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const programConfig: SimpleProgramConfig = {
  // Load the tsconfig.json file...
  // This function is just a wrapper around TypeScript's `ts.readConfigFile` function...
  tsConfig: readParsedTSConfig(path.join(__dirname, 'tsconfig.json')),
  // Create a transformer that...
  transformer: new TSPathTransformer(),
  // Just for fun, we'll also format the output files with Prettier...
  writeFileCallback: await createPrettierWriteFileCallback(),
}

// Clear out any previous builds...
await cleanTSBuildDirectory(programConfig.tsConfig)

const watch = process.argv.includes('--watch')

if (watch) {
  // Create a program that watches for changes and re-emits the files...
  createSimpleTSProgramWithWatcher(programConfig)
} else {
  // Or, create a program that emits the files once...
  const program = createSimpleTSProgram(programConfig)

  program.emitWithTransformer()
}
