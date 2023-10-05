#!/usr/bin/env node
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

import { KEYWORK_IMPORT_MAP_FILE_NAME } from 'keywork/files'
import { KeyworkLogger } from 'keywork/logging'
import {
  KEYWORK_PROJECT_DIST,
  readKeyworkPackageJSON,
  readKeyworkTSConfig,
  transformTSConfigToImportMap,
} from 'keywork/node'
import { prettyJSON } from 'keywork/utils'
import { writeFileSync } from 'node:fs'
import * as path from 'node:path'

const logger = new KeyworkLogger('Import Map')
const packageJSON = readKeyworkPackageJSON()
const tsConfig = readKeyworkTSConfig()

try {
  const importMap = transformTSConfigToImportMap(tsConfig, packageJSON)
  const serializedImportMap = prettyJSON(importMap)
  console.log(serializedImportMap)

  writeFileSync(path.join(KEYWORK_PROJECT_DIST, KEYWORK_IMPORT_MAP_FILE_NAME), serializedImportMap)
} catch (error) {
  logger.error(error)
}
