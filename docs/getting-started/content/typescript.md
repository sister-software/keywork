---
id: type-safe
title: Writing Type-safe apps
sidebar_position: 5
sidebar_label: TypeScript
---

Keywork uses TypeScript to ensure type-safety while you develop your web app.
And with built-in error guards, Keywork allows your app to fail gracefully
if a runtime exception occurs while your app is deployed.

## Runtime Configuration

### Cloudflare Workers

Type definitions are automatically included when installing Keywork via NPM.
However, if you're using Skypack

Cloudflare also provides type definition for their runtime via [@cloudflare/workers-types](https://github.com/cloudflare/workers-types)

```shell
yarn add --dev @cloudflare/workers-types
```

### Using environment bindings with TypeScript

It's recommended that you create an ambient type file for any [environment bindings](https://developers.cloudflare.com/workers/platform/bindings/) your Worker uses.

```ts title=types/bindings.d.ts
export {}

declare global {
  const MY_ENV_VAR: string
  const MY_SECRET: string
  const myKVNamespace: KVNamespace
}
```

### Deno Deploy

Keywork can be used directly via [Deno Land](https://deno.land/x/keywork):

```tsx title="worker"
import { serve } from 'https://deno.land/std@0.140.0/http/server.ts'
import { KeyworkRouter } from 'https://deno.land/x/keywork/modules/router/mod.ts'

const app = new KeyworkRouter()

app.get('/', () => <h1>Hello from Keywork! 👋</h1>)

serve((request) => app.fetch(request))
```

### Import Maps

[Import Maps](https://deno.land/manual/node/import_maps#using-import-maps)
are recommended to avoid long import URLs:

```jsonc title=importmap.json
{
  "imports": {
    "keywork/router": "https://deno.land/x/keywork/router/mod.ts",
    "keywork/uri": "https://deno.land/x/keywork/uri/mod.ts"
    // etc
  }
}
```
