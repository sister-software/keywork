---
title: 'Polyfill: ReadableStream'
sidebar_label: Module Overview
tags: ['Module']
sidebar_position: 0
pagination_label: 'Module: Polyfills.Worker.ReadableStream'
---

`ReadableStream` Polyfill for building Keywork apps on Cloudflare Pages.

### Usage with ESBuild

```js
import esbuild from 'esbuild'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

esbuild.build({
  format: 'esm',
  entryPoints,
  keepNames: true,
  inject: [require.resolve('keywork/polyfills/ReadableStream')],
})
```

:::tip
Make sure to set `keepNames` to preserve the polyfill's class names during minification.
:::
