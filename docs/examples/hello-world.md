---
id: hello-world
title: Keywork says "Hello!"
sidebar_position: 1
sidebar_label: Hello World
---

Building your web app in a Workers environment can be intimidating,
especially so if you're unfamiliar with the quirks and limitations of V8.

We're going to create a single Worker that sends the browser a "hello world" response.
By the end of this example, you'll know how to use the [`KeyworkRouter`](/modules/router/api/classes/KeyworkRouter)
class to handling incoming requests from the browser.

:::info
If you're already familiar with Cloudflare Workers, this might seem like a bit of review.
And if you'd just like to skip a full example, checkout the [example repo](https://github.com/nirrius/keywork-starter-kit).

:::

## Handling incoming requests

The core focus of Keywork is the routing of incoming HTTP requests from the user's browser
to your app's router endpoints.

1. Create a router to receive incoming requests
2. Define a incoming request handler for a specific route
3. Export the router as the default entrypoint of your worker bundle
4. A user sends incoming request from the browser, e.g. `http://localhost:8788/`
5. The Worker runtime receives the request
6. Keywork parses the request into an `IsomorphicFetchEvent` and sends the data to your route handler callback
7. Your incoming request handler returns "Hello world"

:::info
Heads up! While optional, Keywork is a TypeScript-first library.
Examples are always written with type annotations, but they can be omitted if you'd like.

:::

### Create a router to receive all incoming requests

Building our app starts with the [`KeyworkRouter`](/modules/router/api/classes/KeyworkRouter)
class.

```ts title="worker.ts" showLineNumbers
import { KeyworkRouter } from 'keywork/router'

// highlight-next-line
const app = new KeyworkRouter()

// Continue...
```

### Define a incoming request handler

Much like other web libraries such as Express.js,
we can configure our router to handle incoming requests via the `app.get` method.

In our small example, we only need to define a single route handler:

```ts title="worker.ts" showLineNumbers
import { KeyworkRouter } from 'keywork/router'

// Create a router to receive all incoming requests...
const app = new KeyworkRouter()

// e.g. GET http://example.com/
// highlight-start
app.get('/', () => {
  // highlight-end
  return 'Hello from Keywork'
})

export default app
```

We call `app.get` with a path pattern matching the root of our app,
along with a [`RouteRequestHandler`](/modules/router/route/api/interfaces/RouteRequestHandler)
callback that executes when our app receives a matching incoming request.

#### Exporting the router

Notice that we use `export default` on `app`?
This instructs Cloudflare's Worker runtime to direct all incoming requests to our handler.
Remember, while you may import other modules, a bundler tool like ESBuild or Webpack
will always create a single file with the one instance of `export default`.

If you're familiar with Worker Sites, or Cloudflare Pages, you may have noticed that
`KeyworkRouter` reduces much of the low-level boilerplate.
The Keywork API attempts to bridge the gap between existing web development patterns,
and the native Worker API.

## Advanced Usage

### Using the `IsomorphicFetchEvent` object

When defining a route's `RouteRequestHandler` callback, you have access to an [`IsomorphicFetchEvent`](/modules/events/api/classes/IsomorphicFetchEvent) that contains information about the request.

In this example, let's use `IsomorphicFetchEvent` to return information about where the request originated:

```ts title="worker.ts" showLineNumbers
import { KeyworkRouter } from 'keywork/router'

// Create a router to receive all incoming requests...
const app = new KeyworkRouter()

// e.g. GET http://example.com/anything/goes/here
//highlight-next-line
app.get('*', (event) => {
  // Parse the incoming request URL...
  //highlight-next-line
  const url = new URL(event.request.url)

  //highlight-next-line
  return `Hello from ${url.pathname}`
})

export default app
```

:::tip
If you're building an app with multiple pages and API endpoints.
Splitting your app into multiple routers in their own files can keep your app managable.

:::

## Responding with type-safe JSON

Keywork gives us the optional type-safety of TypeScript.
Let's illustrate this feature by adding a JSON endpoint to our router:

```ts title=_worker.ts
import { KeyworkRouter } from 'keywork/router'

const app = new KeyworkRouter()

// Define a TypeScript interface to enforce the shape
interface HelloResponseBody {
  url: string
  date: string
  message: string
}

app.get('/hello.json', (event) => {
  const url = new URL(event.request.url)

  const body: HelloResponseBody = {
    url: url.toString(),
    date: new Date().toJSON(),
    message: 'Keywork rocks!',
  }

  return body
})

export default app
```
