---
id: routing
title: Routing React
sidebar_position: 4
sidebar_label: Routing
---

[Create React App](https://create-react-app.dev/docs/getting-started) and TypeScript

# Configuring WorkerRouter with a custom HTML Document

If you have a custom `<html>` document component, or want to inject your own providers
in the render lifecyle, you can pass your component to the `WorkerRouter`:

```tsx title="worker/components/AppHTMLDocument.tsx"
import { KeyworkHTMLDocumentAppRoot } from 'keywork/react'
import React from 'react'

export interface AppHTMLDocumentProps {
  children: React.ReactNode
}

export const AppHTMLDocument: React.FC<AppHTMLDocumentProps> = ({ children }) => {
  return (
    <html>
      <head>
        <title>My Keywork App</title>
        <link href="/static/main.css" rel="stylesheet" />
      </head>
      <body>
        <div id={KeyworkHTMLDocumentAppRoot}>{children}</div>
        <script src="/static/main.js"></script>
      </body>
    </html>
  )
}
```

```tsx title="worker/routers/app.tsx"
import { AppHTMLDocument } from '@local/worker/components/Document'
import { WorkerRouter } from 'keywork/routing'

export const app = new WorkerRouter({
  displayName: 'My App',
  DocumentComponent: AppHTMLDocument,
})

all.get('/', async ({ request }) => {
  return <div>Hello world!</div>
})
```
