# Class: SnowflakeID

A basic implementation of Twitter's original Snowflake ID system.

## Table of contents

### Constructors

- [constructor](SnowflakeID.md#constructor)

### Properties

- [lastTime](SnowflakeID.md#lasttime)
- [mid](SnowflakeID.md#mid)
- [offset](SnowflakeID.md#offset)
- [seq](SnowflakeID.md#seq)

### Methods

- [generate](SnowflakeID.md#generate)

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

[src/ids/SnowflakeID.ts:26](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/ids/SnowflakeID.ts#L26)

## Properties

### lastTime

• `Private` **lastTime**: `number`

#### Defined in

[src/ids/SnowflakeID.ts:24](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/ids/SnowflakeID.ts#L24)

___

### mid

• `Private` **mid**: `number`

#### Defined in

[src/ids/SnowflakeID.ts:22](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/ids/SnowflakeID.ts#L22)

___

### offset

• `Private` **offset**: `number`

#### Defined in

[src/ids/SnowflakeID.ts:23](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/ids/SnowflakeID.ts#L23)

___

### seq

• `Private` **seq**: `number`

#### Defined in

[src/ids/SnowflakeID.ts:21](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/ids/SnowflakeID.ts#L21)

## Methods

### generate

▸ **generate**(): `string`

#### Returns

`string`

#### Defined in

[src/ids/SnowflakeID.ts:33](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/ids/SnowflakeID.ts#L33)
