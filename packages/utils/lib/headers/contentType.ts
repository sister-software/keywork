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

import { PlainText } from '../files/extensions/PlainText.js'
import { extensionToMimeType, fileNameToExtension } from '../files/index.js'

export type ContentTypeHeader = HeadersInit & {
  'Content-Type': string
}

/**
 * Transforms a given file extension into a `ContentTypeHeader`
 * @param extension File extension, preferrably without the leading dot.
 * e.g. `"txt"`, `"html"`
 * @param mimeTypeFallback An optional fallback if the mimeType is not known. Defaults to `"text/plain"`
 */
export function fileExtensionToContentTypeHeader(
  extension: string,
  mimeTypeFallback = PlainText.extension
): ContentTypeHeader {
  const mimeType =
    // First, attempt as given...
    extensionToMimeType.get(extension) ||
    // Next, attempt to extract the file extension...
    extensionToMimeType.get(fileNameToExtension(extension)) ||
    // Otherwise, fallback.
    mimeTypeFallback

  return {
    'Content-Type': mimeType,
  }
}
