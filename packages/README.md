---
id: api.readme
title: Keywork Overview
sidebar_position: 0
sidebar_label: Get Started
---

**Keywork** is a batteries-included, _magic-free_, library for building web apps on Cloudflare Workers.
## Packages

### `@keywork/app`

![npm (scoped)](https://img.shields.io/npm/v/@keywork/app)
![npm](https://img.shields.io/npm/dm/@keywork/app)

Everything you need to handle incoming request in a Worker environment.

- HTTP responses for content like JSON, HTML, and much more!
- Type-safe request handlers that make API endpoints easy.
- Cache headers, cache responses, and even ETag generation for your own content.
- Simplified error handling for your server-side Worker logic.

### `@keywork/react-isomorphic`

![npm (scoped)](https://img.shields.io/npm/v/@keywork/react-isomorphic)
![npm](https://img.shields.io/npm/dm/@keywork/react-isomorphic)


Everything you need to serve React apps from your Worker.

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
- Extends Worker KV's API without abstracting away important details

### `@keywork/utils`

![npm (scoped)](https://img.shields.io/npm/v/@keywork/utils)
![npm](https://img.shields.io/npm/dm/@keywork/utils)

Common core utilities for building web apps.

- URL helpers, path builders.
- ULID and Snowflake ID generation.
- Isomorpic runtime error handling for both the browser, and your Worker.
- Logging that helps you better trace down errors as your app grows.
- All the typical "junk drawer" stuff you usually have to implement when building a web app.

## License

Keywork is free software for non-commercial purposes.

You can be released from the requirements of the license by purchasing a commercial license.
Buying such a license is mandatory as soon as you develop commercial activities
involving the Keywork software without disclosing the source code of your own applications.

Contact `teffen [at] nirri [dot] us` for business inquiries.

## Acknowledgements

- Many thanks to the folks at Cloudflare and the Workers team 💞
- MrBBot and the developers of Miniflare
- The React community
