---
title: "Interface: PathPattern"
sidebar_label: "PathPattern"
sidebar_class_name: "doc-kind-interface"
---

# Interface: PathPattern<Path\>

[keywork](../modules/keywork).PathPattern

A PathPattern is used to match on some portion of a URL pathname.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Path` | extends `string` = `string` |

## Properties

### caseSensitive

• `Optional` **caseSensitive**: `boolean`

Should be `true` if the static portions of the `path` should be matched in
the same case.

#### Defined in

packages/utils/dist/index.d.ts:504

___

### end

• `Optional` **end**: `boolean`

Should be `true` if this pattern should match the entire URL pathname.

#### Defined in

packages/utils/dist/index.d.ts:508

___

### path

• **path**: `Path`

A string to match against a URL pathname. May contain `:id`-style segments
to indicate placeholders for dynamic parameters. May also end with `/*` to
indicate matching the rest of the URL pathname.

#### Defined in

packages/utils/dist/index.d.ts:499
