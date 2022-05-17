import { PlainText } from '../files/extensions/PlainText.mjs'
import { extensionToMimeType } from '../files/extensionToMimeType.mjs'
import { fileNameToExtension } from '../files/files.mjs'

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
