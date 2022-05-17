/* eslint-disable @typescript-eslint/ban-types */
import type { DeserializationTypes } from '../common.mjs'
import type { KeyworkDocumentReference } from '../KeyworkDocumentReference.mjs'

export interface FetchListOptions extends Omit<KVNamespaceListOptions, 'prefix'> {}

export interface CollectionDocumentReferencesResponse<ExpectedType extends DeserializationTypes | {}>
  extends KVNamespaceListResult<unknown> {
  documents: KeyworkDocumentReference<ExpectedType>[]
}
