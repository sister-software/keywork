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

import { resolvePathSegments } from '../../uri/mod.ts'

/** Key to a collection's documents. */
export const COLLECTION_KEY = '__COLLECTION'

/** Key to a collection's namespace. */
export const DOCUMENTS_KEY = resolvePathSegments('__DOCUMENTS')

/** Key to a collection's known index prefixes. */
export const COLLECTION_INDEX_PREFIXES = resolvePathSegments(COLLECTION_KEY, '__INDEX_BY')

/** Key to a collection's default indexing by ID. */
export const INDEXES_ID_PREFIX = resolvePathSegments(COLLECTION_INDEX_PREFIXES, '__ID')

/** Key to a collection's default indexing by ID. */
export const INDEXES_DOCUMENT_PATH_PREFIX = resolvePathSegments(COLLECTION_INDEX_PREFIXES, '__DOCUMENT_PATH')
