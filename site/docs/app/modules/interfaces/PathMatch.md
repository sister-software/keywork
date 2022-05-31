# Interface: PathMatch<ExpectedParams\>

A PathMatch contains info about how a PathPattern matched on a URL pathname.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedParams` | extends {} \| ``null`` = ``null`` |

## Table of contents

### Properties

- [params](PathMatch.md#params)
- [pathname](PathMatch.md#pathname)
- [pathnameBase](PathMatch.md#pathnamebase)
- [pattern](PathMatch.md#pattern)

## Properties

### params

• **params**: `ExpectedParams`

The names and values of dynamic parameters in the URL.

#### Defined in

[src/paths/common.ts:43](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L43)

___

### pathname

• **pathname**: `string`

The portion of the URL pathname that was matched.

#### Defined in

[src/paths/common.ts:47](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L47)

___

### pathnameBase

• **pathnameBase**: `string`

The portion of the URL pathname that was matched before child routes.

#### Defined in

[src/paths/common.ts:51](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L51)

___

### pattern

• **pattern**: [`PathPattern`](PathPattern.md)<`string`\>

The pattern that was used to match.

#### Defined in

[src/paths/common.ts:55](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L55)
