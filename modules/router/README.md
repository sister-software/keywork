---
sidebar_label: Module Overview
sidebar_position: 0
pagination_label: 'Module: Routing'
---

# Keywork Router

## Overview

Designed with familiarity in mind, the server-side routing API is inspired by
Express.js, React Router, and the native Cloudflare Workers platform.

```ts title="worker.ts"
import { KeyworkRouter } from 'keywork/router'

const app = new KeyworkRouter()

app.get('/', () => 'Hello there! 👋')

export default app
```

## Creating a RESTful API

Instances of `KeyworkRouter` define each route handler by
invoking methods that correspond with HTTP method of the same name:

| HTTP Method | Usage                                                |
| ----------- | ---------------------------------------------------- |
| `'GET'`     | `app.get([path pattern], [RouteRequestHandler])`     |
| `'POST'`    | `app.post([path pattern], [RouteRequestHandler])`    |
| `'PATCH'`   | `app.patch([path pattern], [RouteRequestHandler])`   |
| `'DELETE'`  | `app.delete([path pattern], [RouteRequestHandler])`  |
| `'HEAD'`    | `app.head([path pattern], [RouteRequestHandler])`    |
| `'OPTIONS'` | `app.options([path pattern], [RouteRequestHandler])` |
| `'*'`       | `app.all([path pattern], [RouteRequestHandler])`     |

### `GET` (`app.get([path pattern], [...RouteRequestHandler])`)

```ts title="GET http://localhost:8788"
app.get('/', () => 'Hello there! 👋')
// Hello there! 👋
```

```ts title="GET http://localhost:8788/greet/jessie"
app.get('/greet/:firstName', ({ params }) => `Hello there, ${params.firstName}!`)
// Hello there, Jessie!
```

```ts title="GET http://localhost:8788/datetime"
app.get('/datetime', () => `The current datetime is: ${new Date().toLocaleTimeString()}`)
// The current datetime is: 11:35:00 AM
```

### `POST` (`app.post([path pattern], [...RouteRequestHandler])`)

```ts title="POST http://localhost:8788/users"
interface NewUserPayload {
  displayName: string
  email: string
}

app.post('/users', async ({ request }) => {
  const user: NewUserPayload = await request.json()

  //...
})
```

### Path Parameters

Routes are defined with a [`path-to-regexp` style](https://www.npmjs.com/package/path-to-regexp) path patterns.

```ts
app.get('/users/', ...)
app.post('/users/', ...)

app.get('/users/:userID/', ...)
app.get('/users/:userID/friends/', ...)
app.get('/articles/:articleID', ...)
```

Path matching is implemented via the JavaScript native [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern)

:::warning
You may need a polyfill if your app uses on a runtime that hasn't yet added [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) class.

[**_Learn more from the URI Module_ ›**](/modules/uri)

:::

### `IsomorphicFetchEvent`

When creating a [`RouteRequestHandler`](/modules/router/route/api/types/RouteRequestHandler) callback,
you have access to an [`IsomorphicFetchEvent`](/modules/events/api/classes/IsomorphicFetchEvent):

```ts title="GET http://localhost:8788"
// highlight-next-line
app.get('', (event) => {
  const {
    // highlight-start
    request,
    params
    env,
    data,
    originalURL
    // highlight-end
  } = event

  return 'Hello there! 👋'
})
```

#### `IsomorphicFetchEvent.request`

The [incoming request](https://developer.mozilla.org/en-US/docs/Web/API/Request) received by the V8 runtime.

#### `IsomorphicFetchEvent<ExpectedParams>.params`

Parameters parsed from the incoming request's URL and the route's pattern.

This can be made type-safe by providing a generic type when defining the route:

```ts title="GET http://localhost:8788/users/cambria"
// highlight-start
interface UserProps {
  userID: string
}
// highlight-end

app.get<UserProps>('/users/:userID', (event) => {
  const { userID } = event.params
})
```

#### `IsomorphicFetchEvent.env`

The bound environment aliases.
[Bound environment aliases](https://developers.cloudflare.com/workers/platform/environment-variables/)
are mostly limited to Cloudflare Workers, and are usually defined in your `wrangler.toml` file.

##### Node.js

This is similar to `process.env`.

#### `IsomorphicFetchEvent.data`

Optional extra data to be passed to a route handler, usually from [middleware](/modules/router/middleware/).

#### `IsomorphicFetchEvent.originalURL`

The original request URL, unmodified by Keywork's middleware logic.

## Middleware

Similar to Express.js's concept of Middleware, route handlers have access to a
`next` function to pass a request off to the next route handler matching the URL pattern.

`next` can also be called after checking for some criteria, such as if the user has authenticated:

```ts title="Check if a user is allowed to view a page"
const authenticationRouter = new KeyworkRouter()

authenticationRouter.all('*',
(event, next) => {
  if (!isAuthenticated(event.request)) {
     throw new KeyworkResourceError("You need to be logged in to view that!", Status.Forbidden)
  }

  return next()
})

app.use(authenticationRouter)
app.get('/profile/settings', () => {...})
```

### Overrides

Providing a `request` argument will override the path param parsing within `KeyworkRouter`.
This can be useful if your middleware needs to modify or omit some request information before reaching
the next route handler.

## Additional Perks

The `KeyworkRouter` class also provides some small quality-of-life improvements
over the low-level APIs of the Workers platform.

### Automatic Response Parsing

Keywork will automatically infer the appropriate [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) for the return type
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

## Related Entries

- [URI Module](/modules/uri)
- [Session Module](/modules/session)
- [Middleware Module](/modules/middleware)

## Further reading

- [URLPattern via MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- [RESTful API patterns](https://www.restapitutorial.com/lessons/httpmethods.html)
