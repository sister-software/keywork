---
id: hello-world
title: Hello World Example
sidebar_position: 1
sidebar_label: Hello World
---

## Handling incoming requests

The core concept of Keywork is handling the entire lifecycle of an incoming HTTP request:

1. Define an incoming request handler class by extending `KeyworkRequestHandler`
2. Your Worker's entrypoint exports your class
3. A user sends incoming request from the browser, e.g. example.com
4. The Worker runtime sends the incoming data to your request handler class
5. Your incoming request handler returns a `Response`

:::info
While optional, Keywork is a TypeScript-first library.
Example code is always written with type annotations.

:::

### Define an incoming request handler

Building an app with Keywork starts by extending the `KeyworkRequestHandler` class.

```ts title=workers/HelloWorld.ts
import { KeyworkRequestHandler, IncomingRequestData } from 'keywork'

export class HelloWorldWorker extends KeyworkRequestHandler {
  onRequestGet(data: IncomingRequestData) {
    const {
      /** The incoming request */
      request,
      /** Any bound environment properties defined in your `wrangler.toml` file */
      env,
      /** An execution context for running async tasks after the response is sent. */
      context,
    } = data

    /** The incoming request URL object */
    const url = new URL(request.url)

    return new Response(`Hello from ${url.pathname}`)
  }
}
```

The `KeyworkRequestHandler` class we extend from does much of the heavy lifting
that makes _working_ with Workers easier, and gives us the optional type-safety of TypeScript.

Because the `HelloWorldWorker` class implements a `onRequestGet` method,
it will handle all incoming `GET` requests.

:::info
If you're familiar with either Worker Sites, or Worker Pages, this will look familiar!

:::

### Putting it all together...

Now with our request handler written,
we construct an instance of `HelloWorldWorker` from the main entrypoint of our Worker:

```ts title=workers/_worker.ts
import { HelloWorldWorker } from './HelloWorldWorker'

const incomingRequestHandler = new HelloWorldWorker()

export default incomingRequestHandler
```

Notice that we use `export default` on the instance?
This instructs Cloudflare's Worker runtime to direct all incoming requests to our handler.

:::info
Separating your `RequestHandler` classes into their own files can be helpful
If you're building an app with multiple pages and API endpoints.
Check out the [routing](./routing) example for more info.
:::

## Responding with JSON

```ts title=worker.ts
import { KeyworkRequestHandler, IncomingRequestData, JSONResponse } from 'keywork'

interface HelloResponseBody {
  url: string
  date: string
  message: string
}

class HelloWorker extends KeyworkRequestHandler {
  onRequestGet: PagesFunction = ({ request }) => {
    const url = new URL(request.url)

    const body: HelloResponseBody = {
      url: url.toString(),
      date: new Date().toJSON(),
      message: 'Keywork rocks!',
    }

    return new JSONResponse(body)
  }
}

export default new HelloWorker()
```
