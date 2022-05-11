export interface PutOrPatchOptions {
  expiration?: number
  expirationTtl?: number
}

export type DeserializationTransformers = 'text' | 'json' | 'arrayBuffer' | 'stream'

export type DeserializationTypes = string | ArrayBuffer | ReadableStream
