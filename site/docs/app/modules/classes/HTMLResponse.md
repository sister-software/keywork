# Class: HTMLResponse

A cachable request containing HTML content.

## Hierarchy

- [`CachableResponse`](CachableResponse.md)

  ↳ **`HTMLResponse`**

## Table of contents

### Constructors

- [constructor](HTMLResponse.md#constructor)

## Constructors

### constructor

• **new HTMLResponse**(`htmlContent`, `request?`, `etag?`, `cacheControlOptions?`, `headersInit?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `htmlContent` | `string` \| `ReadableStream` |
| `request?` | `Request` |
| `etag?` | `string` |
| `cacheControlOptions?` | [`CacheControlDirectives`](../interfaces/CacheControlDirectives.md) |
| `headersInit?` | `HeadersInit` |

#### Overrides

[CachableResponse](CachableResponse.md).[constructor](CachableResponse.md#constructor)

#### Defined in

[src/responses/HTMLResponse.ts:24](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/responses/HTMLResponse.ts#L24)
