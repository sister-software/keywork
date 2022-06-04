# Class: KeyworkCollection<ExpectedType\>

[collections](../modules/collections.md).KeyworkCollection

## Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends [`DeserializationTypes`](../modules/collections.md#deserializationtypes) \| {} |

## Table of contents

### Constructors

- [constructor](collections.KeyworkCollection.md#constructor)

### Properties

- [\_\_documentsPath](collections.KeyworkCollection.md#__documentspath)
- [\_\_indexByDocumentPath](collections.KeyworkCollection.md#__indexbydocumentpath)
- [\_\_indexByIDPath](collections.KeyworkCollection.md#__indexbyidpath)
- [\_\_indexPathByPropertyName](collections.KeyworkCollection.md#__indexpathbypropertyname)
- [\_\_indexPrefixesPath](collections.KeyworkCollection.md#__indexprefixespath)
- [\_\_indexesPath](collections.KeyworkCollection.md#__indexespath)
- [collectionPath](collections.KeyworkCollection.md#collectionpath)
- [kvNamespace](collections.KeyworkCollection.md#kvnamespace)

### Methods

- [addEntryToIndexes](collections.KeyworkCollection.md#addentrytoindexes)
- [createDocumentReference](collections.KeyworkCollection.md#createdocumentreference)
- [fetchDocumentMetadataByPath](collections.KeyworkCollection.md#fetchdocumentmetadatabypath)
- [fetchDocuments](collections.KeyworkCollection.md#fetchdocuments)
- [fetchDocumentsList](collections.KeyworkCollection.md#fetchdocumentslist)
- [fetchDocumentsListByID](collections.KeyworkCollection.md#fetchdocumentslistbyid)
- [fetchIndexPrefixes](collections.KeyworkCollection.md#fetchindexprefixes)
- [initialize](collections.KeyworkCollection.md#initialize)
- [permanentlyDeleteThisCollection](collections.KeyworkCollection.md#permanentlydeletethiscollection)
- [query](collections.KeyworkCollection.md#query)

## Constructors

### constructor

• **new KeyworkCollection**<`ExpectedType`\>(`kvNamespace`, `collectionPath`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends {} \| [`DeserializationTypes`](../modules/collections.md#deserializationtypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `kvNamespace` | `KVNamespace`<`string`\> |
| `collectionPath` | `string` |

#### Defined in

[packages/collections/src/KeyworkCollection.ts:52](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L52)

## Properties

### \_\_documentsPath

• `Protected` **\_\_documentsPath**: [`PathBuilder`](../modules/collections.md#pathbuilder)

Path to documents.

#### Defined in

[packages/collections/src/KeyworkCollection.ts:35](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L35)

___

### \_\_indexByDocumentPath

• `Protected` **\_\_indexByDocumentPath**: [`PathBuilder`](../modules/collections.md#pathbuilder)

Path to the default document index by document key.

#### Defined in

[packages/collections/src/KeyworkCollection.ts:47](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L47)

___

### \_\_indexByIDPath

• `Protected` **\_\_indexByIDPath**: [`PathBuilder`](../modules/collections.md#pathbuilder)

Path to the default document index by ID.

#### Defined in

[packages/collections/src/KeyworkCollection.ts:44](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L44)

___

### \_\_indexPathByPropertyName

• `Protected` **\_\_indexPathByPropertyName**: `Record`<keyof `ExpectedType`, `undefined` \| `string`\>

Path to index listing entries by an entry's properties

#### Defined in

[packages/collections/src/KeyworkCollection.ts:50](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L50)

___

### \_\_indexPrefixesPath

• `Protected` **\_\_indexPrefixesPath**: [`PathBuilder`](../modules/collections.md#pathbuilder)

Path to index prefixes

#### Defined in

[packages/collections/src/KeyworkCollection.ts:41](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L41)

___

### \_\_indexesPath

• `Protected` **\_\_indexesPath**: [`PathBuilder`](../modules/collections.md#pathbuilder)

Path to indexes.

#### Defined in

[packages/collections/src/KeyworkCollection.ts:38](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L38)

___

### collectionPath

• **collectionPath**: `string`

___

### kvNamespace

• `Protected` **kvNamespace**: `KVNamespace`<`string`\>

## Methods

### addEntryToIndexes

▸ **addEntryToIndexes**<`E`\>(`entry`, `metadata`): `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends {} \| [`DeserializationTypes`](../modules/collections.md#deserializationtypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `E` |
| `metadata` | [`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/collections/src/KeyworkCollection.ts:161](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L161)

___

### createDocumentReference

▸ **createDocumentReference**(`relativeDocPath`): [`KeyworkDocumentReference`](collections.KeyworkDocumentReference.md)<`ExpectedType`\>

Create a `KeyworkDocumentReference` instance that refers to the document at the specified *relative* path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeDocPath` | `string` |

#### Returns

[`KeyworkDocumentReference`](collections.KeyworkDocumentReference.md)<`ExpectedType`\>

#### Defined in

[packages/collections/src/KeyworkCollection.ts:152](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L152)

___

### fetchDocumentMetadataByPath

▸ **fetchDocumentMetadataByPath**(`relativeDocPath`): `Promise`<``null`` \| [`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata.md)\>

Fetches a given document's metadata.
This is used to determine a document's deserialization ahead of its fetching.

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeDocPath` | `string` |

#### Returns

`Promise`<``null`` \| [`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata.md)\>

#### Defined in

[packages/collections/src/KeyworkCollection.ts:116](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L116)

___

### fetchDocuments

▸ **fetchDocuments**(`options?`): `Promise`<[`CollectionDocumentReferencesResponse`](../interfaces/collections.CollectionDocumentReferencesResponse.md)<`ExpectedType`\>\>

Fetches a paginated list of the immediate `KeyworkDocumentReference`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FetchListOptions`](../interfaces/collections.FetchListOptions.md) |

#### Returns

`Promise`<[`CollectionDocumentReferencesResponse`](../interfaces/collections.CollectionDocumentReferencesResponse.md)<`ExpectedType`\>\>

#### Defined in

[packages/collections/src/KeyworkCollection.ts:123](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L123)

___

### fetchDocumentsList

▸ **fetchDocumentsList**(`options?`): `Promise`<{ `keys`: (`undefined` \| `string`)[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FetchListOptions`](../interfaces/collections.FetchListOptions.md) |

#### Returns

`Promise`<{ `keys`: (`undefined` \| `string`)[]  }\>

#### Defined in

[packages/collections/src/KeyworkCollection.ts:103](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L103)

___

### fetchDocumentsListByID

▸ **fetchDocumentsListByID**(`options?`): `Promise`<`KVNamespaceListResult`<[`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata.md)\>\>

Fetches a paginated list of the immediate documents within this collection.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FetchListOptions`](../interfaces/collections.FetchListOptions.md) |

#### Returns

`Promise`<`KVNamespaceListResult`<[`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata.md)\>\>

#### Defined in

[packages/collections/src/KeyworkCollection.ts:96](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L96)

___

### fetchIndexPrefixes

▸ `Protected` **fetchIndexPrefixes**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

#### Defined in

[packages/collections/src/KeyworkCollection.ts:84](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L84)

___

### initialize

▸ **initialize**(): `Promise`<[`KeyworkCollection`](collections.KeyworkCollection.md)<`ExpectedType`\>\>

#### Returns

`Promise`<[`KeyworkCollection`](collections.KeyworkCollection.md)<`ExpectedType`\>\>

#### Defined in

[packages/collections/src/KeyworkCollection.ts:65](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L65)

___

### permanentlyDeleteThisCollection

▸ **permanentlyDeleteThisCollection**(): `void`

#### Returns

`void`

#### Defined in

[packages/collections/src/KeyworkCollection.ts:213](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L213)

___

### query

▸ **query**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/collections/src/KeyworkCollection.ts:209](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkCollection.ts#L209)
