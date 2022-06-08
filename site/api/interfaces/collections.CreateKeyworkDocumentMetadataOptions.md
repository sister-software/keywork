---
title: "Interface: CreateKeyworkDocumentMetadataOptions"
sidebar_label: "CreateKeyworkDocumentMetadataOptions"
sidebar_class_name: "doc-kind-interface"
---

# Interface: CreateKeyworkDocumentMetadataOptions

[collections](../modules/collections).CreateKeyworkDocumentMetadataOptions

## Properties

### absoluteDocPath

• **absoluteDocPath**: `string`

A POSIX-style, absolute path to a document.

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:22](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L22)

___

### createdAt

• **createdAt**: `Date`

Determines the ULID seed.

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:28](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L28)

___

### deserializeAs

• `Optional` **deserializeAs**: [`DeserializationTransformers`](../modules/collections#deserializationtransformers)

Defaults to text `String`

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:31](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L31)

___

### etag

• `Optional` **etag**: ``null`` \| `string`

An optional ETag of the value associated with this document.

**`see`** `generateETag` via `@keywork/utils`

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:38](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L38)

___

### relativeDocPath

• **relativeDocPath**: `string`

A POSIX-style, relative path to a document from a collection.

#### Defined in

[packages/collections/lib/KeyworkDocumentMetadata.ts:25](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDocumentMetadata.ts#L25)
