---
title: Overview
sidebar_label: Module Overview
sidebar_position: 0
pagination_label: 'Module: Assets'
---

Keywork provides static asset helpers as `KeyworkRouter` Middleware.
Depending on your deployment setup, how you manage your static assets
may vary.

## Serving assets from Cloudflare Pages

If you're using Cloudflare Pages, static assets will be configured in your
Pages build settings. You'll need `CloudflarePagesAssetRouter`:

```tsx title=worker/worker.tsx showLineNumbers
import { YourAppRoutes } from '@local/worker/routers/your-app-routes'
import { KeyworkRouter } from 'keywork/router'
// highlight-next-line
import { CloudflarePagesAssetRouter } from 'keywork/assets'

// Create a router to receive all incoming requests...
const app = new KeyworkRouter({
  // A display name used for debugging and log messages.
  displayName: 'Example Keywork App',
  // Here we combine our routers...
  middleware: [
    YourAppRoutes,
    // highlight-next-line
    new CloudflarePagesAssetRouter(),
  ],
})
```

## Serving assets from Worker Sites

If you're using Worker Sites, static assets are configured via your `wrangler.toml` file.
You'll instead need `WorkerSitesAssetRouter`

```tsx title=worker/worker.tsx showLineNumbers
import { YourAppRoutes } from '@local/worker/routers/your-app-routes'
import { KeyworkRouter } from 'keywork/router'
// highlight-next-line
import { WorkerSitesAssetRouter } from 'keywork/assets'
// highlight-next-line
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

// Create a router to receive all incoming requests...
const app = new KeyworkRouter({
  // A display name used for debugging and log messages.
  displayName: 'Example Keywork App',
  // Here we combine our routers...
  middleware: [
    YourAppRoutes,
    // highlight-next-line
    new WorkerSitesAssetRouter(manifestJSON),
  ],
})
```
