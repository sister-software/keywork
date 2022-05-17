// import type { FileExtensionMime } from 'packages/responder/src/files/common.mjs'
import * as extensions from './extensions/index.mjs'

export const extensionToMimeType = new Map<string, string>(
  Object.values(extensions).map(({ extension, mimeType }) => {
    return [extension, mimeType]
  })
)
