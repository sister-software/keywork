---
id: api.collections.readme
title: Collections Package Overview
sidebar_position: 0
sidebar_label: 'Package Overview'
---

> The missing piece that unlocks the full power of storing and querying data from your Worker.

![npm (scoped)](https://img.shields.io/npm/v/@keywork/collections)
![npm](https://img.shields.io/npm/dm/@keywork/collections)

- A NoSQL _eventually-consistent_ ODM for Cloudflare's [Worker KV](https://developers.cloudflare.com/workers/runtime-apis/kv/).
- An API reminiscent of Firebase and MongoDB, perfect for migrating your existing backend to Cloudflare's network.
- Extends Worker KV's API without abstracting away important details

## Using Keywork collections from within a Cloudflare Worker.

```toml title=wrangler.toml
compatibility_date = "2022-02-13"
name = "example-app"
route = "https://example.com/api/users/*"

kv_namespaces = [
  { binding = "users", id = "abcd123...", preview_id = "efgh456..."},
]
```

## Creating a advanced request handler with a Keywork Collection.

```ts title=/workers/users.ts
import { StatusCodes } from 'http-status-codes'
import { KeyworkCollection } from '@keywork/collections'
import { KeyworkResourceError } from '@keywork/utils'
import { IncomingRequestHandler, KeyworkRequestHandler, parsePathname } from 'keywork'

interface ExampleAppBindings {
  exampleApp: KVNamespace
}

interface GetUserParams {
  userID: string
}

interface ExampleUser {
  firstName: string
  lastName: string
  role: 'member' | 'admin'
  plan: 'free' | 'paid'
}

class UserAPIHandler extends KeyworkRequestHandler<ExampleAppBindings> {
  onRequestGet = async ({ request, env }: IncomingRequestData<ExampleAppBindings>) => {
    const { params } = parsePathname<GetUserParams>('/users/:userID', request)
    const usersCollection = new KeyworkCollection<ExampleUser>(env.exampleApp, 'users')
    const userRef = usersCollection.createDocumentReference(params.userID)
    const userSnapshot = await userRef.fetchSnapshot()
    if (!userSnapshot.exists) {
      throw new KeyworkResourceError('User does not exist', StatusCodes.BAD_REQUEST)
    }
    const user = userSnapshot.value
    if (user.plan !== 'paid') {
      throw new KeyworkResourceError('You must have a paid plan', StatusCodes.PAYMENT_REQUIRED)
    }
    if (user.role !== 'admin') {
      throw new KeyworkResourceError('Only an admin can access this page', StatusCodes.FORBIDDEN)
    }
  }
}
export default UserAPIHandler
```
