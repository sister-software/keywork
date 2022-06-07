---
title: "Interface: RequestWithCFProperties"
sidebar_label: "RequestWithCFProperties"
sidebar_class_name: "doc-kind-interface"
---

# Interface: RequestWithCFProperties

[keywork](../modules/keywork).RequestWithCFProperties

## Hierarchy

- `Request`

  ↳ **`RequestWithCFProperties`**

## Properties

### body

• `Readonly` **body**: ``null`` \| `ReadableStream`

#### Inherited from

Request.body

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:108

___

### bodyUsed

• `Readonly` **bodyUsed**: `boolean`

#### Inherited from

Request.bodyUsed

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:109

___

### cf

• **cf**: `IncomingRequestCfProperties`

#### Overrides

Request.cf

#### Defined in

packages/keywork/dist/index.d.ts:531

___

### fetcher

• `Readonly` **fetcher**: ``null`` \| `Fetcher`

#### Inherited from

Request.fetcher

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1252

___

### headers

• `Readonly` **headers**: `Headers`

#### Inherited from

Request.headers

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1250

___

### method

• `Readonly` **method**: `string`

#### Inherited from

Request.method

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1248

___

### redirect

• `Readonly` **redirect**: `string`

#### Inherited from

Request.redirect

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1251

___

### signal

• `Readonly` **signal**: `AbortSignal`

#### Inherited from

Request.signal

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1253

___

### url

• `Readonly` **url**: `string`

#### Inherited from

Request.url

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1249

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<`ArrayBuffer`\>

#### Returns

`Promise`<`ArrayBuffer`\>

#### Inherited from

Request.arrayBuffer

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:110

___

### blob

▸ **blob**(): `Promise`<`Blob`\>

#### Returns

`Promise`<`Blob`\>

#### Inherited from

Request.blob

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:114

___

### clone

▸ **clone**(): `Request`

#### Returns

`Request`

#### Inherited from

Request.clone

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1247

___

### formData

▸ **formData**(): `Promise`<`FormData`\>

#### Returns

`Promise`<`FormData`\>

#### Inherited from

Request.formData

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:113

___

### json

▸ **json**<`T`\>(): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Returns

`Promise`<`T`\>

#### Inherited from

Request.json

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:112

___

### text

▸ **text**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Inherited from

Request.text

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:111
