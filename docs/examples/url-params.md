---
id: url-params
title: Parsing URL Params
sidebar_position: 3
sidebar_label: Parsing URL Params
---

```tsx title=worker/routers/users.ts
export const usersRouter = new WorkerRouter({
  displayName: 'Users Router',
  DocumentComponent: AppHTMLDocument,
  session: true,
})

// highlight-start
interface GetUserParams {
  username: string
}
// highlight-end

// Declaring a route that returns a React element...
// highlight-next-line
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
