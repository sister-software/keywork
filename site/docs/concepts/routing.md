---
id: routing
title: Routing
sidebar_position: 1
sidebar_label: Routing
---

Designed with familiarity in mind, the server-side routing API is inspired by
Express.js, React Router, and the native Cloudflare Workers platform.

## Creating a RESTful API

Much like Express.js, The Keywork Router defines each route handler by
invoking methods that correspond with HTTP methods.

```ts
GET    => app.get([path pattern], [RouteRequestHandler])
POST   => app.post([path pattern], [RouteRequestHandler])
DELETE => app.delete([path pattern], [RouteRequestHandler])
```

Building a web app on Cloudflare Workers can be intimidating,
especially so if you're unfamiliar with the quirks of platform.
Let's start with a small example to get a feel for how Keywork fits in with your current experience.

We're going to create a single Worker that sends the browser a "hello world" response.
By the end of this example, you'll know how to use the [`WorkerRouter`](/api/classes/routing-worker.WorkerRouter)
class to handling incoming requests from the browser.

:::info
If you're already familiar with Cloudflare Workers, this might seem like a bit of review.
And if you'd just like to skip to the final result, checkout the [example repo](https://github.com/nirrius/keywork-example-react-esbuild).

:::

## Handling incoming requests

The core focus of Keywork is the routing of incoming HTTP requests from the user's browser
to your app's router endpoints.

1. Define a router with an incoming request handler
2. Export the router as the default entrypoint of your worker bundle
3. A user sends incoming request from the browser, e.g. `http://localhost:8788/`
4. The Cloudflare Worker runtime receives the request
5. Keywork parses the request into an `IncomingRequestEvent` and sends the data to your route handler callback
6. Your incoming request handler returns "Hello world"

:::info
Heads up! While optional, Keywork is a TypeScript-first library.
Examples are always written with type annotations, but they can be omitted if you'd like.

:::

## Defining a router with an incoming request handler

Building an app with Keywork starts creating a [`WorkerRouter`](/api/classes/routing-worker.WorkerRouter):

```ts title=_worker.ts showLineNumbers
import { WorkerRouter } from 'keywork/routing'

// Create a router to receive all incoming requests...
const app = new WorkerRouter()
```

## Using the Keywork Router to respond to each HTTP method

Much like Express.js, we can define route handlers by invoking methods on `app` that correspond with HTTP methods.
In our small example, we only need to define a single route handler:

```ts title=_worker.ts showLineNumbers
import { WorkerRouter } from 'keywork/routing'

// Create a router to receive all incoming requests...
const app = new WorkerRouter()

// highlight-start
// e.g. GET http://example.com/
app.get('/', (event) => {
  // Parse the incoming request URL...
  const url = new URL(event.request.url)

  return `Hello from ${url.pathname}`
})
// highlight-end
```

We call `app.get` to define route a `RouteRequestHandler`
callback that executes when an incoming request is received at the root of our app.

### Path Parameters

While our example path pattern is simple,
routes can also have path parameters such as...

```ts
app.get('/users/', ...)
app.post('/users/', ...)

app.get('/users/:userID/', ...)
app.get('/users/:userID/friends/', ...)
app.get('/articles/:articleID', ...)
```

### `IncomingRequestEvent`

Inside our `RouteRequestHandler` callback, we have an [`event`](/api/interfaces/routing-common.IncomingRequestEvent)
object that contains information about the request.
And in this example, we use `event.request.url` to parse the URL from whence the request originated.

## Exporting the router

```ts title=_worker.ts showLineNumbers
import { WorkerRouter } from 'keywork/routing'

// Create a router to receive all incoming requests...
const app = new WorkerRouter()

// e.g. GET http://example.com/
app.get('/', (event) => {
  // Parse the incoming request URL...
  const url = new URL(event.request.url)

  return `Hello from ${url.pathname}`
})

// highlight-start
// Finally, export our router so that Cloudflare Workers can send our app requests...
export default app
// highlight-end
```

Notice that we use `export default` on `app`?
This instructs Cloudflare's Worker runtime to direct all incoming requests to our handler.
Remember, while you may import other modules, a bundler tool like ESBuild or Webpack
will always create a single file with the one instance of `export default`.

:::info
If you're building an app with multiple pages and API endpoints.
Splitting your app into multiple routers in their own files can keep your app managable.

:::

## Responding with type-safe JSON

Keywork gives us the optional type-safety of TypeScript.
And since we've already demostrated how to send plaintext,
Let's illustrate this feature by adding a JSON endpoint to our router:

```ts title=_worker.ts showLineNumbers
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

## Additional Perks

The `WorkerRouter` class also provides some small quality-of-life improvements
over the low-level APIs of the Workers platform.

### Automatic Response Parsing

Keywork will automatically infer the appropriate `Response` for the return type
of your `RouteHandler`, allowing you to skip the ceremony of constructing
`Response` with the appropriate headers

However, this behavior can be avoided by explicitly providing a `Response` object,
or a class that extends from `Response` such as...

- `CachableResponse`
- `HTMLResponse`
- `JSONResponse`
- `ErrorResponse`

### Errors

Errors in your code are caught before they crash the runtime.
See `KeyworkResourceError` for further details.

### Sessions

Support for cookie-based sessions is automatically handled.
See `KeyworkSession` for further details.

## Further reading

- [RESTful API patterns](https://www.restapitutorial.com/lessons/httpmethods.html)
