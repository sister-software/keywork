import * as extensionsToMimeType from './files/extensionsToMimeType.mjs'
import { ContentTypeHeader } from './headers.mjs'

export type KnownFileExtensions = keyof typeof extensionsToMimeType

/** Returns the given `fileName` extension. */
export const fileNameToExtension = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex === -1 ? '' : fileName.slice(dotIndex + 1)
}

/**
 * Transforms a given file extension into a `ContentTypeHeader`
 * @param extension File extension, preferrably without the leading dot.
 * e.g. `"txt"`, `"html"`
 * @param mimeTypeFallback An optional fallback if the mimeType is not known. Defaults to `"text/plain"`
 */
export function fileExtensionToContentTypeHeader(
  extension: string,
  mimeTypeFallback = extensionsToMimeType.txt
): ContentTypeHeader {
  const value =
    // First, attempt as given...
    extensionsToMimeType[extension as KnownFileExtensions] ||
    // Next, attempt to extract the file extension...
    extensionsToMimeType[fileNameToExtension(extension) as KnownFileExtensions] ||
    // Otherwise, fallback.
    mimeTypeFallback

  return {
    'Content-Type': value.mimeType,
  }
}
