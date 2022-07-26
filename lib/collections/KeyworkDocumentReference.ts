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

import deepmerge from 'deepmerge'
import { convertJSONToETaggableString, generateETag } from 'keywork/http/headers/caching'
import { KeyworkResourceError } from 'keywork/errors'
import type { KVNamespace } from 'keywork/kv'
import { resolvePathSegments } from 'keywork/uri'
import type {
  DeserializationTransformers,
  DeserializationTypes,
  PutOrPatchOptions,
} from './KeyworkCollection/common.ts'
import type { KeyworkCollection } from './KeyworkCollection.ts'
import {
  generateDocumentMetadata,
  isETaggable,
  KeyworkDocumentMetadata,
  _parseValueTypeInfo,
} from './KeyworkDocumentMetadata.ts'
import type { KeyworkDocumentSnapshot } from './KeyworkDocumentSnapshot.ts'

export interface KeyworkDocumentFetchOptions {
  /**
   * The cacheTtl parameter must be an integer that is greater than or equal to 60.
   * It defines the length of time in seconds that a KV result is cached in the edge location that it is accessed from.
   * This can be useful for reducing cold read latency on keys that are read relatively infrequently.
   *
   * @see https://developers.cloudflare.com/workers/runtime-apis/kv/#cache-ttl
   */
  cacheTtl?: number

  /**
   * Determines how the fetched data will be interpreted after fetching.
   * @defaultValue 'text'
   */
  deserializeAs?: DeserializationTransformers
}

/**
 * Creates an instance associated with specific document within a Cloudflare KV.
 */
export class KeyworkDocumentReference<
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExpectedType extends DeserializationTypes | {} = never
> {
  /** A POSIX-style, relative path to a document from a parent collection */
  public readonly relativeDocPath: string

  /** A POSIX-style, absolute path to a document. */
  public readonly absoluteDocPath: string

  constructor(
    /** The KV namespace binding provided by the parent Worker. */
    protected readonly kvNamespace: KVNamespace,
    /** A slash-separated path to a document. */
    relativeDocPath: string,
    protected readonly parentCollection?: KeyworkCollection<ExpectedType>
  ) {
    this.relativeDocPath = relativeDocPath
    this.absoluteDocPath = this.parentCollection
      ? resolvePathSegments(this.parentCollection.collectionPath, relativeDocPath)
      : relativeDocPath
  }

  /**
   * Attempts to fetch a `KeyworkDocumentSnapshot` associated with the `docPath`.
   * @remarks If the `deserializeAs` option is not set,
   * the type will attempt to be inferred from the parent collection's known metadata.
   */
  async fetchSnapshot(options?: KeyworkDocumentFetchOptions): Promise<KeyworkDocumentSnapshot<ExpectedType>> {
    let deserializeAs: DeserializationTransformers | undefined = options?.deserializeAs

    // Attempt to get the deserializer from the parent collection.
    if (!options?.deserializeAs && this.parentCollection) {
      const metadata = await this.parentCollection.fetchDocumentMetadataByPath(this.relativeDocPath)

      if (metadata && metadata.deserializeAs) {
        deserializeAs = metadata.deserializeAs
      }
    }

    const response = await this.kvNamespace.getWithMetadata<unknown, KeyworkDocumentMetadata>(this.absoluteDocPath, {
      cacheTtl: options?.cacheTtl,
      type: (deserializeAs || 'text') as any,
    })

    let snapshot: KeyworkDocumentSnapshot<ExpectedType>

    if (response.value === null || response.metadata === null) {
      snapshot = {
        exists: false,
        absoluteDocPath: this.absoluteDocPath,
        relativeDocPath: this.relativeDocPath,
        value: null,
        metadata: null,
      }
    } else {
      snapshot = {
        exists: true,
        absoluteDocPath: this.absoluteDocPath,
        relativeDocPath: this.relativeDocPath,
        metadata: response.metadata,
        value: response.value as unknown as ExpectedType,
      }
    }

    return snapshot
  }

  /**
   * Overwrites the entire entity if it already exists, and creates a new resource if it doesn’t exist.
   */
  public async putValue<E = ExpectedType>(nextValue: Partial<E>, putOptions?: PutOrPatchOptions) {
    const deserializeAs = _parseValueTypeInfo(nextValue)

    const preparedValue =
      deserializeAs === 'json'
        ? convertJSONToETaggableString(nextValue)
        : (nextValue as unknown as DeserializationTypes)

    const snapshot = await this.fetchSnapshot()

    const now = new Date()
    let etag: string | null = null

    if (isETaggable(preparedValue, deserializeAs)) {
      etag = await generateETag(preparedValue)
    }

    let metadata: KeyworkDocumentMetadata
    if (snapshot.exists) {
      metadata = {
        ...putOptions,
        ...snapshot.metadata,
        updatedAt: now.toJSON(),
        etag,
      }
    } else {
      metadata = generateDocumentMetadata({
        ...putOptions,
        absoluteDocPath: this.absoluteDocPath,
        relativeDocPath: this.relativeDocPath,
        createdAt: now,
        deserializeAs,
        etag,
      })
    }

    await this.kvNamespace.put(this.absoluteDocPath, preparedValue as any, { ...putOptions, metadata })

    if (this.parentCollection) {
      this.parentCollection.addEntryToIndexes<any>(nextValue, metadata)
    }

    return this
  }

  /**
   * Updates the data associated with this document's path.
   *
   * @param nextValue If this document refers to an existing JSON-like object, it will be patched rather than replaced.
   * @param snapshot An optional JSON-like snapshot to merged
   * @param deepMergeOptions Options passed to `deepMerge`
   */
  public async patchValue<E = ExpectedType>(
    nextValue: Partial<E>,
    options?: PutOrPatchOptions,
    snapshot?: KeyworkDocumentSnapshot<E>,
    deepMergeOptions?: any
  ) {
    const deserializeAs = _parseValueTypeInfo(nextValue)

    if (!snapshot) {
      snapshot = (await this.fetchSnapshot({ deserializeAs })) as unknown as KeyworkDocumentSnapshot<E>
    }

    if (!snapshot.exists) {
      throw new Error(`Cannot update ${this.absoluteDocPath} as it does not yet exist.`)
    }

    const metadata = snapshot.metadata
    if (deserializeAs === 'json' && _parseValueTypeInfo(snapshot.value) === 'json') {
      // Both the current value and the previous value are JSON-like. Attempt to merge them.
      try {
        nextValue = deepmerge(snapshot.value, nextValue, deepMergeOptions)
      } catch (error) {
        console.error(error)
        throw new KeyworkResourceError(
          `The given value could not be merged to the existing data at '${this.absoluteDocPath}'`,
          409
        )
      }
    }

    const preparedValue =
      deserializeAs === 'json' ? JSON.stringify(nextValue, null, 2) : (nextValue as unknown as DeserializationTypes)

    Object.assign<KeyworkDocumentMetadata, Partial<KeyworkDocumentMetadata>>(metadata, {
      updatedAt: new Date().toJSON(),
      etag: isETaggable(preparedValue, deserializeAs) ? await generateETag(preparedValue) : null,
    })

    await this.kvNamespace.put(this.absoluteDocPath, preparedValue as any, { ...options, metadata })

    if (this.parentCollection) {
      this.parentCollection.addEntryToIndexes<any>(nextValue, metadata)
    }

    return this
  }
}
