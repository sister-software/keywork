---
id: parsing-requests
title: Parsing Requests Example
sidebar_position: 2
sidebar_label: Parsing Requests
---

## Parsing incoming request parameters

Let's say you're building a Todo list app, and incoming requests include
query params, such as a Todo's `ID`. Keywork's `parsePathname` function makes this task easy:

```ts title=./workers/TodoListHandler.ts
import { parsePathname, KeyworkRequestHandler, KeyworkResourceError } from 'keywork'

interface GetTodoParams {
  todoID: string
}

export class TodoListHandler extends KeyworkRequestHandler {
  // We use a static property to allow for complex, multi-worker routing in later examples.
  static pattern = '/todos/:todoID'

  onRequestGet: PagesFunction = async ({ request }) => {
    const url = new URL(request.url)

    // Don't worry if the url doesn't match the expected pattern
    // `RequestHandler` will gracefully handle runtime errors.
    const params = parsePathname<GetTodoParams>(TodoListWorker.pattern, url)

    const todo = await fetchTodos(params.todoID)

    if (!todo) throw new KeyworkResourceError('TODO does not exist')

    return new JSONResponse(todo)
  }
}
```

```ts title=workers/_worker.ts
import { TodoListHandler } from './TodoListHandler'

const incomingRequestHandler = new TodoListHandler()

export default incomingRequestHandler
```
