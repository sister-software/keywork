---
title: "Class: PrefixedLogger"
sidebar_label: "PrefixedLogger"
sidebar_class_name: "doc-kind-class"
---

# Class: PrefixedLogger

[utils](../modules/utils).PrefixedLogger

A isomorphic logger available in the browser and worker environment.

**`example`**
```ts
const logger = new PrefixedLogger('Todo API')
logger.info('Fetching todo', todoID)
logger.error('Unexpected error')
```

## Constructors

### constructor

• **new PrefixedLogger**(`logPrefix`, `color?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `logPrefix` | `string` | `undefined` |
| `color` | `string` | `'cyan'` |

#### Defined in

[packages/utils/src/logger.ts:59](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L59)

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

[packages/utils/src/logger.ts:52](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L52)

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

[packages/utils/src/logger.ts:51](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L51)

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

[packages/utils/src/logger.ts:57](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L57)

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

[packages/utils/src/logger.ts:55](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L55)

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

[packages/utils/src/logger.ts:54](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L54)

___

### logPrefix

• `Protected` **logPrefix**: `string`

#### Defined in

[packages/utils/src/logger.ts:50](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L50)

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

[packages/utils/src/logger.ts:56](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L56)

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

[packages/utils/src/logger.ts:90](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L90)

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

[packages/utils/src/logger.ts:99](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L99)

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

[packages/utils/src/logger.ts:104](https://github.com/nirrius/keywork/blob/6b5e3cc/packages/utils/src/logger.ts#L104)
