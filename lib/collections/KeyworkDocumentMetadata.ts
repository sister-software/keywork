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

import { ETaggable } from 'keywork/caching'
import isPlainObject from 'lodash.isplainobject'
import { ulid } from 'ulidx'
import type { DeserializationTransformers, PutOrPatchOptions } from './common.ts'

export interface CreateKeyworkDocumentMetadataOptions {
  /** A POSIX-style, absolute path to a document. */
  absoluteDocPath: string

  /** A POSIX-style, relative path to a document from a collection. */
  relativeDocPath: string

  /** Determines the ULID seed. */
  createdAt: Date

  /** Defaults to text `String` */
  deserializeAs?: DeserializationTransformers

  /**
   * An optional ETag of the value associated with this document.
   *
   * @see `generateETag` via `keywork/caching`
   */
  etag?: string | null
}

/**
 * Metadata associated with a specific `KeyworkDocument`
 * @remarks JSON serializable.
 */
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

  /**
   * An optional ETag of the value associated with this document.
   *
   * @see `generateETag` via `keywork/caching`
   */
  etag: string | null
}

/**
 * Generates a new document metadata.
 */
export function generateDocumentMetadata({
  absoluteDocPath,
  relativeDocPath,
  createdAt,
  deserializeAs = 'text',
  etag = null,
}: CreateKeyworkDocumentMetadataOptions): KeyworkDocumentMetadata {
  const metadata: KeyworkDocumentMetadata = {
    absoluteDocPath,
    relativeDocPath,
    id: ulid(Number(createdAt)),
    createdAt: createdAt.toJSON(),
    updatedAt: createdAt.toJSON(),
    deserializeAs,
    etag,
  }

  return metadata
}

/**
 * Attempts to parse a given value's serialization type.
 * @internal
 */
export function _parseValueTypeInfo(value: unknown): DeserializationTransformers {
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

/**
 * Checks whether a given value and deserialization transformer is ETaggable.
 */
export function isETaggable(
  value: unknown,
  /**
   * An optional pre-computed `DeserializationTransformers`
   */
  deserializeAs: DeserializationTransformers = _parseValueTypeInfo(value)
): value is ETaggable {
  switch (deserializeAs) {
    case 'arrayBuffer':
    case 'text':
    case 'json':
      return true
    case 'stream':
      return false
  }

  return false
}
