---
title: "Interface: CollectionDocumentReferencesResponse"
sidebar_label: "CollectionDocumentReferencesResponse"
sidebar_class_name: "doc-kind-interface"
---

# Interface: CollectionDocumentReferencesResponse<ExpectedType\>

[collections](../modules/collections).CollectionDocumentReferencesResponse

## Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedType` | extends [`DeserializationTypes`](../modules/collections#deserializationtypes) \| {} |

## Hierarchy

- `KVNamespaceListResult`<`unknown`\>

  ↳ **`CollectionDocumentReferencesResponse`**

## Properties

### cursor

• `Optional` **cursor**: `string`

#### Inherited from

KVNamespaceListResult.cursor

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:955

___

### documents

• **documents**: [`KeyworkDocumentReference`](../classes/collections.KeyworkDocumentReference)<`ExpectedType`\>[]

#### Defined in

[packages/collections/src/KeyworkCollection/common.ts:22](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/collections/src/KeyworkCollection/common.ts#L22)

___

### keys

• **keys**: `KVNamespaceListKey`<`unknown`\>[]

#### Inherited from

KVNamespaceListResult.keys

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:953

___

### list\_complete

• **list\_complete**: `boolean`

#### Inherited from

KVNamespaceListResult.list\_complete

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:954
