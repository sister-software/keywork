# Interface: CreateKeyworkDocumentMetadataOptions

[collections](../modules/collections.md).CreateKeyworkDocumentMetadataOptions

## Table of contents

### Properties

- [absoluteDocPath](collections.CreateKeyworkDocumentMetadataOptions.md#absolutedocpath)
- [createdAt](collections.CreateKeyworkDocumentMetadataOptions.md#createdat)
- [deserializeAs](collections.CreateKeyworkDocumentMetadataOptions.md#deserializeas)
- [etag](collections.CreateKeyworkDocumentMetadataOptions.md#etag)
- [relativeDocPath](collections.CreateKeyworkDocumentMetadataOptions.md#relativedocpath)

## Properties

### absoluteDocPath

• **absoluteDocPath**: `string`

A POSIX-style, absolute path to a document.

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:22](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L22)

___

### createdAt

• **createdAt**: `Date`

Determines the ULID seed.

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:28](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L28)

___

### deserializeAs

• `Optional` **deserializeAs**: [`DeserializationTransformers`](../modules/collections.md#deserializationtransformers)

Defaults to text `String`

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:31](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L31)

___

### etag

• `Optional` **etag**: ``null`` \| `string`

An optional ETag of the value associated with this document.

**`see`** `generateETag` via `@keywork/utils`

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:38](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L38)

___

### relativeDocPath

• **relativeDocPath**: `string`

A POSIX-style, relative path to a document from a collection.

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:25](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L25)
