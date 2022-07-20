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

import type { KVNamespace } from 'keywork/kv'
import { DeserializationTypes } from './KeyworkCollection/common.ts'
import { KeyworkCollection } from './KeyworkCollection.ts'
import { KeyworkDocumentReference } from './KeyworkDocumentReference.ts'

/**
 * Creates a database instance backed by a Cloudflare KV namespace.
 */
export class KeyworkDatabase {
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
  public collection(collectionPath: string) {
    const collection = new KeyworkCollection(this.kvNamespace, collectionPath)

    return collection.initialize()
  }
}
