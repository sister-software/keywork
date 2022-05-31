# Interface: CreateKeyworkDocumentMetadataOptions

## Table of contents

### Properties

- [absoluteDocPath](CreateKeyworkDocumentMetadataOptions.md#absolutedocpath)
- [createdAt](CreateKeyworkDocumentMetadataOptions.md#createdat)
- [deserializeAs](CreateKeyworkDocumentMetadataOptions.md#deserializeas)
- [etag](CreateKeyworkDocumentMetadataOptions.md#etag)
- [relativeDocPath](CreateKeyworkDocumentMetadataOptions.md#relativedocpath)

## Properties

### absoluteDocPath

• **absoluteDocPath**: `string`

A POSIX-style, absolute path to a document.

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:22](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L22)

___

### createdAt

• **createdAt**: `Date`

Determines the ULID seed.

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:28](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L28)

___

### deserializeAs

• `Optional` **deserializeAs**: [`DeserializationTransformers`](../modules.md#deserializationtransformers)

Defaults to text `String`

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:31](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L31)

___

### etag

• `Optional` **etag**: ``null`` \| `string`

An optional ETag of the value associated with this document.

**`see`** `generateETag` via `@keywork/utils`

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:38](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L38)

___

### relativeDocPath

• **relativeDocPath**: `string`

A POSIX-style, relative path to a document from a collection.

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:25](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L25)
