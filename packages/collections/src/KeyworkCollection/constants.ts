/* eslint-disable @typescript-eslint/ban-types */
import { resolveDocPath } from '@keywork/shared'

/** Key to a collection's documents. */
export const COLLECTION_KEY = '__COLLECTION'

/** Key to a collection's namespace. */
export const DOCUMENTS_KEY = resolveDocPath('__DOCUMENTS')

/** Key to a collection's known index prefixes. */
export const COLLECTION_INDEX_PREFIXES = resolveDocPath(COLLECTION_KEY, '__INDEX_BY')

/** Key to a collection's default indexing by ID. */
export const INDEXES_ID_PREFIX = resolveDocPath(COLLECTION_INDEX_PREFIXES, '__ID')

/** Key to a collection's default indexing by ID. */
export const INDEXES_DOCUMENT_PATH_PREFIX = resolveDocPath(COLLECTION_INDEX_PREFIXES, '__DOCUMENT_PATH')
