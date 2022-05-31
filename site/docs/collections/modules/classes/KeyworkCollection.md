# Class: KeyworkCollection<ExpectedType\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends [`DeserializationTypes`](../modules.md#deserializationtypes) \| {} |

## Table of contents

### Constructors

- [constructor](KeyworkCollection.md#constructor)

### Properties

- [\_\_documentsPath](KeyworkCollection.md#__documentspath)
- [\_\_indexByDocumentPath](KeyworkCollection.md#__indexbydocumentpath)
- [\_\_indexByIDPath](KeyworkCollection.md#__indexbyidpath)
- [\_\_indexPathByPropertyName](KeyworkCollection.md#__indexpathbypropertyname)
- [\_\_indexPrefixesPath](KeyworkCollection.md#__indexprefixespath)
- [\_\_indexesPath](KeyworkCollection.md#__indexespath)
- [collectionPath](KeyworkCollection.md#collectionpath)
- [kvNamespace](KeyworkCollection.md#kvnamespace)

### Methods

- [addEntryToIndexes](KeyworkCollection.md#addentrytoindexes)
- [createDocumentReference](KeyworkCollection.md#createdocumentreference)
- [fetchDocumentMetadataByPath](KeyworkCollection.md#fetchdocumentmetadatabypath)
- [fetchDocuments](KeyworkCollection.md#fetchdocuments)
- [fetchDocumentsList](KeyworkCollection.md#fetchdocumentslist)
- [fetchDocumentsListByID](KeyworkCollection.md#fetchdocumentslistbyid)
- [fetchIndexPrefixes](KeyworkCollection.md#fetchindexprefixes)
- [initialize](KeyworkCollection.md#initialize)
- [permanentlyDeleteThisCollection](KeyworkCollection.md#permanentlydeletethiscollection)
- [query](KeyworkCollection.md#query)

## Constructors

### constructor

• **new KeyworkCollection**<`ExpectedType`\>(`kvNamespace`, `collectionPath`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends {} \| [`DeserializationTypes`](../modules.md#deserializationtypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `kvNamespace` | `KVNamespace`<`string`\> |
| `collectionPath` | `string` |

#### Defined in

[collections/src/KeyworkCollection.ts:52](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L52)

## Properties

### \_\_documentsPath

• `Protected` **\_\_documentsPath**: [`PathBuilder`](../modules.md#pathbuilder)

Path to documents.

#### Defined in

[collections/src/KeyworkCollection.ts:35](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L35)

___

### \_\_indexByDocumentPath

• `Protected` **\_\_indexByDocumentPath**: [`PathBuilder`](../modules.md#pathbuilder)

Path to the default document index by document key.

#### Defined in

[collections/src/KeyworkCollection.ts:47](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L47)

___

### \_\_indexByIDPath

• `Protected` **\_\_indexByIDPath**: [`PathBuilder`](../modules.md#pathbuilder)

Path to the default document index by ID.

#### Defined in

[collections/src/KeyworkCollection.ts:44](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L44)

___

### \_\_indexPathByPropertyName

• `Protected` **\_\_indexPathByPropertyName**: `Record`<keyof `ExpectedType`, `undefined` \| `string`\>

Path to index listing entries by an entry's properties

#### Defined in

[collections/src/KeyworkCollection.ts:50](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L50)

___

### \_\_indexPrefixesPath

• `Protected` **\_\_indexPrefixesPath**: [`PathBuilder`](../modules.md#pathbuilder)

Path to index prefixes

#### Defined in

[collections/src/KeyworkCollection.ts:41](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L41)

___

### \_\_indexesPath

• `Protected` **\_\_indexesPath**: [`PathBuilder`](../modules.md#pathbuilder)

Path to indexes.

#### Defined in

[collections/src/KeyworkCollection.ts:38](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L38)

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
| `E` | extends {} \| [`DeserializationTypes`](../modules.md#deserializationtypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `E` |
| `metadata` | [`KeyworkDocumentMetadata`](../interfaces/KeyworkDocumentMetadata.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[collections/src/KeyworkCollection.ts:161](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L161)

___

### createDocumentReference

▸ **createDocumentReference**(`relativeDocPath`): [`KeyworkDocumentReference`](KeyworkDocumentReference.md)<`ExpectedType`\>

Create a `KeyworkDocumentReference` instance that refers to the document at the specified *relative* path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeDocPath` | `string` |

#### Returns

[`KeyworkDocumentReference`](KeyworkDocumentReference.md)<`ExpectedType`\>

#### Defined in

[collections/src/KeyworkCollection.ts:152](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L152)

___

### fetchDocumentMetadataByPath

▸ **fetchDocumentMetadataByPath**(`relativeDocPath`): `Promise`<``null`` \| [`KeyworkDocumentMetadata`](../interfaces/KeyworkDocumentMetadata.md)\>

Fetches a given document's metadata.
This is used to determine a document's deserialization ahead of its fetching.

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeDocPath` | `string` |

#### Returns

`Promise`<``null`` \| [`KeyworkDocumentMetadata`](../interfaces/KeyworkDocumentMetadata.md)\>

#### Defined in

[collections/src/KeyworkCollection.ts:116](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L116)

___

### fetchDocuments

▸ **fetchDocuments**(`options?`): `Promise`<[`CollectionDocumentReferencesResponse`](../interfaces/CollectionDocumentReferencesResponse.md)<`ExpectedType`\>\>

Fetches a paginated list of the immediate `KeyworkDocumentReference`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FetchListOptions`](../interfaces/FetchListOptions.md) |

#### Returns

`Promise`<[`CollectionDocumentReferencesResponse`](../interfaces/CollectionDocumentReferencesResponse.md)<`ExpectedType`\>\>

#### Defined in

[collections/src/KeyworkCollection.ts:123](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L123)

___

### fetchDocumentsList

▸ **fetchDocumentsList**(`options?`): `Promise`<{ `keys`: (`undefined` \| `string`)[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FetchListOptions`](../interfaces/FetchListOptions.md) |

#### Returns

`Promise`<{ `keys`: (`undefined` \| `string`)[]  }\>

#### Defined in

[collections/src/KeyworkCollection.ts:103](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L103)

___

### fetchDocumentsListByID

▸ **fetchDocumentsListByID**(`options?`): `Promise`<`KVNamespaceListResult`<[`KeyworkDocumentMetadata`](../interfaces/KeyworkDocumentMetadata.md)\>\>

Fetches a paginated list of the immediate documents within this collection.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FetchListOptions`](../interfaces/FetchListOptions.md) |

#### Returns

`Promise`<`KVNamespaceListResult`<[`KeyworkDocumentMetadata`](../interfaces/KeyworkDocumentMetadata.md)\>\>

#### Defined in

[collections/src/KeyworkCollection.ts:96](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L96)

___

### fetchIndexPrefixes

▸ `Protected` **fetchIndexPrefixes**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

#### Defined in

[collections/src/KeyworkCollection.ts:84](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L84)

___

### initialize

▸ **initialize**(): `Promise`<[`KeyworkCollection`](KeyworkCollection.md)<`ExpectedType`\>\>

#### Returns

`Promise`<[`KeyworkCollection`](KeyworkCollection.md)<`ExpectedType`\>\>

#### Defined in

[collections/src/KeyworkCollection.ts:65](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L65)

___

### permanentlyDeleteThisCollection

▸ **permanentlyDeleteThisCollection**(): `void`

#### Returns

`void`

#### Defined in

[collections/src/KeyworkCollection.ts:213](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L213)

___

### query

▸ **query**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[collections/src/KeyworkCollection.ts:209](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkCollection.ts#L209)
