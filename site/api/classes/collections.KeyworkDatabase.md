---
title: "Class: KeyworkDatabase"
sidebar_label: "KeyworkDatabase"
sidebar_class_name: "doc-kind-class"
---

# Class: KeyworkDatabase

[collections](../modules/collections).KeyworkDatabase

Creates a database instance backed by a Cloudflare KV namespace.

## Constructors

### constructor

• **new KeyworkDatabase**(`kvNamespace`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `kvNamespace` | `KVNamespace`<`string`\> |

#### Defined in

[packages/collections/lib/KeyworkDatabase.ts:22](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDatabase.ts#L22)

## Properties

### kvNamespace

• `Protected` **kvNamespace**: `KVNamespace`<`string`\>

## Methods

### collection

▸ **collection**(`collectionPath`): `Promise`<[`KeyworkCollection`](collections.KeyworkCollection)<{} \| [`DeserializationTypes`](../modules/collections#deserializationtypes)\>\>

Gets a `KeyworkCollection` instance that refers to a collection of documents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionPath` | `string` |

#### Returns

`Promise`<[`KeyworkCollection`](collections.KeyworkCollection)<{} \| [`DeserializationTypes`](../modules/collections#deserializationtypes)\>\>

#### Defined in

[packages/collections/lib/KeyworkDatabase.ts:40](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDatabase.ts#L40)

___

### doc

▸ **doc**<`ExpectedType`\>(`docPath`): [`KeyworkDocumentReference`](collections.KeyworkDocumentReference)<`ExpectedType`\>

Gets a `KeyworkDocumentReference` instance that refers to the document at the specified absolute path.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends {} \| [`DeserializationTypes`](../modules/collections#deserializationtypes) = `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `docPath` | `string` |

#### Returns

[`KeyworkDocumentReference`](collections.KeyworkDocumentReference)<`ExpectedType`\>

#### Defined in

[packages/collections/lib/KeyworkDatabase.ts:30](https://github.com/nirrius/keywork/blob/73ad60a/packages/collections/lib/KeyworkDatabase.ts#L30)
