---
title: "Interface: KeyworkDocumentMetadata"
sidebar_label: "KeyworkDocumentMetadata"
sidebar_class_name: "doc-kind-interface"
---

# Interface: KeyworkDocumentMetadata

[collections](../modules/collections).KeyworkDocumentMetadata

Metadata associated with a specific `KeyworkDocument`

**`remarks`** JSON serializable.

## Hierarchy

- [`PutOrPatchOptions`](collections.PutOrPatchOptions)

  ↳ **`KeyworkDocumentMetadata`**

## Properties

### absoluteDocPath

• **absoluteDocPath**: `string`

Full path to document.

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:49](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L49)

___

### createdAt

• **createdAt**: `string`

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:52](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L52)

___

### deserializeAs

• **deserializeAs**: [`DeserializationTransformers`](../modules/collections#deserializationtransformers)

Defaults to text `String`

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:55](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L55)

___

### etag

• **etag**: ``null`` \| `string`

An optional ETag of the value associated with this document.

**`see`** `generateETag` via `@keywork/utils`

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:62](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L62)

___

### expiration

• `Optional` **expiration**: `number`

#### Inherited from

[PutOrPatchOptions](collections.PutOrPatchOptions).[expiration](collections.PutOrPatchOptions#expiration)

#### Defined in

[packages/collections/lib/common.ts:16](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/common.ts#L16)

___

### expirationTtl

• `Optional` **expirationTtl**: `number`

#### Inherited from

[PutOrPatchOptions](collections.PutOrPatchOptions).[expirationTtl](collections.PutOrPatchOptions#expirationttl)

#### Defined in

[packages/collections/lib/common.ts:17](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/common.ts#L17)

___

### id

• **id**: `string`

The document's ULID identifier within its collection.

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:47](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L47)

___

### relativeDocPath

• **relativeDocPath**: `string`

Relative path to document from parent collection.

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:51](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L51)

___

### updatedAt

• **updatedAt**: `string`

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:53](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L53)
