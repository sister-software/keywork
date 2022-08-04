---
title: Routing
sidebar_label: Module Overview
sidebar_position: 0
pagination_label: 'Module: Routing'
---

Designed with familiarity in mind, the server-side routing API is inspired by
Express.js, React Router, and the native Cloudflare Workers platform.

```ts title="worker.ts"
import { KeyworkRouter } from 'keywork/router'

const app = new KeyworkRouter()

app.get('/', () => 'Hello there! 👋')

export default app
```

## Creating a RESTful API

Much like Express.js, `KeyworkRouter` defines each route handler by
invoking methods that correspond with HTTP methods.

```ts
import { KeyworkRouter } from 'keywork/router'

const app = new KeyworkRouter()

// GET http://localhost:8788
app.get('/', () => 'Hello there! 👋')

// GET http://localhost:8788/greet/jessie
app.get('/greet/:firstName', ({ params }) => `Hello there! ${event.params.firstName}`)

// GET http://localhost:8788/datetime
app.get('/datetime', () => `The current datetime is: ${new Date().toLocaleTimeString()}`)

// POST http://localhost:8788/users
app.get('/users', () => `The current datetime is: ${new Date().toLocaleTimeString()}`)
```

An instance of `KeyworkRouter` can handle the following HTTP methods:

| HTTP Method | Usage                                                |
| ----------- | ---------------------------------------------------- |
| `'GET'`     | `app.get([path pattern], [RouteRequestHandler])`     |
| `'POST'`    | `app.post([path pattern], [RouteRequestHandler])`    |
| `'PATCH'`   | `app.patch([path pattern], [RouteRequestHandler])`   |
| `'DELETE'`  | `app.delete([path pattern], [RouteRequestHandler])`  |
| `'HEAD'`    | `app.head([path pattern], [RouteRequestHandler])`    |
| `'OPTIONS'` | `app.options([path pattern], [RouteRequestHandler])` |
| `'*'`       | `app.all([path pattern], [RouteRequestHandler])`     |

### Path Parameters

Routes can have "[path-to-regexp](https://www.npmjs.com/package/path-to-regexp) style" path patterns:

```ts
app.get('/users/', ...)
app.post('/users/', ...)

app.get('/users/:userID/', ...)
app.get('/users/:userID/friends/', ...)
app.get('/articles/:articleID', ...)
```

Path patterns can even use regular expressions if your routing requires more fine-grain control.

### `IncomingRequestEvent`

When defining a route's `RouteRequestHandler` callback, you have access to an [`IncomingRequestEvent`](/modules/http/request/api/classes/IncomingRequestEvent) that contains information about the request.

## Additional Perks

The `KeyworkRouter` class also provides some small quality-of-life improvements
over the low-level APIs of the Workers platform.

### Automatic Response Parsing

Keywork will automatically infer the appropriate `Response` for the return type
of your `RouteHandler`, allowing you to skip the ceremony of constructing
`Response` with the appropriate headers

However, this behavior can be avoided by explicitly providing a `Response` object,
or a class that extends from `Response` such as...

- [`CachableResponse`](/modules/http/response/api/classes/CachableResponse)
- [`HTMLResponse`](/modules/http/response/api/classes/HTMLResponse)
- [`JSONResponse`](/modules/http/response/api/classes/JSONResponse)
- [`ErrorResponse`](/modules/http/response/api/classes/ErrorResponse)

### Errors

Errors in your code are caught before they crash the runtime.
See [`KeyworkResourceError`](/modules/errors/api/classes/KeyworkResourceError) for further details.

### Sessions

Support for cookie-based sessions is automatically handled.
See `KeyworkSession` for further details.

## Further reading

- [Sessions](/modules/session/)
- [RESTful API patterns](https://www.restapitutorial.com/lessons/httpmethods.html)
