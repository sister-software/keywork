---
title: "Interface: WorkersSiteStaticContentBinding"
sidebar_label: "WorkersSiteStaticContentBinding"
sidebar_class_name: "doc-kind-interface"
---

# Interface: WorkersSiteStaticContentBinding

[keywork](../modules/keywork).WorkersSiteStaticContentBinding

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

## Properties

### ASSETS

• **ASSETS**: `undefined`

#### Defined in

[packages/keywork/lib/bindings/assets.ts:46](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/bindings/assets.ts#L46)

___

### \_\_STATIC\_CONTENT

• **\_\_STATIC\_CONTENT**: `KVNamespace`<`string`\>

#### Defined in

[packages/keywork/lib/bindings/assets.ts:45](https://github.com/nirrius/keywork/blob/73ad60a/packages/keywork/lib/bindings/assets.ts#L45)
