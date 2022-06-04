# Interface: KeyworkDocumentMetadata

[collections](../modules/collections.md).KeyworkDocumentMetadata

Metadata associated with a specific `KeyworkDocument`

**`remarks`** JSON serializable.

## Hierarchy

- [`PutOrPatchOptions`](collections.PutOrPatchOptions.md)

  ↳ **`KeyworkDocumentMetadata`**

## Table of contents

### Properties

- [absoluteDocPath](collections.KeyworkDocumentMetadata.md#absolutedocpath)
- [createdAt](collections.KeyworkDocumentMetadata.md#createdat)
- [deserializeAs](collections.KeyworkDocumentMetadata.md#deserializeas)
- [etag](collections.KeyworkDocumentMetadata.md#etag)
- [expiration](collections.KeyworkDocumentMetadata.md#expiration)
- [expirationTtl](collections.KeyworkDocumentMetadata.md#expirationttl)
- [id](collections.KeyworkDocumentMetadata.md#id)
- [relativeDocPath](collections.KeyworkDocumentMetadata.md#relativedocpath)
- [updatedAt](collections.KeyworkDocumentMetadata.md#updatedat)

## Properties

### absoluteDocPath

• **absoluteDocPath**: `string`

Full path to document.

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:49](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L49)

___

### createdAt

• **createdAt**: `string`

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:52](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L52)

___

### deserializeAs

• **deserializeAs**: [`DeserializationTransformers`](../modules/collections.md#deserializationtransformers)

Defaults to text `String`

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:55](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L55)

___

### etag

• **etag**: ``null`` \| `string`

An optional ETag of the value associated with this document.

**`see`** `generateETag` via `@keywork/utils`

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:62](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L62)

___

### expiration

• `Optional` **expiration**: `number`

#### Inherited from

[PutOrPatchOptions](collections.PutOrPatchOptions.md).[expiration](collections.PutOrPatchOptions.md#expiration)

#### Defined in

[packages/collections/src/common.ts:16](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/common.ts#L16)

___

### expirationTtl

• `Optional` **expirationTtl**: `number`

#### Inherited from

[PutOrPatchOptions](collections.PutOrPatchOptions.md).[expirationTtl](collections.PutOrPatchOptions.md#expirationttl)

#### Defined in

[packages/collections/src/common.ts:17](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/common.ts#L17)

___

### id

• **id**: `string`

The document's ULID identifier within its collection.

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:47](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L47)

___

### relativeDocPath

• **relativeDocPath**: `string`

Relative path to document from parent collection.

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:51](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L51)

___

### updatedAt

• **updatedAt**: `string`

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:53](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L53)
