# Interface: PathPattern<Path\>

A PathPattern is used to match on some portion of a URL pathname.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Path` | extends `string` = `string` |

## Table of contents

### Properties

- [caseSensitive](PathPattern.md#casesensitive)
- [end](PathPattern.md#end)
- [path](PathPattern.md#path)

## Properties

### caseSensitive

• `Optional` **caseSensitive**: `boolean`

Should be `true` if the static portions of the `path` should be matched in
the same case.

#### Defined in

[src/paths/common.ts:29](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L29)

___

### end

• `Optional` **end**: `boolean`

Should be `true` if this pattern should match the entire URL pathname.

#### Defined in

[src/paths/common.ts:33](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L33)

___

### path

• **path**: `Path`

A string to match against a URL pathname. May contain `:id`-style segments
to indicate placeholders for dynamic parameters. May also end with `/*` to
indicate matching the rest of the URL pathname.

#### Defined in

[src/paths/common.ts:24](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/paths/common.ts#L24)
