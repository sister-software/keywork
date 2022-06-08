---
title: Overview
sidebar_position: 0
sidebar_label: Getting Started
---

**Keywork** is a batteries-included, _magic-free_, library for building web apps on Cloudflare Workers.

Keywork may be right for you if...

- You're building your web app almost entirely within the Cloudflare Workers platform
- You find yourself building a lot of "glue-code" to wrangle your growing set of Workers
- Your site is hosted on a single Worker and you'd like to split its logic into smaller and more managable bundles
- Your application routing logic is too complex for Cloudflare Pages
- You'd like to use Workers KV as a NoSQL database like MongoDB or Firebase

**Keywork** is a batteries-included, _magic-free_, library for building web apps on Cloudflare Workers.

## Features

- 💪 Written in TypeScript
- 📚 Modules Support
- 🔥 Compatible with [Miniflare](https://miniflare.dev/)

**See <https://keywork.app> for more detailed documentation.**

## Packages

### `keywork`

![npm (scoped)](https://img.shields.io/npm/v/keywork)
![npm](https://img.shields.io/npm/dm/keywork)

Everything you need to handle incoming requests in a Worker environment.

- Static prop handlers that feel just like your typical API endpoints.
- Server-side rendering from your worker, made even faster with streamed responses.
- Routing helpers with a low-mental overhead that make splitting your app into separate workers a breeze.
- Client-side hydration that fits into your existing build pipeline.

### `@keywork/collections` (Beta)

![npm (scoped)](https://img.shields.io/npm/v/@keywork/collections)
![npm](https://img.shields.io/npm/dm/@keywork/collections)

The missing piece that unlocks the full power of storing and querying data from your Worker.

- A NoSQL _eventually-consistent_ ODM for Cloudflare's [Worker KV](https://developers.cloudflare.com/workers/runtime-apis/kv/).
- An API reminiscent of Firebase and MongoDB, perfect for migrating your existing backend to Cloudflare's network.
- Extends Worker KV's API without abstracting away important details.

### `@keywork/utils`

![npm (scoped)](https://img.shields.io/npm/v/@keywork/utils)
![npm](https://img.shields.io/npm/dm/@keywork/utils)

Common core utilities for building web apps.

- HTTP responses for content like JSON, HTML, and much more!
- Type-safe request handlers that make API endpoints easy.
- Cache headers, cache responses, and even ETag generation for your own content.
- Simplified error handling for your server-side Worker logic.
- URL helpers, path builders.
- ULID and Snowflake ID generation.
- Isomorpic runtime error handling for both the browser, and your Worker.
- Logging that helps you better trace down errors as your app grows.
- All the typical "junk drawer" stuff you usually have to implement when building a web app.
