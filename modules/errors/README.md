---
title: Errors
---

Error utilities that fit nicely into an incoming HTTP request handler.

```ts
import { KeyworkResourceError, StatusCodes } from 'keywork/errors'

if (isLoggedIn(someUser)) {
  throw new KeyworkResourceError("You must be logged in to do that", StatusCodes.UNAUTHORIZED)
}

if (someUser.role !== 'admin') {
  throw new KeyworkResourceError("Only an admin can access that", StatusCodes.FORBIDDEN)
}
```

## Related Entries

- [`ErrorResponse`](/docs/modules/http/response/classes/ErrorResponse)
