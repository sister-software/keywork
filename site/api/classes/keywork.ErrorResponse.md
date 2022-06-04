# Class: ErrorResponse

[keywork](../modules/keywork.md).ErrorResponse

An error response sent to a client when a request is invalid in some way.

**`remarks`** If an error object is available and publically visible,
consider [ErrorResponse.fromUnknownError](keywork.ErrorResponse.md#fromunknownerror)

## Hierarchy

- `Response`

  ↳ **`ErrorResponse`**

## Table of contents

### Constructors

- [constructor](keywork.ErrorResponse.md#constructor)

### Methods

- [fromUnknownError](keywork.ErrorResponse.md#fromunknownerror)

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

## Methods

### fromUnknownError

▸ `Static` **fromUnknownError**(`_error`, `publicReason?`): [`ErrorResponse`](keywork.ErrorResponse.md)

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

[`ErrorResponse`](keywork.ErrorResponse.md)

#### Defined in

packages/keywork/dist/index.d.ts:177
