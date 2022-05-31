# Class: KeyworkDatabase

Creates a database instance backed by a Cloudflare KV namespace.

## Table of contents

### Constructors

- [constructor](KeyworkDatabase.md#constructor)

### Properties

- [kvNamespace](KeyworkDatabase.md#kvnamespace)

### Methods

- [collection](KeyworkDatabase.md#collection)
- [doc](KeyworkDatabase.md#doc)

## Constructors

### constructor

• **new KeyworkDatabase**(`kvNamespace`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `kvNamespace` | `KVNamespace`<`string`\> |

#### Defined in

[collections/src/KeyworkDatabase.ts:22](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDatabase.ts#L22)

## Properties

### kvNamespace

• `Protected` **kvNamespace**: `KVNamespace`<`string`\>

## Methods

### collection

▸ **collection**(`collectionPath`): `Promise`<[`KeyworkCollection`](KeyworkCollection.md)<{} \| [`DeserializationTypes`](../modules.md#deserializationtypes)\>\>

Gets a `KeyworkCollection` instance that refers to a collection of documents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionPath` | `string` |

#### Returns

`Promise`<[`KeyworkCollection`](KeyworkCollection.md)<{} \| [`DeserializationTypes`](../modules.md#deserializationtypes)\>\>

#### Defined in

[collections/src/KeyworkDatabase.ts:40](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDatabase.ts#L40)

___

### doc

▸ **doc**<`ExpectedType`\>(`docPath`): [`KeyworkDocumentReference`](KeyworkDocumentReference.md)<`ExpectedType`\>

Gets a `KeyworkDocumentReference` instance that refers to the document at the specified absolute path.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends {} \| [`DeserializationTypes`](../modules.md#deserializationtypes) = `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `docPath` | `string` |

#### Returns

[`KeyworkDocumentReference`](KeyworkDocumentReference.md)<`ExpectedType`\>

#### Defined in

[collections/src/KeyworkDatabase.ts:30](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDatabase.ts#L30)
