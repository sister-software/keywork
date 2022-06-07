---
title: "Class: KeyworkResourceError"
sidebar_label: "KeyworkResourceError"
sidebar_class_name: "doc-kind-class"
---

# Class: KeyworkResourceError

[utils](../modules/utils).KeyworkResourceError

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

[packages/utils/src/errors.ts:39](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/errors.ts#L39)

## Properties

### cause

• `Optional` **cause**: `Error`

#### Inherited from

Error.cause

#### Defined in

site/node_modules/typescript/lib/lib.es2022.error.d.ts:26

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

site/node_modules/typescript/lib/lib.es5.d.ts:1028

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

site/node_modules/typescript/lib/lib.es5.d.ts:1030

___

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

[packages/utils/src/errors.ts:43](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/errors.ts#L43)

## Methods

### toJSON

▸ **toJSON**(): [`ErrorJSONBody`](../interfaces/utils.ErrorJSONBody)

#### Returns

[`ErrorJSONBody`](../interfaces/utils.ErrorJSONBody)

#### Defined in

[packages/utils/src/errors.ts:47](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/errors.ts#L47)

___

### fromUnknownError

▸ `Static` **fromUnknownError**(`_error`): [`KeyworkResourceError`](utils.KeyworkResourceError)

Attempts to convert an unknown error object into a well-formed `KeyworkResourceError`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_error` | `any` |

#### Returns

[`KeyworkResourceError`](utils.KeyworkResourceError)

#### Defined in

[packages/utils/src/errors.ts:57](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/errors.ts#L57)
