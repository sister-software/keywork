# Keywork

## Table of contents

### Classes

- [KeyworkCollection](classes/KeyworkCollection.md)
- [KeyworkDatabase](classes/KeyworkDatabase.md)
- [KeyworkDocumentReference](classes/KeyworkDocumentReference.md)

### Interfaces

- [CollectionDocumentReferencesResponse](interfaces/CollectionDocumentReferencesResponse.md)
- [CreateKeyworkDocumentMetadataOptions](interfaces/CreateKeyworkDocumentMetadataOptions.md)
- [FetchListOptions](interfaces/FetchListOptions.md)
- [KeyworkDocumentFetchOptions](interfaces/KeyworkDocumentFetchOptions.md)
- [KeyworkDocumentMetadata](interfaces/KeyworkDocumentMetadata.md)
- [KeyworkDocumentSnapshotDoesNotExist](interfaces/KeyworkDocumentSnapshotDoesNotExist.md)
- [KeyworkDocumentSnapshotExists](interfaces/KeyworkDocumentSnapshotExists.md)
- [PutOrPatchOptions](interfaces/PutOrPatchOptions.md)

### Type Aliases

- [DeserializationTransformers](modules.md#deserializationtransformers)
- [DeserializationTypes](modules.md#deserializationtypes)
- [KeyworkDocumentSnapshot](modules.md#keyworkdocumentsnapshot)
- [PathBuilder](modules.md#pathbuilder)

### Functions

- [generateDocumentMetadata](modules.md#generatedocumentmetadata)
- [isETaggable](modules.md#isetaggable)

## Type Aliases

### DeserializationTransformers

Ƭ **DeserializationTransformers**: ``"text"`` \| ``"json"`` \| ``"arrayBuffer"`` \| ``"stream"``

#### Defined in

[collections/src/common.ts:20](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/common.ts#L20)

___

### DeserializationTypes

Ƭ **DeserializationTypes**: `string` \| `ArrayBuffer` \| `ReadableStream`

#### Defined in

[collections/src/common.ts:22](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/common.ts#L22)

___

### KeyworkDocumentSnapshot

Ƭ **KeyworkDocumentSnapshot**<`ExpectedType`\>: [`KeyworkDocumentSnapshotExists`](interfaces/KeyworkDocumentSnapshotExists.md)<`ExpectedType`\> \| [`KeyworkDocumentSnapshotDoesNotExist`](interfaces/KeyworkDocumentSnapshotDoesNotExist.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | `unknown` |

#### Defined in

[collections/src/KeyworkDocumentSnapshot.ts:33](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentSnapshot.ts#L33)

___

### PathBuilder

Ƭ **PathBuilder**: (...`collectionPath`: (`string` \| `undefined`)[]) => `string`

#### Type declaration

▸ (...`collectionPath`): `string`

**`file`** This file is part of the Keywork project.

**`copyright`** Nirrius, LLC. All rights reserved.

**`author`** Teffen Ellis, et al.

**`license`** AGPL-3.0

**`remarks`** Keywork is free software for non-commercial purposes.
You can be released from the requirements of the license by purchasing a commercial license.
Buying such a license is mandatory as soon as you develop commercial activities
involving the Keywork software without disclosing the source code of your own applications.

**`see`** LICENSE.md in the project root for further licensing information.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...collectionPath` | (`string` \| `undefined`)[] |

##### Returns

`string`

#### Defined in

utils/dist/index.d.ts:121

## Functions

### generateDocumentMetadata

▸ **generateDocumentMetadata**(`__namedParameters`): [`KeyworkDocumentMetadata`](interfaces/KeyworkDocumentMetadata.md)

Generates a new document metadata.

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`CreateKeyworkDocumentMetadataOptions`](interfaces/CreateKeyworkDocumentMetadataOptions.md) |

#### Returns

[`KeyworkDocumentMetadata`](interfaces/KeyworkDocumentMetadata.md)

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:68](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L68)

___

### isETaggable

▸ **isETaggable**(`value`, `deserializeAs?`): value is ETaggable

Checks whether a given value and deserialization transformer is ETaggable.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |
| `deserializeAs` | [`DeserializationTransformers`](modules.md#deserializationtransformers) |

#### Returns

value is ETaggable

#### Defined in

[collections/src/KeyworkDocumentMetadata.ts:110](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentMetadata.ts#L110)
