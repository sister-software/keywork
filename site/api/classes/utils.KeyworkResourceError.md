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

[packages/utils/lib/errors/KeyworkResourceError.ts:36](https://github.com/nirrius/keywork/blob/73ad60a/packages/utils/lib/errors/KeyworkResourceError.ts#L36)

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

[packages/utils/lib/errors/KeyworkResourceError.ts:40](https://github.com/nirrius/keywork/blob/73ad60a/packages/utils/lib/errors/KeyworkResourceError.ts#L40)

## Methods

### toJSON

▸ **toJSON**(): [`ErrorJSONBody`](../interfaces/utils.ErrorJSONBody)

#### Returns

[`ErrorJSONBody`](../interfaces/utils.ErrorJSONBody)

#### Defined in

[packages/utils/lib/errors/KeyworkResourceError.ts:44](https://github.com/nirrius/keywork/blob/73ad60a/packages/utils/lib/errors/KeyworkResourceError.ts#L44)

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

[packages/utils/lib/errors/KeyworkResourceError.ts:54](https://github.com/nirrius/keywork/blob/73ad60a/packages/utils/lib/errors/KeyworkResourceError.ts#L54)
