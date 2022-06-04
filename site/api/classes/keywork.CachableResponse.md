# Class: CachableResponse

[keywork](../modules/keywork.md).CachableResponse

A client-side cachable response.

**`remarks`** Etag caching is supported when `CachableResponse` is constructed with the needed parameters.
You may want to disable caching in your browser development tools to avoid this behavior while debugging.

## Hierarchy

- `Response`

  ↳ **`CachableResponse`**

  ↳↳ [`HTMLResponse`](keywork.HTMLResponse.md)

  ↳↳ [`JSONResponse`](keywork.JSONResponse.md)

## Table of contents

### Constructors

- [constructor](keywork.CachableResponse.md#constructor)

## Constructors

### constructor

• **new CachableResponse**(`body`, `request?`, `etag?`, `cacheControlOptions?`, `headersInit?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | ``null`` \| `BodyInit` |
| `request?` | `Request` |
| `etag?` | ``null`` \| `string` |
| `cacheControlOptions?` | `Partial`<[`CacheControlDirectives`](../interfaces/keywork.CacheControlDirectives.md)\> |
| `headersInit?` | `HeadersInit` |

#### Overrides

Response.constructor

#### Defined in

packages/keywork/dist/index.d.ts:19
