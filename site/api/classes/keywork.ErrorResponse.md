---
title: "Class: ErrorResponse"
sidebar_label: "ErrorResponse"
sidebar_class_name: "doc-kind-class"
---

# Class: ErrorResponse

[keywork](../modules/keywork).ErrorResponse

An error response sent to a client when a request is invalid in some way.

**`remarks`** If an error object is available and publically visible,
consider [ErrorResponse.fromUnknownError](keywork.ErrorResponse#fromunknownerror)

## Hierarchy

- `Response`

  ↳ **`ErrorResponse`**

## Constructors

### constructor

• **new ErrorResponse**(`status?`, `statusText?`, `body?`, `headersInit?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `status?` | `number` |
| `statusText?` | `string` |
| `body?` | ``null`` \| `BodyInit` |
| `headersInit?` | `HeadersInit` |

#### Overrides

Response.constructor

#### Defined in

packages/keywork/dist/index.d.ts:150

## Properties

### body

• `Readonly` **body**: ``null`` \| `ReadableStream`

#### Inherited from

Response.body

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:108

___

### bodyUsed

• `Readonly` **bodyUsed**: `boolean`

#### Inherited from

Response.bodyUsed

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:109

___

### cf

• `Optional` `Readonly` **cf**: `Object`

#### Inherited from

Response.cf

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1460

___

### headers

• `Readonly` **headers**: `Headers`

#### Inherited from

Response.headers

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1455

___

### ok

• `Readonly` **ok**: `boolean`

#### Inherited from

Response.ok

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1456

___

### redirected

• `Readonly` **redirected**: `boolean`

#### Inherited from

Response.redirected

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1457

___

### status

• `Readonly` **status**: `number`

#### Inherited from

Response.status

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1453

___

### statusText

• `Readonly` **statusText**: `string`

#### Inherited from

Response.statusText

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1454

___

### url

• `Readonly` **url**: `string`

#### Inherited from

Response.url

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1458

___

### webSocket

• `Readonly` **webSocket**: ``null`` \| `WebSocket`

#### Inherited from

Response.webSocket

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1459

## Methods

### arrayBuffer

▸ **arrayBuffer**(): `Promise`<`ArrayBuffer`\>

#### Returns

`Promise`<`ArrayBuffer`\>

#### Inherited from

Response.arrayBuffer

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:110

___

### blob

▸ **blob**(): `Promise`<`Blob`\>

#### Returns

`Promise`<`Blob`\>

#### Inherited from

Response.blob

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:114

___

### clone

▸ **clone**(): `Response`

#### Returns

`Response`

#### Inherited from

Response.clone

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1452

___

### formData

▸ **formData**(): `Promise`<`FormData`\>

#### Returns

`Promise`<`FormData`\>

#### Inherited from

Response.formData

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

Response.json

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:112

___

### text

▸ **text**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Inherited from

Response.text

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:111

___

### fromUnknownError

▸ `Static` **fromUnknownError**(`_error`, `publicReason?`): [`ErrorResponse`](keywork.ErrorResponse)

Given an error-like object, attempt respond with a `KeyworkResourceError`.

**`example`**
Handling a error from an incoming request.

```ts
try {
  result = await fetchFoobarResource()
} catch (error) {
  // Log the error internally...
  console.error(error)

  // Respond with a public reason...
  return ErrorResponse.fromUnknownError(error, 'An error occured while fetching foobar.')
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `_error` | `any` |
| `publicReason?` | `string` |

#### Returns

[`ErrorResponse`](keywork.ErrorResponse)

#### Defined in

packages/keywork/dist/index.d.ts:177

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

Response.redirect

#### Defined in

node_modules/@cloudflare/workers-types/index.d.ts:1451
