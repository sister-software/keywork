---
title: Overview
sidebar_label: Module Overview
tags: ['Module']
sidebar_position: 0
pagination_label: 'Module: Errors'
---

## Module Overview

Keywork includes error utilities that pair nicely with HTTP request handlers.

```ts
import { KeyworkResourceError, StatusCodes } from 'keywork/errors'

if (isLoggedIn(someUser)) {
  throw new KeyworkResourceError('You must be logged in to do that', StatusCodes.UNAUTHORIZED)
}

if (someUser.role !== 'admin') {
  throw new KeyworkResourceError('Only an admin can access that', StatusCodes.FORBIDDEN)
}
```

## Related Entries

- [`ErrorResponse`](/modules/http/response/api/classes/ErrorResponse)
