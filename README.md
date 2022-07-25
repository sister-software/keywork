**Keywork** is a batteries-included, library for building web apps on Cloudflare Workers, Deno, and Node.JS

![npm](https://img.shields.io/npm/dm/keywork)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/nirrius/keywork)
![Discord](https://img.shields.io/discord/595317990191398933?color=blue&label=Chat&logo=discord&logoColor=white)

![npm (scoped)](https://img.shields.io/npm/v/keywork)
[![deno module](https://shield.deno.dev/x/keywork)](https://deno.land/x/keywork)
[![codecov](https://codecov.io/gh/nirrius/keywork/branch/main/graph/badge.svg?token=1SDGYMB2YN)](https://codecov.io/gh/nirrius/keywork)

Keywork may be right for you if...

- You're building your web app almost entirely within the Cloudflare Workers platform
- You want to build on V8 Isolates without vendor lock-in
- You find yourself writing a lot of "glue-code" to wrangle your growing set of Workers
- Your site is hosted on a single Worker and you'd like to split its logic into smaller and more manageable bundles
- Your routing logic is outgrowing Cloudflare Pages
- You'd like to use Workers KV as a NoSQL database like MongoDB or Firebase

**See <https://keywork.app> for more detailed documentation.**

## Features

- 💪 Written in TypeScript
- 📚 ES6 modules support
- 🔥 Compatible with [Miniflare](https://miniflare.dev/)
- 🙏 Just works

### Routing

Keywork has everything you need to handle incoming requests in a Cloudflare Worker environment.
Application routing remains _magic-free_, and uses an Express.js inspired API that doesn't stray far from
the native design patterns of the Worker platform.

And thanks to modular and type-safe API, Keywork provides opinionated and structured
guidence as your web app grows, without locking you into a specific pattern.

_[Routing API](/api/modules/router)_

### React just works

At long last, Keywork takes React beyond the basics of static site generation, and into full dynamic pages.

Keywork makes server-side rendering as simple as _an API with a UI_:

- Define your routes
- Fetch your static props
- Render a React component

Keywork handles client-side hydration, and fits into your existing architecture without ceremony.
And with rendering made even faster with built-in support for streamed responses,
your app is delivered and interactive in seconds.

_[React Browser API](/api/modules/react-browser)_

_[React Worker API](/api/modules/react-worker)_

### Code bundling without the guesswork

Using Keywork means spending less of your precious time configuring ESBuild,
and allows you to focus on the task at hand — building great web apps.
And with [readymade templates](https://github.com/nirrius/keywork-example-react-esbuild) available,
you can skip the boilerplate and start coding in seconds.

_[Bundling API](/api/modules/bundling)_

### Core utilities for building web apps

All the typical "junk drawer" stuff you usually have to implement when building a web app,
including...

- Cache headers, cache responses, and even ETag generation for your own content.
- URL helpers, path builders.
- Isomorpic runtime error handling for both the browser, and your Worker.
- Logging that helps you better trace down errors as your app grows.
- Simplified error handling for your server-side Worker logic.
- Session management to aid in authenticating users.
- ETag generation for cachable content such as HTML, JSON, and much more.
- Static asset utilities with support for Cloudflare Pages and Worker Sites.

[**All that and much, much more!**](/api/modules/)
