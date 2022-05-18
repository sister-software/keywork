/* eslint-disable @typescript-eslint/ban-types */
import type { DeserializationTypes } from '../common.js'
import type { KeyworkDocumentReference } from '../KeyworkDocumentReference.js'

export interface FetchListOptions extends Omit<KVNamespaceListOptions, 'prefix'> {}

export interface CollectionDocumentReferencesResponse<ExpectedType extends DeserializationTypes | {}>
  extends KVNamespaceListResult<unknown> {
  documents: KeyworkDocumentReference<ExpectedType>[]
}
