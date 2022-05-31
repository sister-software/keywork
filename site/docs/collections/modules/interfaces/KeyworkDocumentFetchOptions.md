# Interface: KeyworkDocumentFetchOptions

## Table of contents

### Properties

- [cacheTtl](KeyworkDocumentFetchOptions.md#cachettl)
- [deserializeAs](KeyworkDocumentFetchOptions.md#deserializeas)

## Properties

### cacheTtl

• `Optional` **cacheTtl**: `number`

The cacheTtl parameter must be an integer that is greater than or equal to 60.
It defines the length of time in seconds that a KV result is cached in the edge location that it is accessed from.
This can be useful for reducing cold read latency on keys that are read relatively infrequently.

**`see`** https://developers.cloudflare.com/workers/runtime-apis/kv/#cache-ttl

#### Defined in

[collections/src/KeyworkDocumentReference.ts:38](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentReference.ts#L38)

___

### deserializeAs

• `Optional` **deserializeAs**: [`DeserializationTransformers`](../modules.md#deserializationtransformers)

Determines how the fetched data will be interpreted after fetching.

**`defaultvalue`** 'text'

#### Defined in

[collections/src/KeyworkDocumentReference.ts:44](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentReference.ts#L44)
