import { DeserializationTypes } from '../common.mjs'
import KeyworkCollection from './KeyworkCollection.mjs'
import KeyworkDocumentReference from './KeyworkDocumentReference.mjs'

/**
 * Creates a database instance backed by a Cloudflare KV namespace.
 */
export default class KeyworkDatabase {
  constructor(
    /** The KV namespace binding provided by the parent Worker. */
    protected kvNamespace: KVNamespace
  ) {}

  /**
   * Gets a `KeyworkDocumentReference` instance that refers to the document at the specified absolute path.
   */
  public doc<
    // eslint-disable-next-line @typescript-eslint/ban-types
    ExpectedType extends DeserializationTypes | {} = never
  >(docPath: string) {
    return new KeyworkDocumentReference<ExpectedType>(this.kvNamespace, docPath)
  }

  /**
   * Gets a `KeyworkCollection` instance that refers to a collection of documents.
   */
  public async collection(collectionPath: string) {
    const collection = new KeyworkCollection(this.kvNamespace, collectionPath)

    return collection.initialize()
  }
}
