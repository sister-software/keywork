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
  inject: [ require.resolve('keywork/polyfills/ReadableStream') ]
})
```

:::note
Make sure to set `keepNames` to preserve the polyfill's class names during minification.
:::
