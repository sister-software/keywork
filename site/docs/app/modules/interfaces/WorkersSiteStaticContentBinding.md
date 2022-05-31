# Interface: WorkersSiteStaticContentBinding

An environment binding available within Worker Sites.
This is often used with the `@cloudflare/kv-asset-handler` package.

**`remarks`** This binding only exists in Worker __Sites__.
Worker __Pages__ instead uses `env.ASSETS`

When using ESBuild, ensure that the virtual module `__STATIC_CONTENT_MANIFEST`
is marked as external:

```js
import {build} from 'esbuild'

build({ external: ['__STATIC_CONTENT_MANIFEST']})
```

**`see`** [Cloudflare Worker Pages API](https://developers.cloudflare.com/pages/platform/functions/#advanced-mode)

## Table of contents

### Properties

- [ASSETS](WorkersSiteStaticContentBinding.md#assets)
- [\_\_STATIC\_CONTENT](WorkersSiteStaticContentBinding.md#__static_content)

## Properties

### ASSETS

• **ASSETS**: `undefined`

#### Defined in

[src/bindings/assets.ts:46](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/bindings/assets.ts#L46)

___

### \_\_STATIC\_CONTENT

• **\_\_STATIC\_CONTENT**: `KVNamespace`<`string`\>

#### Defined in

[src/bindings/assets.ts:45](https://github.com/nirrius/keywork/blob/3dc0058/packages/app/src/bindings/assets.ts#L45)
