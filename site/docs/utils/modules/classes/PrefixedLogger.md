# Class: PrefixedLogger

A isomorphic logger available in the browser and worker environment.

**`example`**
```ts
const logger = new PrefixedLogger('Todo API')
logger.info('Fetching todo', todoID)
logger.error('Unexpected error')
```

## Table of contents

### Constructors

- [constructor](PrefixedLogger.md#constructor)

### Properties

- [\_error](PrefixedLogger.md#_error)
- [\_log](PrefixedLogger.md#_log)
- [debug](PrefixedLogger.md#debug)
- [info](PrefixedLogger.md#info)
- [log](PrefixedLogger.md#log)
- [logPrefix](PrefixedLogger.md#logprefix)
- [warn](PrefixedLogger.md#warn)

### Methods

- [error](PrefixedLogger.md#error)
- [json](PrefixedLogger.md#json)
- [jsonEntries](PrefixedLogger.md#jsonentries)

## Constructors

### constructor

• **new PrefixedLogger**(`logPrefix`, `color?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `logPrefix` | `string` | `undefined` |
| `color` | `string` | `'cyan'` |

#### Defined in

[src/logger.ts:56](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L56)

## Properties

### \_error

• `Protected` **\_error**: (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`

#### Type declaration

▸ (`message?`, ...`optionalParams`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |
| `...optionalParams` | `any`[] |

##### Returns

`void`

#### Defined in

[src/logger.ts:49](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L49)

___

### \_log

• **\_log**: (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`

#### Type declaration

▸ (`message?`, ...`optionalParams`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |
| `...optionalParams` | `any`[] |

##### Returns

`void`

#### Defined in

[src/logger.ts:48](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L48)

___

### debug

• **debug**: (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`

#### Type declaration

▸ (`message?`, ...`optionalParams`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |
| `...optionalParams` | `any`[] |

##### Returns

`void`

#### Defined in

[src/logger.ts:54](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L54)

___

### info

• **info**: (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`

#### Type declaration

▸ (`message?`, ...`optionalParams`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |
| `...optionalParams` | `any`[] |

##### Returns

`void`

#### Defined in

[src/logger.ts:52](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L52)

___

### log

• **log**: (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`

#### Type declaration

▸ (`message?`, ...`optionalParams`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |
| `...optionalParams` | `any`[] |

##### Returns

`void`

#### Defined in

[src/logger.ts:51](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L51)

___

### logPrefix

• `Protected` **logPrefix**: `string`

#### Defined in

[src/logger.ts:47](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L47)

___

### warn

• **warn**: (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`

#### Type declaration

▸ (`message?`, ...`optionalParams`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |
| `...optionalParams` | `any`[] |

##### Returns

`void`

#### Defined in

[src/logger.ts:53](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L53)

## Methods

### error

▸ **error**(`error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `unknown` |

#### Returns

`void`

#### Defined in

[src/logger.ts:87](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L87)

___

### json

▸ **json**(`json`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `Object` |

#### Returns

`void`

#### Defined in

[src/logger.ts:96](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L96)

___

### jsonEntries

▸ **jsonEntries**<`T`\>(`label`, `json`, `key`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `label` | `string` |
| `json` | `Iterable`<`T`\> |
| `key` | keyof `T` |

#### Returns

`void`

#### Defined in

[src/logger.ts:101](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L101)
