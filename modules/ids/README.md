---
title: Overview
sidebar_label: Module Overview
tags: ['module']
sidebar_position: 0
pagination_label: 'Module: IDs'
---

## Module Overview

Keywork includes utilities for generating IDs.

### ULIDs

ULIDs are provided via [ULIDX](https://www.npmjs.com/package/ulidx)

```ts
import { ulid } from 'keywork/ids'

const id = ulid()
```

### Snowflake IDs

Keywork's `SnowflakeID` is a basic implementation of Twitter's original [Snowflake ID system](https://en.wikipedia.org/wiki/Snowflake_ID).

```ts
import { SnowflakeID } from 'keywork/ids'

const id = new SnowflakeID()
```
