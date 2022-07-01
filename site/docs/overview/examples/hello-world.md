---
id: hello-world
title: Keywork says "Hello!"
sidebar_position: 1
sidebar_label: Hello World
---

Building a web app can be intimidating, so let's start with a small example:
A Keywork app that displays "hello world" in the browser.

By the end of this example, you'll know how to use the [`WorkerRouter`](/api/classes/routing.WorkerRouter)
class to handling incoming requests.

:::info
If you're already familiar with Cloudflare Workers, this might seem like a bit of review.
And if you'd just like to skip to the final result, checkout the [example repo](https://github.com/nirrius/keywork-example-react-esbuild).\_

:::

## Handling incoming requests

The core focus of Keywork is the routing of incoming HTTP requests from the user's browser,
to your app's router endpoints.

1. Define an incoming request handler class by extending `KeyworkRequestHandler`
2. Your Worker's entrypoint exports your class
3. A user sends incoming request from the browser, e.g. example.com
4. The Worker runtime sends the incoming data to your request handler class
5. Your incoming request handler returns a `Response` object.

:::info
Heads up! While optional, Keywork is a TypeScript-first library.
Examples are always written with type annotations, but they can be omitted if you'd like.

:::

### Define an incoming request handler

Building an app with Keywork starts creating a [`WorkerRouter`](/api/classes/routing.WorkerRouter)
class:

```ts title=_worker.ts
import { WorkerRouter } from 'keywork/routing'

// Create a router to receive all incoming requests...
const app = new WorkerRouter()

// e.g. GET http://example.com/
app.get('/', (event) => {
  // Parse the incoming request URL...
  const url = new URL(event.request.url)

  return `Hello from ${url.pathname}`
})

// Finally, export our router so that Cloudflare Workers can send our app requests...
export default app
```

Much like Express.js, we can define route handlers by invoking methods on `app` that correspond with HTTP methods:

```ts
GET    => app.get([path pattern], [RouteRequestHandler])
POST   => app.post([path pattern], [RouteRequestHandler])
DELETE => app.delete([path pattern], [RouteRequestHandler])
```

In this case, we use `app.get` to define route a `RouteRequestHandler`
callback that executes when an incoming request is received at the root of our app: `'/'`.

Inside our `RouteRequestHandler` callback, we have an [`event`](/api/interfaces/routing.IncomingRequestEvent)
object that contains information about the request.
And in this example, we use `event.request.url` to parse the URL from whence the request originated.

Notice that we use `export default` on `app`?
This instructs Cloudflare's Worker runtime to direct all incoming requests to our handler.

:::info
If you're building an app with multiple pages and API endpoints.
Splitting your app into multiple routers in their own files can keep your app managable.

:::

## Responding with type-safe JSON

Keywork gives us the optional type-safety of TypeScript.
And since we've already demostrated how to send plaintext,
Let's illustrate this feature by adding a JSON endpoint to our router:

```ts title=_worker.ts
import { WorkerRouter } from 'keywork/routing'

const app = new WorkerRouter()

app.get('/', (event) => {
  const url = new URL(event.request.url)

  return `Hello from ${url.pathname}`
})

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

If you're familiar with Worker Sites, or Cloudflare Pages, you may have noticed that
`WorkerRouter` reduces much of the low-level boilerplate.
The Keywork API attempts to bridge the gap between existing web development patterns,
and the native Worker API.
