---
id: middleware
title: Middleware
sidebar_label: Middleware
---

_Middleware_ are instances of `KeyworkRouter`, each with single responsibility
e.g. (users, blog posts, payments, authentication, etc.)

```ts
import { UsersRouter } from '@local/worker/routers/UsersRouter'
import { BlogRouter } from '@local/worker/routers/BlogRouter'
import { AuthenticationRouter } from '@local/worker/routers/AuthenticationRouter'
import { CloudflarePagesAssetRouter } from 'keywork/assets'
import { KeyworkRouter } from 'keywork/router'

// Create a router to receive all incoming requests...
const app = new KeyworkRouter({
  // Here we combine our routers...
  // highlight-start
  middleware: [
    AuthenticationRouter,
    UsersRouter,
    BlogRouter,
    // And serve static assets...
    new CloudflarePagesAssetRouter(),
  ],
  // highlight-end
})
```

Middleware routers can perform any task that of single router:

- Execute any code
- Make changes to the request and the response of another router
- Terminate a request
- Call the next route handler in the stack

## Advanced Usage

### Fetchers and environment bindings

Middleware can also be thought of as any object that implements the `KeyworkFetcher` interface.
Under the hood, `KeyworkRouter` _is_ a `KeyworkFetcher`, and is the most common usage
of middleware.

Environment bindings _almost_ satisfy the `KeyworkFetcher` interface,
and with the help of the `ServiceBindingRouter` class, can be used as middleware.

### Combining Multiple Workers

The `ServiceBindingRouter` class proxies requests directly to an environment binding,
such as a service binding configured in your project's `wrangler.toml`,
allowing you to compose your app from multiple Workers, regardless if they use Keywork or not.
