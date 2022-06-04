# Interface: PathMatch<ExpectedParams\>

[keywork](../modules/keywork.md).PathMatch

A PathMatch contains info about how a PathPattern matched on a URL pathname.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedParams` | extends {} \| ``null`` = ``null`` |

## Table of contents

### Properties

- [params](keywork.PathMatch.md#params)
- [pathname](keywork.PathMatch.md#pathname)
- [pathnameBase](keywork.PathMatch.md#pathnamebase)
- [pattern](keywork.PathMatch.md#pattern)

## Properties

### params

• **params**: `ExpectedParams`

The names and values of dynamic parameters in the URL.

#### Defined in

packages/keywork/dist/index.d.ts:491

___

### pathname

• **pathname**: `string`

The portion of the URL pathname that was matched.

#### Defined in

packages/keywork/dist/index.d.ts:495

___

### pathnameBase

• **pathnameBase**: `string`

The portion of the URL pathname that was matched before child routes.

#### Defined in

packages/keywork/dist/index.d.ts:499

___

### pattern

• **pattern**: [`PathPattern`](keywork.PathPattern.md)<`string`\>

The pattern that was used to match.

#### Defined in

packages/keywork/dist/index.d.ts:503
