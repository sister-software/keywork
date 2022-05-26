/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remark Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import type { KeyworkDocumentMetadata } from './KeyworkDocumentMetadata.js'

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
