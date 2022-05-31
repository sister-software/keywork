# Class: KeyworkDocumentReference<ExpectedType\>

Creates an instance associated with specific document within a Cloudflare KV.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends [`DeserializationTypes`](../modules.md#deserializationtypes) \| {} = `never` |

## Table of contents

### Constructors

- [constructor](KeyworkDocumentReference.md#constructor)

### Properties

- [absoluteDocPath](KeyworkDocumentReference.md#absolutedocpath)
- [kvNamespace](KeyworkDocumentReference.md#kvnamespace)
- [parentCollection](KeyworkDocumentReference.md#parentcollection)
- [relativeDocPath](KeyworkDocumentReference.md#relativedocpath)

### Methods

- [fetchSnapshot](KeyworkDocumentReference.md#fetchsnapshot)
- [patchValue](KeyworkDocumentReference.md#patchvalue)
- [putValue](KeyworkDocumentReference.md#putvalue)

## Constructors

### constructor

• **new KeyworkDocumentReference**<`ExpectedType`\>(`kvNamespace`, `relativeDocPath`, `parentCollection?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends {} \| [`DeserializationTypes`](../modules.md#deserializationtypes) = `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `kvNamespace` | `KVNamespace`<`string`\> |
| `relativeDocPath` | `string` |
| `parentCollection?` | [`KeyworkCollection`](KeyworkCollection.md)<`ExpectedType`\> |

#### Defined in

[collections/src/KeyworkDocumentReference.ts:60](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentReference.ts#L60)

## Properties

### absoluteDocPath

• `Readonly` **absoluteDocPath**: `string`

A POSIX-style, absolute path to a document.

#### Defined in

[collections/src/KeyworkDocumentReference.ts:58](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentReference.ts#L58)

___

### kvNamespace

• `Protected` `Readonly` **kvNamespace**: `KVNamespace`<`string`\>

___

### parentCollection

• `Protected` `Optional` `Readonly` **parentCollection**: [`KeyworkCollection`](KeyworkCollection.md)<`ExpectedType`\>

___

### relativeDocPath

• `Readonly` **relativeDocPath**: `string`

A POSIX-style, relative path to a document from a parent collection

#### Defined in

[collections/src/KeyworkDocumentReference.ts:55](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentReference.ts#L55)

## Methods

### fetchSnapshot

▸ **fetchSnapshot**(`options?`): `Promise`<[`KeyworkDocumentSnapshot`](../modules.md#keyworkdocumentsnapshot)<`ExpectedType`\>\>

Attempts to fetch a `KeyworkDocumentSnapshot` associated with the `docPath`.

**`remarks`** If the `deserializeAs` option is not set,
the type will attempt to be inferred from the parent collection's known metadata.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`KeyworkDocumentFetchOptions`](../interfaces/KeyworkDocumentFetchOptions.md) |

#### Returns

`Promise`<[`KeyworkDocumentSnapshot`](../modules.md#keyworkdocumentsnapshot)<`ExpectedType`\>\>

#### Defined in

[collections/src/KeyworkDocumentReference.ts:78](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentReference.ts#L78)

___

### patchValue

▸ **patchValue**<`E`\>(`nextValue`, `options?`, `snapshot?`, `deepMergeOptions?`): `Promise`<[`KeyworkDocumentReference`](KeyworkDocumentReference.md)<`ExpectedType`\>\>

Updates the data associated with this document's path.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `ExpectedType` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nextValue` | `Partial`<`E`\> | If this document refers to an existing JSON-like object, it will be patched rather than replaced. |
| `options?` | [`PutOrPatchOptions`](../interfaces/PutOrPatchOptions.md) | - |
| `snapshot?` | [`KeyworkDocumentSnapshot`](../modules.md#keyworkdocumentsnapshot)<`E`\> | An optional JSON-like snapshot to merged |
| `deepMergeOptions?` | `Options` | Options passed to `deepMerge` |

#### Returns

`Promise`<[`KeyworkDocumentReference`](KeyworkDocumentReference.md)<`ExpectedType`\>\>

#### Defined in

[collections/src/KeyworkDocumentReference.ts:169](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentReference.ts#L169)

___

### putValue

▸ **putValue**<`E`\>(`nextValue`, `putOptions?`): `Promise`<[`KeyworkDocumentReference`](KeyworkDocumentReference.md)<`ExpectedType`\>\>

Overwrites the entire entity if it already exists, and creates a new resource if it doesn’t exist.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | `ExpectedType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `nextValue` | `Partial`<`E`\> |
| `putOptions?` | [`PutOrPatchOptions`](../interfaces/PutOrPatchOptions.md) |

#### Returns

`Promise`<[`KeyworkDocumentReference`](KeyworkDocumentReference.md)<`ExpectedType`\>\>

#### Defined in

[collections/src/KeyworkDocumentReference.ts:121](https://github.com/nirrius/keywork/blob/3dc0058/packages/collections/src/KeyworkDocumentReference.ts#L121)
