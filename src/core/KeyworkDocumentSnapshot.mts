import type { KeyworkDocumentMetadata } from './KeyworkDocumentMetadata.mjs'

interface KeyworkDocumentSnapshotDoesNotExist {
  absoluteDocPath: string
  relativeDocPath: string
  exists: false
  value: null
  metadata: null
}

interface KeyworkDocumentSnapshotExists<ExpectedType = unknown> {
  absoluteDocPath: string
  relativeDocPath: string
  exists: true
  value: ExpectedType
  metadata: KeyworkDocumentMetadata
}

type KeyworkDocumentSnapshot<ExpectedType = unknown> =
  | KeyworkDocumentSnapshotExists<ExpectedType>
  | KeyworkDocumentSnapshotDoesNotExist

export default KeyworkDocumentSnapshot
