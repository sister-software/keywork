---
title: "Interface: PathMatch"
sidebar_label: "PathMatch"
sidebar_class_name: "doc-kind-interface"
---

# Interface: PathMatch<ExpectedParams\>

[keywork](../modules/keywork).PathMatch

A PathMatch contains info about how a PathPattern matched on a URL pathname.

## Type parameters

| Name | Type |
| :------ | :------ |
| `ExpectedParams` | extends {} \| ``null`` = ``null`` |

## Properties

### params

• **params**: `ExpectedParams`

The names and values of dynamic parameters in the URL.

#### Defined in

packages/utils/dist/index.d.ts:461

___

### pathname

• **pathname**: `string`

The portion of the URL pathname that was matched.

#### Defined in

packages/utils/dist/index.d.ts:465

___

### pathnameBase

• **pathnameBase**: `string`

The portion of the URL pathname that was matched before child routes.

#### Defined in

packages/utils/dist/index.d.ts:469

___

### pattern

• **pattern**: [`PathPattern`](keywork.PathPattern)<`string`\>

The pattern that was used to match.

#### Defined in

packages/utils/dist/index.d.ts:473
