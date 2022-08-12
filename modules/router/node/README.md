---
title: Routing using Node
tags: ['node', 'routing']
---

The [`KeyworkRouter`](/modules/router/api/classes/KeyworkRouter) can be made
compatible with Node with the [`createServerHandler`](/modules/router/node/api/functions/createServerHandler) wrapper function:

```ts showLineNumbers
import * as http from 'node:http'
import { KeyworkRouter } from 'keywork/router'
import { createServerHandler } from 'keywork/router/node'

// Create a router as you usually do...
// highlight-next-line
const router = new KeyworkRouter()
router.get('/', () => 'Hello from Node')

// And then wrap the router with `createServerHandler`
// highlight-next-line
http.createServer(createServerHandler(router))
```

:::caution
Node support is currently experimental and may change in the near future.
:::
