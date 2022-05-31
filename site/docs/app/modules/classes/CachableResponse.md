# Class: CachableResponse

A client-side cachable response.

**`remarks`** Etag caching is supported when `CachableResponse` is constructed with the needed parameters.
You may want to disable caching in your browser development tools to avoid this behavior while debugging.

## Hierarchy

- `Response`

  ↳ **`CachableResponse`**

  ↳↳ [`HTMLResponse`](HTMLResponse.md)

  ↳↳ [`JSONResponse`](JSONResponse.md)

## Table of contents

### Constructors

- [constructor](CachableResponse.md#constructor)

## Constructors

### constructor

• **new CachableResponse**(`body`, `request?`, `etag?`, `cacheControlOptions?`, `headersInit?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | ``null`` \| `BodyInit` |
| `request?` | `Request` |
| `etag?` | ``null`` \| `string` |
| `cacheControlOptions?` | `Partial`<[`CacheControlDirectives`](../interfaces/CacheControlDirectives.md)\> |
| `headersInit?` | `HeadersInit` |

#### Overrides

Response.constructor

#### Defined in

[src/responses/CachableResponse.ts:29](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/responses/CachableResponse.ts#L29)
