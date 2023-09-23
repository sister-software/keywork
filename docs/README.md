# What is Keywork?

**Keywork** is a batteries-included library for building serverless web apps on Cloudflare Workers, Deno, and Node.JS

```tsx
import { RequestRouter } from 'keywork/router'

const app = new RequestRouter()

app.get('/', () => <h1>Hello from Keywork! 👋</h1>)

export default app
```

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/nirrius/keywork)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/nirrius/keywork/CI/main)
[![codecov](https://codecov.io/gh/nirrius/keywork/branch/main/graph/badge.svg?token=1SDGYMB2YN)](https://codecov.io/gh/nirrius/keywork)
![npm](https://img.shields.io/npm/dm/keywork)
![npm (scoped)](https://img.shields.io/npm/v/keywork)
[![deno module](https://shield.deno.dev/x/keywork)](https://deno.land/x/keywork)

## Why use Keywork?

**V8 Isolates** are an emerging technology offered by cloud-computing services,
that allow web apps to deploy quickly, and be served from around the world.
Compared to more traditional cloud services, V8 Isolates offer faster response times,
and even scale at more affordable prices than virtual machines and containers.

**_However_**, building a web app with V8 Isolates can come with several drawbacks,
and may lock your code into a single platform.

**Keywork is an open-source library that makes V8 Isolates easier to use.**

## Serverless web apps without vendor lock-in

Whether you're creating a new web app, or refactoring an existing code-base,
choosing a serverless provider is challenging...

You may not have enough information to make a choice between providers such as [Cloudflare Workers](https://workers.cloudflare.com) and [Deno Deploy](https://deno.com/deploy). You may want to try several providers and compare their pricing models, or even [self-host](https://lagon.app) your own V8 Isolates platform.

**Keywork allows you to build V8 compatible web apps without vendor lock-in,
and supports Cloudflare Workers, Deno Deploy, and Node.JS**

## Routing

Keywork has everything you need to handle incoming requests in a V8 runtime environment.
Application routing remains _magic-free_, and uses an Express.js inspired API that doesn't stray far from
the native design patterns of the Worker platform.

```ts title="GET https://example.com/greet/jessie"
interface GreetParams {
  firstName: string
}

app.get<GreetParams>('/greet/:firstName', ({ params }) => {
  return `Hello there! ${params.firstName}`
})
```

Keywork is the next step when your routing logic outgrows [Cloudflare Pages](https://developers.cloudflare.com/pages/platform/functions/#functions-routing).
And thanks to modular and type-safe API, Keywork provides an opinionated and structured
guidence as your codebase expands, without locking you into a specific design-pattern.

<a href="https://keywork.app/modules/router/" target="_blank"><strong><em>Try the Router Module</em> ›</strong></a>

### React just works

At long last, Keywork takes rendering React on V8 beyond static site generation, and into full dynamic pages.

Server-side rendering is made as simple as pairing JSX with your type-safe API:

```tsx title="Create your API routes..."
interface User {
  displayName: string
  email: string
}

const usersAPI = new RequestRouter()

usersAPI.get('/', () => {
  const users: User[] = [
    { displayName: 'Coheed', email: 'coheed.k@example.com' },
    { displayName: 'Cambria', email: 'claudio.k@example.com' },
    { displayName: 'Ambellina', email: 'ambellina@example.com' },
    { displayName: 'Sirus', email: 'sirus.amory@example.com' },
  ]

  return users
})
```

```tsx title="Fetch your static props and return JSX!"
const app = new RequestRouter({
  middleware: [['/api/users', usersAPI]],
})

app.get('/users', async () => {
  const response = await this.fetch('/api/users')
  const users: User[] = await response.json()

  return (
    <ul>
      {users.map((user, i) => (
        <li key={i}>{user.displayName}</li>
      ))}
    </ul>
  )
})
```

Keywork handles client-side hydration, and fits into your existing architecture without ceremony.
And with built-in support for streamed responses, your app is delivered and interactive in seconds.

<a href="https://keywork.app/modules/react/" target="_blank"><strong><em>Try the React Module</em> ›</strong></a>

### Isomorphic error handling, made easier.

Whether you're handling errors in your V8 Worker, Node.JS, or even the browser,
Keywork includes error utilities that pair nicely with HTTP requests.

```ts
import { RequestRouter } from 'keywork/router'
import { KeyworkResourceError, Status } from 'keywork/errors'

interface LoginPayload {
  email: string
  password: string
}

app.post('/login', async ({ request }) => {
  const payload: LoginPayload = await request.body.json()

  if (!payload.email) {
    return new KeyworkResourceError('Email is required', Status.BadRequest)
  }
})
```

<a href="https://keywork.app/modules/errors" target="_blank"><strong><em>Try the Error Module</em> ›</strong></a>

## Code bundling without the guesswork

Using Keywork means that you'll spend less of your precious time configuring ESBuild,
and more on the real task at hand — building great web apps.

And with [readymade templates](https://github.com/sister-software/keywork-starter-kit) available,
you can skip the boilerplate and start coding in seconds.

<a href="https://keywork.app/modules/bundling/" target="_blank"><strong><em>Try the Bundling Module</em> ›</strong></a>

### Tools to manage your growing codebase

Cloudflare Workers are limited to [just 1 megabyte](https://developers.cloudflare.com/workers/platform/limits#worker-size) after compression, and even a modestly-sized codebase may push against this limit.

**Keywork allows your web app to be split into smaller and more manageable Worker deployments**

## Core utilities for building web apps

If you find yourself writing a lot of "glue-code",
Keywork also includes the typical "kitchen drawer" stuff you usually have to implement when building a web app,
including...

- Logging that helps you better trace down errors as your app grows
- Cache headers, cache responses, and even ETag generation for your own content
- Session management to aid in authenticating users
- Tools that let you use Cloudflare KV as a NoSQL database like MongoDB or Firebase
- Static asset utilities with support for Cloudflare Pages and Worker Sites.

**All that and much, much more!**
<a href="https://keywork.app/modules/" target="_blank"><strong><em>View all Keywork modules</em> ›</strong></a>

## Keywork Starter Kit

The starter kit lets Keywork can be used to build a web app on [Cloudflare Pages](https://pages.cloudflare.com) with your own routing.

- 🌐 React
- 🏗️ ESBuild
- ⚡ Cloudflare Pages
- 💪 Written in TypeScript

<a href="https://github.com/sister-software/keywork-starter-kit" target="_blank"><strong><em>More details about the starter kit</em> ›</strong></a>

## Want to help?

Keywork is made possible through the countless contributions of the open-source community.
There are many ways in which you can contribute to the project.

<a href="https://keywork.app/contributing" target="_blank"><strong><em>See our contributing guide</em> ›</strong></a>

## Licensing

Keywork is open-source software and distributed under the [AGPL-3.0 license](https://www.gnu.org/licenses/agpl-3.0.html).
Under the AGPL, you can alter, duplicate redistribute, and incorporate our source code into your application for free,
AS LONG AS you comply with the source code sharing requirements of AGPL.

- [Open Source Usage](https://keywork.app/license/open-source)
- [Commercial Usage](https://keywork.app/license/commercial)
