# Interface: PathPattern<Path\>

[keywork](../modules/keywork.md).PathPattern

A PathPattern is used to match on some portion of a URL pathname.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Path` | extends `string` = `string` |

## Table of contents

### Properties

- [caseSensitive](keywork.PathPattern.md#casesensitive)
- [end](keywork.PathPattern.md#end)
- [path](keywork.PathPattern.md#path)

## Properties

### caseSensitive

• `Optional` **caseSensitive**: `boolean`

Should be `true` if the static portions of the `path` should be matched in
the same case.

#### Defined in

packages/keywork/dist/index.d.ts:534

___

### end

• `Optional` **end**: `boolean`

Should be `true` if this pattern should match the entire URL pathname.

#### Defined in

packages/keywork/dist/index.d.ts:538

___

### path

• **path**: `Path`

A string to match against a URL pathname. May contain `:id`-style segments
to indicate placeholders for dynamic parameters. May also end with `/*` to
indicate matching the rest of the URL pathname.

#### Defined in

packages/keywork/dist/index.d.ts:529
