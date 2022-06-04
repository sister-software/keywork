# Class: HTMLResponse

[keywork](../modules/keywork.md).HTMLResponse

A cachable request containing HTML content.

## Hierarchy

- [`CachableResponse`](keywork.CachableResponse.md)

  ↳ **`HTMLResponse`**

## Table of contents

### Constructors

- [constructor](keywork.HTMLResponse.md#constructor)

## Constructors

### constructor

• **new HTMLResponse**(`htmlContent`, `request?`, `etag?`, `cacheControlOptions?`, `headersInit?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `htmlContent` | `string` \| `ReadableStream` |
| `request?` | `Request` |
| `etag?` | `string` |
| `cacheControlOptions?` | [`CacheControlDirectives`](../interfaces/keywork.CacheControlDirectives.md) |
| `headersInit?` | `HeadersInit` |

#### Overrides

[CachableResponse](keywork.CachableResponse.md).[constructor](keywork.CachableResponse.md#constructor)

#### Defined in

packages/keywork/dist/index.d.ts:233
