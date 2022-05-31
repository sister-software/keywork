# Interface: EntityToETagOptions

## Table of contents

### Properties

- [weak](EntityToETagOptions.md#weak)

## Properties

### weak

• `Optional` **weak**: `boolean`

Indicates that a weak validator is used.
Weak etags are easy to generate, but are far less useful for comparisons.
Strong validators are ideal for comparisons but can be very difficult to generate efficiently.
Weak ETag values of two representations of the same resources might be semantically equivalent,
but not byte-for-byte identical.
This means weak etags prevent caching when byte range requests are used,
but strong etags mean range requests can still be cached.

#### Defined in

[src/etags/generateETag.ts:29](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/etags/generateETag.ts#L29)
