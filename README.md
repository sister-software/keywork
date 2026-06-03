# Keywork

**Keywork** is a batteries-included library for building serverless web apps on Cloudflare Workers, Deno, and Node.JS

> [!CAUTION]
> **Keywork is no longer actively developed.**
>
> Keywork set out to make serverless web apps simpler — especially treating request context like a React context, with providers and hooks. The ecosystem has since caught up and, in most cases, surpassed it. For new projects, these are better choices:
>
> - **[Hono](https://hono.dev)** — the closest spiritual successor: a web-standards router across Workers, Deno, Bun, and Node, with a typed request `Context`, onion middleware, and `jsxRenderer` + `useRequestContext()` for reading request context directly inside server-rendered JSX.
> - **[itty-router](https://itty.dev/itty-router)** — a tiny, dependency-free router you assemble yourself.
> - **[Elysia](https://elysiajs.com)** — Bun-first, with best-in-class end-to-end type inference and the Eden type-safe client.
> - **[Nitro](https://nitro.build) / [h3](https://h3.dev)** — a composable, event-based server toolkit with ambient request context via `useEvent()`.
>
> The technique Keywork lacked — ambient, async-safe request context via `AsyncLocalStorage` (and the emerging TC39 `AsyncContext`) — is now broadly available, and these projects build on it directly. Keywork remains here for reference and existing users.

```tsx
import { RequestRouter } from 'keywork/router'

const app = new RequestRouter()

app.get('/', () => <h1>Hello from Keywork! 👋</h1>)

export default app
```

## License

Keywork is licensed under [AGPL-3.0](./LICENSE.md). Commercial use requires a separate license.
