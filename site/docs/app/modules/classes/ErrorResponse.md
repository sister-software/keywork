# Class: ErrorResponse

An error response sent to a client when a request is invalid in some way.

**`remarks`** If an error object is available and publically visible,
consider [ErrorResponse.fromUnknownError](ErrorResponse.md#fromunknownerror)

## Hierarchy

- `Response`

  ↳ **`ErrorResponse`**

## Table of contents

### Constructors

- [constructor](ErrorResponse.md#constructor)

### Methods

- [fromUnknownError](ErrorResponse.md#fromunknownerror)

## Constructors

### constructor

• **new ErrorResponse**(`status?`, `statusText?`, `body?`, `headersInit?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `status` | `number` | `StatusCodes.INTERNAL_SERVER_ERROR` |
| `statusText` | `string` | `undefined` |
| `body?` | ``null`` \| `BodyInit` | `undefined` |
| `headersInit?` | `HeadersInit` | `undefined` |

#### Overrides

Response.constructor

#### Defined in

[src/responses/ErrorResponse.ts:26](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/responses/ErrorResponse.ts#L26)

## Methods

### fromUnknownError

▸ `Static` **fromUnknownError**(`_error`, `publicReason?`): [`ErrorResponse`](ErrorResponse.md)

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

[`ErrorResponse`](ErrorResponse.md)

#### Defined in

[src/responses/ErrorResponse.ts:61](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/responses/ErrorResponse.ts#L61)
