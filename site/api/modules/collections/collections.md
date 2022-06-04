# Module: collections

## Table of contents

### Classes

- [KeyworkCollection](../classes/collections.KeyworkCollection.md)
- [KeyworkDatabase](../classes/collections.KeyworkDatabase.md)
- [KeyworkDocumentReference](../classes/collections.KeyworkDocumentReference.md)

### Interfaces

- [CollectionDocumentReferencesResponse](../interfaces/collections.CollectionDocumentReferencesResponse.md)
- [CreateKeyworkDocumentMetadataOptions](../interfaces/collections.CreateKeyworkDocumentMetadataOptions.md)
- [FetchListOptions](../interfaces/collections.FetchListOptions.md)
- [KeyworkDocumentFetchOptions](../interfaces/collections.KeyworkDocumentFetchOptions.md)
- [KeyworkDocumentMetadata](../interfaces/collections.KeyworkDocumentMetadata.md)
- [KeyworkDocumentSnapshotDoesNotExist](../interfaces/collections.KeyworkDocumentSnapshotDoesNotExist.md)
- [KeyworkDocumentSnapshotExists](../interfaces/collections.KeyworkDocumentSnapshotExists.md)
- [PutOrPatchOptions](../interfaces/collections.PutOrPatchOptions.md)

### Type Aliases

- [DeserializationTransformers](collections.md#deserializationtransformers)
- [DeserializationTypes](collections.md#deserializationtypes)
- [KeyworkDocumentSnapshot](collections.md#keyworkdocumentsnapshot)
- [PathBuilder](collections.md#pathbuilder)

### Functions

- [generateDocumentMetadata](collections.md#generatedocumentmetadata)
- [isETaggable](collections.md#isetaggable)

## Type Aliases

### DeserializationTransformers

Ƭ **DeserializationTransformers**: ``"text"`` \| ``"json"`` \| ``"arrayBuffer"`` \| ``"stream"``

#### Defined in

[packages/collections/src/common.ts:20](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/common.ts#L20)

___

### DeserializationTypes

Ƭ **DeserializationTypes**: `string` \| `ArrayBuffer` \| `ReadableStream`

#### Defined in

[packages/collections/src/common.ts:22](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/common.ts#L22)

___

### KeyworkDocumentSnapshot

Ƭ **KeyworkDocumentSnapshot**<`ExpectedType`\>: [`KeyworkDocumentSnapshotExists`](../interfaces/collections.KeyworkDocumentSnapshotExists.md)<`ExpectedType`\> \| [`KeyworkDocumentSnapshotDoesNotExist`](../interfaces/collections.KeyworkDocumentSnapshotDoesNotExist.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | `unknown` |

#### Defined in

[packages/collections/src/KeyworkDocumentSnapshot.ts:33](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentSnapshot.ts#L33)

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

packages/utils/dist/index.d.ts:121

## Functions

### generateDocumentMetadata

▸ **generateDocumentMetadata**(`__namedParameters`): [`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata.md)

Generates a new document metadata.

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`CreateKeyworkDocumentMetadataOptions`](../interfaces/collections.CreateKeyworkDocumentMetadataOptions.md) |

#### Returns

[`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata.md)

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:68](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L68)

___

### isETaggable

▸ **isETaggable**(`value`, `deserializeAs?`): value is ETaggable

Checks whether a given value and deserialization transformer is ETaggable.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |
| `deserializeAs` | [`DeserializationTransformers`](collections.md#deserializationtransformers) |

#### Returns

value is ETaggable

#### Defined in

[packages/collections/src/KeyworkDocumentMetadata.ts:110](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDocumentMetadata.ts#L110)
