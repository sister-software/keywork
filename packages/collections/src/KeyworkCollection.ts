import { KeyworkResourceAccessError, PathBuilder, resolveDocPath } from '@keywork/shared'
import type { DeserializationTypes } from './common.js'
import type { CollectionDocumentReferencesResponse, FetchListOptions } from './KeyworkCollection/common.js'
import {
  COLLECTION_INDEX_PREFIXES,
  COLLECTION_KEY,
  DOCUMENTS_KEY,
  INDEXES_DOCUMENT_PATH_PREFIX,
  INDEXES_ID_PREFIX,
} from './KeyworkCollection/constants.js'
import type { KeyworkDocumentMetadata } from './KeyworkDocumentMetadata.js'
import { KeyworkDocumentReference } from './KeyworkDocumentReference.js'

export type { PathBuilder }

export class KeyworkCollection<
  // eslint-disable-next-line @typescript-eslint/ban-types
  ExpectedType extends DeserializationTypes | {}
> {
  /** Path to documents. */
  protected __documentsPath: PathBuilder

  /** Path to indexes. */
  protected __indexesPath: PathBuilder

  /** Path to index prefixes */
  protected __indexPrefixesPath: PathBuilder

  /** Path to the default document index by ID. */
  protected __indexByIDPath: PathBuilder

  /** Path to the default document index by document key. */
  protected __indexByDocumentPath: PathBuilder

  /** Path to index listing entries by an entry's properties */
  protected __indexPathByPropertyName!: Record<keyof ExpectedType, string | undefined>

  constructor(
    /** The KV namespace binding provided by the parent Worker. */
    protected kvNamespace: KVNamespace,
    /** A slash-separated path to a collection. */
    public collectionPath: string // options: KeyworkCollectionOptions = {}
  ) {
    this.__documentsPath = resolveDocPath.bind(null, this.collectionPath, DOCUMENTS_KEY)
    this.__indexesPath = resolveDocPath.bind(null, this.collectionPath, COLLECTION_KEY)
    this.__indexPrefixesPath = resolveDocPath.bind(null, this.collectionPath, COLLECTION_INDEX_PREFIXES)
    this.__indexByIDPath = resolveDocPath.bind(null, this.collectionPath, INDEXES_ID_PREFIX)
    this.__indexByDocumentPath = resolveDocPath.bind(null, this.collectionPath, INDEXES_DOCUMENT_PATH_PREFIX)
  }

  public async initialize() {
    const indexPrefixes = await this.fetchIndexPrefixes()
    const indexPathByProperty = {} as Record<keyof ExpectedType, string | undefined>

    for (const indexPrefix of indexPrefixes) {
      // TODO: this could use some validation
      const prefixSegments = indexPrefix.split('/')
      const lastSegment = prefixSegments[prefixSegments.length - 1] as keyof ExpectedType

      if (lastSegment) {
        indexPathByProperty[lastSegment] = indexPrefix
      }
    }

    this.__indexPathByPropertyName = indexPathByProperty

    return this
  }

  protected async fetchIndexPrefixes(): Promise<string[]> {
    // TODO: handle paging of indexes.
    const response = await this.kvNamespace.list({
      prefix: this.__indexPrefixesPath(),
    })

    return response.keys.map((key) => key.name)
  }

  /**
   * Fetches a paginated list of the immediate documents within this collection.
   */
  public async fetchDocumentsListByID(options?: FetchListOptions) {
    return this.kvNamespace.list<KeyworkDocumentMetadata>({
      ...options,
      prefix: this.__indexByIDPath(),
    })
  }

  public async fetchDocumentsList(options?: FetchListOptions) {
    const result = await this.fetchDocumentsListByID(options)

    return {
      ...result,
      keys: result.keys.map((key) => key.metadata?.relativeDocPath),
    }
  }

  /**
   * Fetches a given document's metadata.
   * This is used to determine a document's deserialization ahead of its fetching.
   */
  public async fetchDocumentMetadataByPath(relativeDocPath: string): Promise<null | KeyworkDocumentMetadata> {
    return this.kvNamespace.get(this.__indexByDocumentPath(relativeDocPath), { type: 'json' })
  }

  /**
   * Fetches a paginated list of the immediate `KeyworkDocumentReference`.
   */
  public async fetchDocuments(options?: FetchListOptions): Promise<CollectionDocumentReferencesResponse<ExpectedType>> {
    const listResult = await this.fetchDocumentsListByID(options)

    const documents = await Promise.all(
      listResult.keys.map((key) => {
        if (!key.metadata) {
          // TODO return error and warn.
          throw new Error(`Key ${key} does not include expected metadata. Consider deleting this key.`)
        }

        const { absoluteDocPath } = key.metadata
        const doc = new KeyworkDocumentReference<ExpectedType>(this.kvNamespace, absoluteDocPath, this)

        return doc
      })
    )

    const response: CollectionDocumentReferencesResponse<ExpectedType> = {
      ...listResult,
      documents,
    }

    return response
  }

  /**
   * Create a `KeyworkDocumentReference` instance that refers to the document at the specified *relative* path.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public createDocumentReference(relativeDocPath: string) {
    return new KeyworkDocumentReference<ExpectedType>(
      this.kvNamespace,
      relativeDocPath,
      this as KeyworkCollection<ExpectedType>
    )
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async addEntryToIndexes<E extends ExpectedType>(entry: E, metadata: KeyworkDocumentMetadata) {
    const serializedMetadata = JSON.stringify(metadata)
    const putOptions = {
      expiration: metadata.expiration,
      expirationTtl: metadata.expirationTtl,
    }

    const defaultIndexes = [this.__indexByIDPath(metadata.id), this.__indexByDocumentPath(metadata.relativeDocPath)]

    try {
      await Promise.all(
        defaultIndexes.map((indexPath) => {
          return this.kvNamespace.put(indexPath, serializedMetadata, { ...putOptions, metadata })
        })
      )
    } catch (error) {
      console.error(error)
      throw new KeyworkResourceAccessError(
        `An error occured while creating indexes for \`${metadata.absoluteDocPath}\``,
        500
      )
    }

    if (metadata.deserializeAs === 'json') {
      await Promise.all(
        Object.entries(this.__indexPathByPropertyName).map(async ([propertyName, indexPath]) => {
          const value = entry[propertyName as keyof E]

          if (!value) return

          try {
            // TODO: Validate
            const serializedValue = JSON.stringify(value)

            await this.kvNamespace.put(
              resolveDocPath(indexPath as string, metadata.id, serializedValue),
              serializedMetadata,
              putOptions
            )
          } catch (error) {
            console.error(error)
            throw new KeyworkResourceAccessError(
              `An error occured while creating the \`${propertyName}\` index for '${metadata.absoluteDocPath}'`,
              500
            )
          }
        })
      )
    }
  }

  public async query() {
    throw new Error('Not implemented')
  }

  public permanentlyDeleteThisCollection() {
    throw new Error('Not implemented')
  }
}
