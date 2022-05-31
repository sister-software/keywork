# Keywork

## Table of contents

### Namespaces

- [timestamp](modules/timestamp.md)

### Enumerations

- [KeyworkQueryParamKeys](enums/KeyworkQueryParamKeys.md)

### Classes

- [KeyworkResourceError](classes/KeyworkResourceError.md)
- [PrefixedLogger](classes/PrefixedLogger.md)
- [SnowflakeID](classes/SnowflakeID.md)

### Interfaces

- [ErrorJSONBody](interfaces/ErrorJSONBody.md)
- [GlobalConsoleLike](interfaces/GlobalConsoleLike.md)

### Type Aliases

- [PathBuilder](modules.md#pathbuilder)
- [PrettyJSON](modules.md#prettyjson)

### Variables

- [DURATION\_FIVE\_MINUTES](modules.md#duration_five_minutes)
- [DURATION\_ONE\_DAY](modules.md#duration_one_day)
- [DURATION\_ONE\_HOUR](modules.md#duration_one_hour)
- [DURATION\_ONE\_WEEK](modules.md#duration_one_week)
- [timestamp](modules.md#timestamp)

### Functions

- [arrayBufferToString](modules.md#arraybuffertostring)
- [prettyJSON](modules.md#prettyjson-1)
- [resolveDocPath](modules.md#resolvedocpath)
- [stringToArrayBuffer](modules.md#stringtoarraybuffer)

## Type Aliases

### PathBuilder

Ƭ **PathBuilder**: (...`collectionPath`: (`string` \| `undefined`)[]) => `string`

#### Type declaration

▸ (...`collectionPath`): `string`

**`file`** This file is part of the Keywork project.

**`copyright`** Nirrius, LLC. All rights reserved.

**`author`** Teffen Ellis, et al.

**`license`** AGPL-3.0

**`remarks`** Keywork is free software for non-commercial purposes.
You can be released from the requirements of the license by purchasing a commercial license.
Buying such a license is mandatory as soon as you develop commercial activities
involving the Keywork software without disclosing the source code of your own applications.

**`see`** LICENSE.md in the project root for further licensing information.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...collectionPath` | (`string` \| `undefined`)[] |

##### Returns

`string`

#### Defined in

[src/strings.ts:15](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/strings.ts#L15)

___

### PrettyJSON

Ƭ **PrettyJSON**: (...`args`: `Parameters`<typeof `JSON.stringify`\>) => `string`

#### Type declaration

▸ (...`args`): `string`

**`file`** This file is part of the Keywork project.

**`copyright`** Nirrius, LLC. All rights reserved.

**`author`** Teffen Ellis, et al.

**`license`** AGPL-3.0

**`remarks`** Keywork is free software for non-commercial purposes.
You can be released from the requirements of the license by purchasing a commercial license.
Buying such a license is mandatory as soon as you develop commercial activities
involving the Keywork software without disclosing the source code of your own applications.

**`see`** LICENSE.md in the project root for further licensing information.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `Parameters`<typeof `JSON.stringify`\> |

##### Returns

`string`

#### Defined in

[src/json.ts:15](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/json.ts#L15)

## Variables

### DURATION\_FIVE\_MINUTES

• `Const` **DURATION\_FIVE\_MINUTES**: `number`

5 minutes in milliseconds.

#### Defined in

[src/datetime.ts:16](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/datetime.ts#L16)

___

### DURATION\_ONE\_DAY

• `Const` **DURATION\_ONE\_DAY**: `number`

1 day in milliseconds.

#### Defined in

[src/datetime.ts:20](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/datetime.ts#L20)

___

### DURATION\_ONE\_HOUR

• `Const` **DURATION\_ONE\_HOUR**: `number`

1 hour in milliseconds.

#### Defined in

[src/datetime.ts:18](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/datetime.ts#L18)

___

### DURATION\_ONE\_WEEK

• `Const` **DURATION\_ONE\_WEEK**: `number`

1 week in milliseconds.

#### Defined in

[src/datetime.ts:22](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/datetime.ts#L22)

___

### timestamp

• `Const` **timestamp**: `Object`

#### Call signature

▸ (`date?`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Date` |

##### Returns

`string`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `toString` | () => `string` |

#### Defined in

[src/logger.ts:26](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/logger.ts#L26)

## Functions

### arrayBufferToString

▸ **arrayBufferToString**(`buf`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buf` | `ArrayBuffer` |

#### Returns

`string`

#### Defined in

[src/strings.ts:25](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/strings.ts#L25)

___

### prettyJSON

▸ **prettyJSON**(...`args`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [value: any, replacer?: null \| (string \| number)[], space?: string \| number] |

#### Returns

`string`

#### Defined in

[src/json.ts:17](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/json.ts#L17)

___

### resolveDocPath

▸ **resolveDocPath**(...`collectionPath`): `string`

Resolves a POSIX-like path into slash delineated segments.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...collectionPath` | (`undefined` \| `string`)[] |

#### Returns

`string`

#### Defined in

[src/strings.ts:18](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/strings.ts#L18)

___

### stringToArrayBuffer

▸ **stringToArrayBuffer**(`str`): `ArrayBuffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`ArrayBuffer`

#### Defined in

[src/strings.ts:29](https://github.com/nirrius/keywork/blob/3dc0058/packages/utils/src/strings.ts#L29)
