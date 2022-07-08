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

import { constants } from 'node:fs'
import * as fs from 'node:fs/promises'

/**
 * @param {string} filePath
 * @returns {Promise<T>}
 */
export async function readJSON(filePath) {
  const content = await fs.readFile(filePath, 'utf8')

  try {
    return JSON.parse(content)
  } catch (error) {
    console.warn(content)
    console.error(`Error parsing ${filePath} to JSON`)
    throw error
  }
}

/**
 *
 * @param {string} filePath
 * @returns whether the file exists.
 */
export function checkFileExists(filePath) {
  return fs
    .access(filePath, constants.F_OK)
    .then(() => true)
    .catch(() => false)
}
