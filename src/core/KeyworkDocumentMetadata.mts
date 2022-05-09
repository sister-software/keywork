import isPlainObject from 'lodash.isplainobject'
import { ulid } from 'ulidx'
import type { DeserializationTransformers, PutOrPatchOptions } from '../common.mjs'

export interface CreateKeyworkDocumentMetadataOptions {
  /** A POSIX-style, absolute path to a document. */
  docPath: string

  /** A POSIX-style, relative path to a document from a collection. */
  relativeDocPath: string

  /** Determines the ULID seed. */
  createdAt: Date

  /** Defaults to text `String` */
  deserializeAs?: DeserializationTransformers
}

export interface KeyworkDocumentMetadata extends PutOrPatchOptions {
  /** The document's ULID identifier within its collection. */
  id: string
  /** Full path to document. */
  absoluteDocPath: string
  /** Relative path to document from parent collection. */
  relativeDocPath: string
  createdAt: string
  updatedAt: string
  /** Defaults to text `String` */
  deserializeAs: DeserializationTransformers
}

/**
 * Generates a new document metadata.
 */
export function generateDocumentMetadata({
  docPath,
  relativeDocPath,
  createdAt,
  deserializeAs = 'text',
}: CreateKeyworkDocumentMetadataOptions): KeyworkDocumentMetadata {
  const metadata: KeyworkDocumentMetadata = {
    absoluteDocPath: docPath,
    relativeDocPath,
    id: ulid(Number(createdAt)),
    createdAt: createdAt.toJSON(),
    updatedAt: createdAt.toJSON(),
    deserializeAs,
  }

  return metadata
}

export function parseValueTypeInfo(value: unknown): DeserializationTransformers {
  const valueType = typeof value

  if (valueType === 'object') {
    if (!valueType || isPlainObject(value) || (Array.isArray(value) && value.every((entry) => isPlainObject(entry)))) {
      return 'json'
    }

    if (typeof ReadableStream !== 'undefined' && value instanceof ReadableStream) return 'stream'
    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) return 'arrayBuffer'
  }

  return 'text'
}
