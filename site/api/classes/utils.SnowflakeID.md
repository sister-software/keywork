# Class: SnowflakeID

[utils](../modules/utils.md).SnowflakeID

A basic implementation of Twitter's original Snowflake ID system.

## Table of contents

### Constructors

- [constructor](utils.SnowflakeID.md#constructor)

### Properties

- [lastTime](utils.SnowflakeID.md#lasttime)
- [mid](utils.SnowflakeID.md#mid)
- [offset](utils.SnowflakeID.md#offset)
- [seq](utils.SnowflakeID.md#seq)

### Methods

- [generate](utils.SnowflakeID.md#generate)

## Constructors

### constructor

• **new SnowflakeID**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.mid?` | `number` |
| `options.offset?` | `number` |

#### Defined in

[packages/utils/src/ids/SnowflakeID.ts:26](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/ids/SnowflakeID.ts#L26)

## Properties

### lastTime

• `Private` **lastTime**: `number`

#### Defined in

[packages/utils/src/ids/SnowflakeID.ts:24](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/ids/SnowflakeID.ts#L24)

___

### mid

• `Private` **mid**: `number`

#### Defined in

[packages/utils/src/ids/SnowflakeID.ts:22](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/ids/SnowflakeID.ts#L22)

___

### offset

• `Private` **offset**: `number`

#### Defined in

[packages/utils/src/ids/SnowflakeID.ts:23](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/ids/SnowflakeID.ts#L23)

___

### seq

• `Private` **seq**: `number`

#### Defined in

[packages/utils/src/ids/SnowflakeID.ts:21](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/ids/SnowflakeID.ts#L21)

## Methods

### generate

▸ **generate**(): `string`

#### Returns

`string`

#### Defined in

[packages/utils/src/ids/SnowflakeID.ts:33](https://github.com/nirrius/keywork/blob/361509a/packages/utils/src/ids/SnowflakeID.ts#L33)
