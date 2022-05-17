import type { KeyworkDocumentMetadata } from './KeyworkDocumentMetadata.mjs'

export interface KeyworkDocumentSnapshotDoesNotExist {
  absoluteDocPath: string
  relativeDocPath: string
  exists: false
  value: null
  metadata: null
}

export interface KeyworkDocumentSnapshotExists<ExpectedType = unknown> {
  absoluteDocPath: string
  relativeDocPath: string
  exists: true
  value: ExpectedType
  metadata: KeyworkDocumentMetadata
}

export type KeyworkDocumentSnapshot<ExpectedType = unknown> =
  | KeyworkDocumentSnapshotExists<ExpectedType>
  | KeyworkDocumentSnapshotDoesNotExist
