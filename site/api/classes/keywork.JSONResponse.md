# Class: JSONResponse

[keywork](../modules/keywork.md).JSONResponse

A response sent to the client containing a JSON object.

**`remarks`** Etag caching is supported when `JSONResponse` is constructed with the needed parameters.
You may want to disable caching in your browser development tools to avoid this behavior while debugging.

## Hierarchy

- [`CachableResponse`](keywork.CachableResponse.md)

  ↳ **`JSONResponse`**

## Table of contents

### Constructors

- [constructor](keywork.JSONResponse.md#constructor)

## Constructors

### constructor

• **new JSONResponse**(`json`, `request?`, `etag?`, `cacheControlOptions?`, `headersInit?`, `pretty?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Object` |
| `request?` | `Request` |
| `etag?` | `string` |
| `cacheControlOptions?` | [`CacheControlDirectives`](../interfaces/keywork.CacheControlDirectives.md) |
| `headersInit?` | `HeadersInit` |
| `pretty?` | `boolean` |

#### Overrides

[CachableResponse](keywork.CachableResponse.md).[constructor](keywork.CachableResponse.md#constructor)

#### Defined in

packages/keywork/dist/index.d.ts:298
