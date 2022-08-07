---
title: Overview
sidebar_label: Module Overview
sidebar_position: 0
pagination_label: 'Module: React'
pagination_next: 'modules/react/server-side-rendering'
---

## Module Overview

While optional, Keywork uses React as its primary HTML templating engine.

If you haven't already, make sure to add the React peer dependencies:

```shell title="Run in the root of your project."
$ yarn add react react-dom
```

## Usage

Route handlers defined on an instance of `KeyworkRouter` can return a React component,
Keywork automatically converts the content into a streamed response.

```tsx
import { KeyworkRouter } from 'keywork/router'

const app = new KeyworkRouter()

app.get('/', () => <h1>Hello from Keywork! 👋</h1>)

interface GreetParams {
  firstName: string
}

app.get('/greet/:firstName', ({ params }) => {
  return (
    <div>
      <h1>Hello there! {params.firstName}</h1>
    </div>
  )
})

export default app
```
