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

/**
 * @internal
 */
export type FileExtensionLike = `.${string}`
/**
 * @internal
 */
export function changeExtension(
  filePath: string,
  /**
   * File extension with dot prefix.
   */
  extension: FileExtensionLike
) {
  const parsedPath = path.parse(filePath)

  return parsedPath.dir + path.sep + parsedPath.name + extension
}

/**
 * @returns whether the file exists.
 */
export function checkFileExists(filePath: string): Promise<boolean> {
  return fs
    .stat(filePath)
    .then(() => true)
    .catch(() => false)
}
