---
title: Session
sidebar_position: 0
sidebar_label: Module Overview
tags: ['Module']
---

## Module Overview

Keywork includes optional middleware to manage and authenticate your users.

```ts
import { SessionMiddleware } from 'keywork/session'
import { KeyworkRouter } from 'keywork/router'

const app = new KeyworkRouter({
  displayName: 'Session Tester',
  middleware: [new SessionMiddleware()],
})

app.get('/', (event) => {
  const { session } = event.data

  if (session.isNewSession) {
    return 'Hello there, new user!'
  }

  return `Hello again, ${session.sessionID}!`
})
```

## Related Entries

- [`SessionMiddleware`](modules/session/api/classes/SessionMiddleware)
