---
title: "Class: JSONResponse"
sidebar_label: "JSONResponse"
sidebar_class_name: "doc-kind-class"
---

# Class: JSONResponse

[keywork](../modules/keywork).JSONResponse

A response sent to the client containing a JSON object.

**`remarks`** Etag caching is supported when `JSONResponse` is constructed with the needed parameters.
You may want to disable caching in your browser development tools to avoid this behavior while debugging.

## Hierarchy

- [`CachableResponse`](keywork.CachableResponse)

  ↳ **`JSONResponse`**

## Constructors

### constructor

• **new JSONResponse**(`json`, `request?`, `etag?`, `cacheControlOptions?`, `headersInit?`, `pretty?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Object` |
| `request?` | `Request` |
| `etag?` | `string` |
| `cacheControlOptions?` | [`CacheControlDirectives`](../interfaces/keywork.CacheControlDirectives) |
| `headersInit?` | `HeadersInit` |
| `pretty?` | `boolean` |

#### Overrides

[CachableResponse](keywork.CachableResponse).[constructor](keywork.CachableResponse#constructor)

#### Defined in

packages/utils/dist/index.d.ts:291

## Properties

### body

• `Readonly` **body**: ``null`` \| `ReadableStream`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[body](keywork.CachableResponse#body)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:108

___

### bodyUsed

• `Readonly` **bodyUsed**: `boolean`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[bodyUsed](keywork.CachableResponse#bodyused)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:109

___

### cf

• `Optional` `Readonly` **cf**: `Object`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[cf](keywork.CachableResponse#cf)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1460

___

### headers

• `Readonly` **headers**: `Headers`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[headers](keywork.CachableResponse#headers)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1455

___

### ok

• `Readonly` **ok**: `boolean`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[ok](keywork.CachableResponse#ok)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1456

___

### redirected

• `Readonly` **redirected**: `boolean`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[redirected](keywork.CachableResponse#redirected)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1457

___

### status

• `Readonly` **status**: `number`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[status](keywork.CachableResponse#status)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1453

___

### statusText

• `Readonly` **statusText**: `string`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[statusText](keywork.CachableResponse#statustext)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1454

___

### url

• `Readonly` **url**: `string`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[url](keywork.CachableResponse#url)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1458

___

### webSocket

• `Readonly` **webSocket**: ``null`` \| `WebSocket`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[webSocket](keywork.CachableResponse#websocket)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1459

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<`ArrayBuffer`\>

#### Returns

`Promise`<`ArrayBuffer`\>

#### Inherited from

[CachableResponse](keywork.CachableResponse).[arrayBuffer](keywork.CachableResponse#arraybuffer)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:110

___

### blob

▸ **blob**(): `Promise`<`Blob`\>

#### Returns

`Promise`<`Blob`\>

#### Inherited from

[CachableResponse](keywork.CachableResponse).[blob](keywork.CachableResponse#blob)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:114

___

### clone

▸ **clone**(): `Response`

#### Returns

`Response`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[clone](keywork.CachableResponse#clone)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1452

___

### formData

▸ **formData**(): `Promise`<`FormData`\>

#### Returns

`Promise`<`FormData`\>

#### Inherited from

[CachableResponse](keywork.CachableResponse).[formData](keywork.CachableResponse#formdata)

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

[CachableResponse](keywork.CachableResponse).[json](keywork.CachableResponse#json)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:112

___

### text

▸ **text**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Inherited from

[CachableResponse](keywork.CachableResponse).[text](keywork.CachableResponse#text)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:111

___

### redirect

▸ `Static` **redirect**(`url`, `status?`): `Response`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `status?` | `number` |

#### Returns

`Response`

#### Inherited from

[CachableResponse](keywork.CachableResponse).[redirect](keywork.CachableResponse#redirect)

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1451
