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

It's recommended that you create an ambient type file for any [environment bindings]() your Worker uses.

```ts title=types/bindings.d.ts
export {}

declare global {
  const MY_ENV_VAR: string
  const MY_SECRET: string
  const myKVNamespace: KVNamespace
}
```

### Deno

:::warning
Deno support is experimental and in active development.
While your project configuration may have to changing with API updates,
Keywork should generally behave as if you're using Cloudflare Workers.
:::

[Import Maps](https://deno.land/manual/node/import_maps#using-import-maps)
are recommended to avoid long import URLs:

```jsonc title=importmap.json
{
  "imports": {
    "keywork/routing": "https://cdn.skypack.dev/keywork@3.0.0/routing?dts",
    "keywork/utilities": "https://cdn.skypack.dev/keywork@3.0.0/utilities?dts"
    // etc
  }
}
```
