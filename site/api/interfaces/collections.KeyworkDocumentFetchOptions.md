---
title: "Interface: KeyworkDocumentFetchOptions"
sidebar_label: "KeyworkDocumentFetchOptions"
sidebar_class_name: "doc-kind-interface"
---

# Interface: KeyworkDocumentFetchOptions

[collections](../modules/collections).KeyworkDocumentFetchOptions

## Properties

### cacheTtl

• `Optional` **cacheTtl**: `number`

The cacheTtl parameter must be an integer that is greater than or equal to 60.
It defines the length of time in seconds that a KV result is cached in the edge location that it is accessed from.
This can be useful for reducing cold read latency on keys that are read relatively infrequently.

**`see`** https://developers.cloudflare.com/workers/runtime-apis/kv/#cache-ttl

#### Defined in

[packages/collections/src/KeyworkDocumentReference.ts:38](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/collections/src/KeyworkDocumentReference.ts#L38)

___

### deserializeAs

• `Optional` **deserializeAs**: [`DeserializationTransformers`](../modules/collections#deserializationtransformers)

Determines how the fetched data will be interpreted after fetching.

**`defaultvalue`** 'text'

#### Defined in

[packages/collections/src/KeyworkDocumentReference.ts:44](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/collections/src/KeyworkDocumentReference.ts#L44)
