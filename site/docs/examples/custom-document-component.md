---
id: custom-document-component
title: Custom Document Component
sidebar_position: 3
sidebar_label: Custom Document Component
---

If you have a custom `<html>` document component, or want to inject your own providers
in the render lifecyle, you can pass your component to the `WorkerRouter`:

```tsx title=worker/components/AppHTMLDocument.tsx showLineNumbers
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

```tsx title=worker/routers/app.tsx showLineNumbers
// highlight-next-line
import { AppHTMLDocument } from '@local/worker/components/Document'
import { WorkerRouter } from 'keywork/routing'

export const app = new WorkerRouter({
  displayName: 'My App',
  // highlight-next-line
  DocumentComponent: AppHTMLDocument,
})

all.get('/', async ({ request }) => {
  return <div>Hello world!</div>
})
```

## Example: Using React with URL params

```tsx title=worker/routers/users.ts
export const usersRouter = new WorkerRouter({
  displayName: 'Users Router',
  DocumentComponent: AppHTMLDocument,
  session: true,
})

interface GetUserParams {
  username: string
}

// Declaring a route that returns a React element...
users.get<GetUserParams>('/profile/:username', async ({ session, params }) => {
  const user = database.fetchBy({ username })
  let isFriends: boolean

  if (!user) {
    return new KeyworkResourceError(`${username} not found`, 404)
  }

  if (session) {
    const currentUser = database.fetchBy({ sessionID: session.sessionID })
    isFriends = currentUser && user.friendsList.includes(currentUser.id)
  }

  return <UserProfile user={user} isFriends={isFriends} />
})
```
