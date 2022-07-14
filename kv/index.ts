/* eslint-disable header/header */

/**
 * @file This file is part of the workers-types project.
 * @see {@link https://github.com/cloudflare/workers-types}
 */

import { ReadableStream } from 'keywork/platform/stream'

/**
 * Workers KV is a global, low-latency, key-value data store. It supports exceptionally high read volumes with low-latency,
 * making it possible to build highly dynamic APIs and websites which respond as quickly as a cached static file would.
 * @internal
 */
export interface KVNamespace<K extends string = string> {
  get(key: K, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<string | null>
  get(key: K, type: 'text'): Promise<string | null>
  get<ExpectedValue = unknown>(key: K, type: 'json'): Promise<ExpectedValue | null>
  get(key: K, type: 'arrayBuffer'): Promise<ArrayBuffer | null>
  get(key: K, type: 'stream'): Promise<ReadableStream | null>
  get(key: K, options: KVNamespaceGetOptions<'text'>): Promise<string | null>
  get<ExpectedValue = unknown>(key: string, options: KVNamespaceGetOptions<'json'>): Promise<ExpectedValue | null>
  get(key: K, options: KVNamespaceGetOptions<'arrayBuffer'>): Promise<ArrayBuffer | null>
  get(key: K, options: KVNamespaceGetOptions<'stream'>): Promise<ReadableStream | null>
  list<Metadata = unknown>(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult<Metadata>>
  /**
   * Creates a new key-value pair, or updates the value for a particular key.
   * @param key key to associate with the value. A key cannot be empty, `.` or `..`. All other keys are valid.
   * @param value value to store. The type is inferred. The maximum size of a value is 25MB.
   * @returns Returns a `Promise` that you should `await` on in order to verify a successful update.
   * @example
   * await NAMESPACE.put(key, value);
   */
  put(
    key: K,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    options?: KVNamespacePutOptions
  ): Promise<void>
  getWithMetadata<Metadata = unknown>(
    key: K,
    options?: Partial<KVNamespaceGetOptions<undefined>>
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>
  getWithMetadata<Metadata = unknown>(key: K, type: 'text'): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>
  getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
    key: K,
    type: 'json'
  ): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: K,
    type: 'arrayBuffer'
  ): Promise<KVNamespaceGetWithMetadataResult<ArrayBuffer, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: K,
    type: 'stream'
  ): Promise<KVNamespaceGetWithMetadataResult<ReadableStream, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: K,
    options: KVNamespaceGetOptions<'text'>
  ): Promise<KVNamespaceGetWithMetadataResult<string, Metadata>>
  getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(
    key: K,
    options: KVNamespaceGetOptions<'json'>
  ): Promise<KVNamespaceGetWithMetadataResult<ExpectedValue, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: K,
    options: KVNamespaceGetOptions<'arrayBuffer'>
  ): Promise<KVNamespaceGetWithMetadataResult<ArrayBuffer, Metadata>>
  getWithMetadata<Metadata = unknown>(
    key: K,
    options: KVNamespaceGetOptions<'stream'>
  ): Promise<KVNamespaceGetWithMetadataResult<ReadableStream, Metadata>>
  delete(name: string): Promise<void>
}

/**
 * @internal
 */
export interface KVNamespaceGetOptions<Type> {
  type: Type
  cacheTtl?: number
}

/**
 * @internal
 */
export interface KVNamespaceGetWithMetadataResult<Value, Metadata> {
  value: Value | null
  metadata: Metadata | null
}

/**
 * @internal
 */
export interface KVNamespaceListKey<Metadata> {
  name: string
  expiration?: number
  metadata?: Metadata
}

/**
 * @internal
 */
export interface KVNamespaceListOptions {
  limit?: number
  prefix?: string | null
  cursor?: string | null
}

/**
 * @internal
 */
export interface KVNamespaceListResult<Metadata> {
  keys: KVNamespaceListKey<Metadata>[]
  list_complete: boolean
  cursor?: string
}

/**
 * @internal
 */
export interface KVNamespacePutOptions {
  expiration?: number
  expirationTtl?: number
  metadata?: any | null
}
