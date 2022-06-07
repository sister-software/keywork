---
id: ssr
title: React Server-side Rendering
sidebar_position: 0
sidebar_label: Server-side Rendering
---

# Rendering React apps in your Worker

Using Keywork with React is generally the same as writing an API endpoint
with a few extra goodies.

## Example: Todo List App

Let's start by modeling a Todo List app.
What might a single task look like as TypeScript interface?

```ts title=/todo-app/common.ts
interface TodoTask {
  // e.g. "Pick up milk."
  label: string
  // Whether this entry is especially important.
  important: boolean
  // When it might be due.
  dueDate: Date | null
  // And when the task was completed...
  completedAt: Date | null
}
```

### Creating a mock database

The `TodoTask` will eventually be fetched by a Worker in response to an incoming request.
Let's mock out few example tasks with our interface...

```ts title=/todo-app/data.ts
import { TodoTask } from './common.ts'

export const mockTodoDatabase: Record<string, TodoTask | undefined> = {
  '1': {
    label: 'Get holographic boots polished.',
    important: true,
    dueDate: new Date(),
    completedAt: null,
  },
  '2': {
    label: 'Fix guitar.',
    important: false,
    dueDate: new Date(),
    completedAt: null,
  },
  '3': {
    label: 'Perform live show!',
    important: true,
    dueDate: new Date(),
    completedAt: null,
  },
}
```

### Creating a React page component

This is a React application, so we'll need a component to render the page.
And since we're using TypeScript, we also need to align our data interfaces with
our React component's props.

```tsx title=/todo-app/TodoPage.tsx
export interface StaticTodoPageProps {
  todoTask: TodoTask
}

export const TodoPage: React.FC<StaticTodoPageProps> = ({ todoTask }) => {
  return (
    <div>
      <h1>{todoTask.label}</h1>
      {todoTask.completedAt ? <h2>Completed on {todoTask.completedAt.toLocaleDateString()}</h2> : null}
    </div>
  )
}
```

This should look pretty typical compared to other React components.
All that's missing is a worker to fetch our `StaticTodoPageProps`.

### Putting everything together

The core concept of Keywork is handling the lifecycle of incoming HTTP requests:

1. A user sends incoming request from the browser, e.g. example.com
2. Your Worker's default export of `KeyworkRequestHandler` receives the request
3. The `KeyworkRequestHandler` sends a `Response` back to the browser

For example, this worker sends a `JSONResponse` to the browser:

```ts title=/todo-app/ExampleTodoAPI.ts
import { KeyworkRequestHandler } from 'keywork'

interface TodoResponseBody {
  todos: string[]
}

export class ExampleTodoAPI extends KeyworkRequestHandler {
  onRequestGet: WorkerRouteHandler = async ({ url }) => {
    const body: TodoResponseBody = {
      todos: [
        // Some mock data our 'API' responds with...
        'Get holographic boots polished.',
        'Fix guitar.',
        'Perform live show!',
      ],
    }

    return new JSONResponse(body)
  }
}
```

However, instead of declaring `onRequestGet` in our `KeyworkRequestHandler`,
we'll use `getStaticProps` -- along with our React component and interface.

```ts
import { KeyworkRequestHandler, GetStaticPropsHandler } from 'keywork'
import { StaticTodoPageProps, TodoPage } from './TodoPage.tsx'

export class TodoWorker extends KeyworkRequestHandler {
  // A URL path pattern...
  static readonly pattern = '/todos/:todoID/'
  // And our React component from earlier.
  PageComponent = TodoPage

  async getStaticProps({ request }: IncomingRequestData): Promise<StaticTodoPageProps> {
    // Attempt to get our params from the request...
    const { params } = parsePathname<TodoRouteParams>(TodoWorker.pattern, request)
    // "Search" the database for a match...
    const todoItem = exampleTodos[params.todoID]

    if (!todoItem) {
      return new ErrorResponse(`Todo with ID ${todoItem} does not exist`, 404)
    }

    // Return the expected static props!
    return {
      todoItem,
    }
  }
}
```

:::info
Additional type-safety can be enforced by extending the generic `KeyworkRequestHandler<Env, StaticProps>`

See the API for further details.
:::

# Further reading

:::info
Keywork's docs are being updated frequently.
However, the API reference is available for the bravehearted.

:::
