---
title: "Class: KeyworkCollection"
sidebar_label: "KeyworkCollection"
sidebar_class_name: "doc-kind-class"
---

# Class: KeyworkCollection<ExpectedType\>

[collections](../modules/collections).KeyworkCollection

## Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends [`DeserializationTypes`](../modules/collections#deserializationtypes) \| {} |

## Constructors

### constructor

• **new KeyworkCollection**<`ExpectedType`\>(`kvNamespace`, `collectionPath`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends {} \| [`DeserializationTypes`](../modules/collections#deserializationtypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `kvNamespace` | `KVNamespace`<`string`\> |
| `collectionPath` | `string` |

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:70](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L70)

## Properties

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
| `E` | extends {} \| [`DeserializationTypes`](../modules/collections#deserializationtypes) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `E` |
| `metadata` | [`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:179](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L179)

___

### createDocumentReference

▸ **createDocumentReference**(`relativeDocPath`): [`KeyworkDocumentReference`](collections.KeyworkDocumentReference)<`ExpectedType`\>

Create a `KeyworkDocumentReference` instance that refers to the document at the specified *relative* path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeDocPath` | `string` |

#### Returns

[`KeyworkDocumentReference`](collections.KeyworkDocumentReference)<`ExpectedType`\>

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:170](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L170)

___

### fetchDocumentMetadataByPath

▸ **fetchDocumentMetadataByPath**(`relativeDocPath`): `Promise`<``null`` \| [`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata)\>

Fetches a given document's metadata.
This is used to determine a document's deserialization ahead of its fetching.

#### Parameters

| Name | Type |
| :------ | :------ |
| `relativeDocPath` | `string` |

#### Returns

`Promise`<``null`` \| [`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata)\>

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:134](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L134)

___

### fetchDocuments

▸ **fetchDocuments**(`options?`): `Promise`<[`CollectionDocumentReferencesResponse`](../interfaces/collections.CollectionDocumentReferencesResponse)<`ExpectedType`\>\>

Fetches a paginated list of the immediate `KeyworkDocumentReference`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FetchListOptions`](../interfaces/collections.FetchListOptions) |

#### Returns

`Promise`<[`CollectionDocumentReferencesResponse`](../interfaces/collections.CollectionDocumentReferencesResponse)<`ExpectedType`\>\>

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:141](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L141)

___

### fetchDocumentsList

▸ **fetchDocumentsList**(`options?`): `Promise`<{ `cursor?`: `string` ; `keys`: (`undefined` \| `string`)[] ; `list_complete`: `boolean`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FetchListOptions`](../interfaces/collections.FetchListOptions) |

#### Returns

`Promise`<{ `cursor?`: `string` ; `keys`: (`undefined` \| `string`)[] ; `list_complete`: `boolean`  }\>

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:121](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L121)

___

### fetchDocumentsListByID

▸ **fetchDocumentsListByID**(`options?`): `Promise`<`KVNamespaceListResult`<[`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata)\>\>

Fetches a paginated list of the immediate documents within this collection.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`FetchListOptions`](../interfaces/collections.FetchListOptions) |

#### Returns

`Promise`<`KVNamespaceListResult`<[`KeyworkDocumentMetadata`](../interfaces/collections.KeyworkDocumentMetadata)\>\>

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:114](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L114)

___

### fetchIndexPrefixes

▸ `Protected` **fetchIndexPrefixes**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:102](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L102)

___

### initialize

▸ **initialize**(): `Promise`<[`KeyworkCollection`](collections.KeyworkCollection)<`ExpectedType`\>\>

#### Returns

`Promise`<[`KeyworkCollection`](collections.KeyworkCollection)<`ExpectedType`\>\>

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:83](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L83)

___

### permanentlyDeleteThisCollection

▸ **permanentlyDeleteThisCollection**(): `void`

#### Returns

`void`

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:231](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L231)

___

### query

▸ **query**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/collections/lib/KeyworkCollection.ts:227](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkCollection.ts#L227)
