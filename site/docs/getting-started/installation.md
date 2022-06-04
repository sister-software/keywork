---
id: getting-started
title: Getting Started
sidebar_position: 0
sidebar_label: Getting Started
---

## Install

Keywork apps are framework agnostic and can compliment your existing codebase:

```shell title=Run in the root of your Cloudflare Worker project.
$ yarn add keywork
```

If you're building a React app, Keywork fits right in:

```shell title=Run in the root of your Cloudflare Worker project.
$ yarn add @keywork/react-isomorphic
```

# Examples

:::info
While optional, Keywork is a TypeScript-first library.
Example code is always written with type annotation.

:::


## Hello world

Keywork apps usually start by extending the `KeyworkRequestHandler` class
to create a incoming request handler.


```ts title=workers/HelloWorld.ts
import {KeyworkRequestHandler, WorkerRouteHandler} from 'keywork'

export class HelloWorldHandler extends KeyworkRequestHandler {
  onRequestGet: WorkerRouteHandler = async (data) => {
    const {
      /** The incoming request */
      request,
      /** The incoming request URL object */
      url,
      /** Any bound environment properties defined in your `wrangler.toml` file */
      env,
      /** An execution context for running async tasks after the response is sent. */
      context,
    } = data

    return new Response(`Hello from ${url.pathname}`)
  }
}
```

Now with our request handler written, we construct an instance `HelloWorldHandler` from the entrypoint of our Worker.
Notice that we `export default` the instance? This instructs Cloudflare's Worker runtime
to direct all incoming requests to our handler.

```ts title=workers/_worker.ts
import {HelloWorldHandler} from './HelloWorldHandler'

const incomingRequestHandler = new HelloWorldHandler()

export default incomingRequestHandler
```

:::info
If you're familiar with either Worker Sites, or Worker Pages, this will look familiar!

:::

## Responding with JSON

```ts title=worker.ts
import {KeyworkRequestHandler, WorkerRouteHandler, JSONResponse} from 'keywork'

interface HelloResponseBody {
  url: string
  date: string
  message: string
}

class HelloWorker extends KeyworkRequestHandler {
  onRequestGet: WorkerRouteHandler = async ({url}) => {

    const body: HelloResponseBody = {
      url: url.toString(),
      date: new Date().toJSON(),
      message: "Keywork rocks!"
    }

    return new JSONResponse(body)
  }
}


export default new HelloWorker()
```

## Parsing incoming request params

Let's say you're building a Todo list app, and incoming requests include
query params. The `parsePathname` function makes this task easy:


```ts title=./workers/TodoListHandler.ts
import {
  parsePathname,
  KeyworkRequestHandler,
  WorkerRouteHandler,
  KeyworkResourceError
} from 'keywork'

interface GetTodoParams {
  todoID: string
}

export class TodoListHandler extends KeyworkRequestHandler {
  // We use a static property to allow for complex, multi-worker routing in later examples.
  static pattern = '/todos/:todoID'

  onRequestGet: WorkerRouteHandler = async ({url}) => {
    // Don't worry if the url doesn't match the expected pattern
    // `KeyworkRequestHandler` will gracefully handle runtime errors.
    const params = parsePathname<GetTodoParams>(TodoListWorker.pattern, url)

    const todo = await fetchTodos(params.todoID)

    if (!todo) throw new KeyworkResourceError('TODO does not exist')

    return new JSONResponse(todo)
  }
}
```

```ts title=workers/_worker.ts
import {TodoListHandler} from './TodoListHandler'

const incomingRequestHandler = new TodoListHandler()

export default incomingRequestHandler
```


# Further reading

Keywork's docs are being updated frequently.
However, the API reference is available for the bravehearted.
