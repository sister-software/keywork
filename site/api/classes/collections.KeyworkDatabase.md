# Class: KeyworkDatabase

[collections](../modules/collections.md).KeyworkDatabase

Creates a database instance backed by a Cloudflare KV namespace.

## Table of contents

### Constructors

- [constructor](collections.KeyworkDatabase.md#constructor)

### Properties

- [kvNamespace](collections.KeyworkDatabase.md#kvnamespace)

### Methods

- [collection](collections.KeyworkDatabase.md#collection)
- [doc](collections.KeyworkDatabase.md#doc)

## Constructors

### constructor

• **new KeyworkDatabase**(`kvNamespace`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `kvNamespace` | `KVNamespace`<`string`\> |

#### Defined in

[packages/collections/src/KeyworkDatabase.ts:22](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDatabase.ts#L22)

## Properties

### kvNamespace

• `Protected` **kvNamespace**: `KVNamespace`<`string`\>

## Methods

### collection

▸ **collection**(`collectionPath`): `Promise`<[`KeyworkCollection`](collections.KeyworkCollection.md)<{} \| [`DeserializationTypes`](../modules/collections.md#deserializationtypes)\>\>

Gets a `KeyworkCollection` instance that refers to a collection of documents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionPath` | `string` |

#### Returns

`Promise`<[`KeyworkCollection`](collections.KeyworkCollection.md)<{} \| [`DeserializationTypes`](../modules/collections.md#deserializationtypes)\>\>

#### Defined in

[packages/collections/src/KeyworkDatabase.ts:40](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDatabase.ts#L40)

___

### doc

▸ **doc**<`ExpectedType`\>(`docPath`): [`KeyworkDocumentReference`](collections.KeyworkDocumentReference.md)<`ExpectedType`\>

Gets a `KeyworkDocumentReference` instance that refers to the document at the specified absolute path.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends {} \| [`DeserializationTypes`](../modules/collections.md#deserializationtypes) = `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `docPath` | `string` |

#### Returns

[`KeyworkDocumentReference`](collections.KeyworkDocumentReference.md)<`ExpectedType`\>

#### Defined in

[packages/collections/src/KeyworkDatabase.ts:30](https://github.com/nirrius/keywork/blob/361509a/packages/collections/src/KeyworkDatabase.ts#L30)
