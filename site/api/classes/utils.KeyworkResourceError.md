# Class: KeyworkResourceError

[utils](../modules/utils.md).KeyworkResourceError

An error class that feels fits nicely into an incoming HTTP request handler.
This pairs well with the `http-status-codes` NPM package.

**`example`**
Check if a user has permission to do some action.

```typescript
if (isLoggedIn(someUser))
  throw new KeyworkResourceError("You must be logged in to do that", StatusCodes.UNAUTHORIZED)
}
if (someUser.role !== 'admin')
  throw new KeyworkResourceError("Only an admin can access that", StatusCodes.FORBIDDEN)
}
```

## Hierarchy

- `Error`

  ↳ **`KeyworkResourceError`**

## Table of contents

### Constructors

- [constructor](utils.KeyworkResourceError.md#constructor)

### Properties

- [status](utils.KeyworkResourceError.md#status)
- [statusText](utils.KeyworkResourceError.md#statustext)

### Accessors

- [message](utils.KeyworkResourceError.md#message)

### Methods

- [toJSON](utils.KeyworkResourceError.md#tojson)
- [fromUnknownError](utils.KeyworkResourceError.md#fromunknownerror)

## Constructors

### constructor

• **new KeyworkResourceError**(`statusText`, `status?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `statusText` | `string` | `undefined` |
| `status` | `number` | `StatusCodes.INTERNAL_SERVER_ERROR` |

#### Overrides

Error.constructor

#### Defined in

[packages/utils/src/errors.ts:39](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/errors.ts#L39)

## Properties

### status

• **status**: `number` = `StatusCodes.INTERNAL_SERVER_ERROR`

___

### statusText

• **statusText**: `string`

## Accessors

### message

• `get` **message**(): `string`

#### Returns

`string`

#### Overrides

Error.message

#### Defined in

[packages/utils/src/errors.ts:43](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/errors.ts#L43)

## Methods

### toJSON

▸ **toJSON**(): [`ErrorJSONBody`](../interfaces/utils.ErrorJSONBody.md)

#### Returns

[`ErrorJSONBody`](../interfaces/utils.ErrorJSONBody.md)

#### Defined in

[packages/utils/src/errors.ts:47](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/errors.ts#L47)

___

### fromUnknownError

▸ `Static` **fromUnknownError**(`_error`): [`KeyworkResourceError`](utils.KeyworkResourceError.md)

Attempts to convert an unknown error object into a well-formed `KeyworkResourceError`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_error` | `any` |

#### Returns

[`KeyworkResourceError`](utils.KeyworkResourceError.md)

#### Defined in

[packages/utils/src/errors.ts:57](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/errors.ts#L57)
