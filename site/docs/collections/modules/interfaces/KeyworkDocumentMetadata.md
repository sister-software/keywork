# Interface: KeyworkDocumentMetadata

Metadata associated with a specific `KeyworkDocument`

**`remarks`** JSON serializable.

## Hierarchy

- [`PutOrPatchOptions`](PutOrPatchOptions.md)

  ↳ **`KeyworkDocumentMetadata`**

## Table of contents

### Properties

- [absoluteDocPath](KeyworkDocumentMetadata.md#absolutedocpath)
- [createdAt](KeyworkDocumentMetadata.md#createdat)
- [deserializeAs](KeyworkDocumentMetadata.md#deserializeas)
- [etag](KeyworkDocumentMetadata.md#etag)
- [expiration](KeyworkDocumentMetadata.md#expiration)
- [expirationTtl](KeyworkDocumentMetadata.md#expirationttl)
- [id](KeyworkDocumentMetadata.md#id)
- [relativeDocPath](KeyworkDocumentMetadata.md#relativedocpath)
- [updatedAt](KeyworkDocumentMetadata.md#updatedat)

## Properties

### absoluteDocPath

• **absoluteDocPath**: `string`

Full path to document.

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:49](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L49)

___

### createdAt

• **createdAt**: `string`

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:52](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L52)

___

### deserializeAs

• **deserializeAs**: [`DeserializationTransformers`](../modules.md#deserializationtransformers)

Defaults to text `String`

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:55](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L55)

___

### etag

• **etag**: ``null`` \| `string`

An optional ETag of the value associated with this document.

**`see`** `generateETag` via `@keywork/utils`

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:62](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L62)

___

### expiration

• `Optional` **expiration**: `number`

#### Inherited from

[PutOrPatchOptions](PutOrPatchOptions.md).[expiration](PutOrPatchOptions.md#expiration)

#### Defined in

[collections/src/common.ts:16](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/common.ts#L16)

___

### expirationTtl

• `Optional` **expirationTtl**: `number`

#### Inherited from

[PutOrPatchOptions](PutOrPatchOptions.md).[expirationTtl](PutOrPatchOptions.md#expirationttl)

#### Defined in

[collections/src/common.ts:17](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/common.ts#L17)

___

### id

• **id**: `string`

The document's ULID identifier within its collection.

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:47](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L47)

___

### relativeDocPath

• **relativeDocPath**: `string`

Relative path to document from parent collection.

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:51](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L51)

___

### updatedAt

• **updatedAt**: `string`

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:53](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L53)
