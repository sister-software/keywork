---
title: Overview
sidebar_label: Module Overview
tags: ['Module']
sidebar_position: 0
pagination_label: 'Module: React'
pagination_next: 'modules/react/server-side-rendering'
---

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

## Module Overview

While optional, Keywork uses React as its primary HTML templating engine.

### Peer Dependencies

If you haven't already, make sure to add the React peer dependencies:

<Tabs groupId="npm">
  <TabItem value="yarn" label="Yarn">

```shell title="Run in the root of your project."
$ yarn add react react-dom
```

  </TabItem>

  <TabItem value="npm" label="NPM">

```shell title="Run in the root of your project."
$ npm install --save react react-dom
```

  </TabItem>

  <TabItem value="deno" label="Deno">

[Import Maps](https://deno.land/manual/node/import_maps#using-import-maps)
are recommended to avoid long import URLs:

```json title="./your-project/import_map.json"
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom": "https://esm.sh/react-dom@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "react-dom/server": "https://esm.sh/react-dom@18.2.0/server",
    "react-dom/server.browser": "https://esm.sh/react-dom@18.2.0/server.browser",
    "react/jsx-runtime": "https://esm.sh/react/jsx-runtime"
  }
}
```

  </TabItem>
</Tabs>

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
