/**
 * Router bindings allow your Worker to interact with resources provided by your app's runtime.
 *
 * ## Static Assets
 *
 * Keywork provides static asset helpers as
 * {@link Keywork#Router.KeyworkRouter `KeyworkRouter`} Middleware.
 * Depending on your deployment setup, how you manage your static assets may vary.
 *
 * ### Serving assets from Cloudflare Pages
 *
 * If you're using Cloudflare Pages, static assets will be configured in your Pages build settings.
 * You'll need {@link Keywork#Router#Cloudflare.CloudflarePagesAssetRouter `CloudflarePagesAssetRouter`}
 *
 * ```tsx title=worker/worker.tsx showLineNumbers
 * import { YourAppRoutes } from '@local/worker/routers/your-app-routes'
 * import { KeyworkRouter } from 'keywork/router'
 * // highlight-next-line
 * import { CloudflarePagesAssetRouter } from 'keywork/router/cloudflare'
 *
 * // Create a router to receive all incoming requests...
 * const app = new KeyworkRouter({
 *   // A display name used for debugging and log messages.
 *   displayName: 'Example Keywork App',
 *   // Here we combine our routers...
 *   middleware: [
 *     YourAppRoutes,
 *     // highlight-next-line
 *     new CloudflarePagesAssetRouter(),
 *   ],
 * })
 * ```
 *
 * ### Serving assets from Worker Sites
 *
 * If you're using Worker Sites, static assets are configured via your `wrangler.toml` file.
 * You'll instead need {@link Keywork#Router#Cloudflare.WorkerSitesAssetRouter `WorkerSitesAssetRouter`}
 *
 * ```tsx title=worker/worker.tsx showLineNumbers
 * import { YourAppRoutes } from '@local/worker/routers/your-app-routes'
 * import { KeyworkRouter } from 'keywork/router'
 * // highlight-next-line
 * import { WorkerSitesAssetRouter } from 'keywork/router/cloudflare'
 * // highlight-next-line
 * import manifestJSON from '__STATIC_CONTENT_MANIFEST'
 *
 * // Create a router to receive all incoming requests...
 * const app = new KeyworkRouter({
 *   // A display name used for debugging and log messages.
 *   displayName: 'Example Keywork App',
 *   // Here we combine our routers...
 *   middleware: [
 *     YourAppRoutes,
 *     // highlight-next-line
 *     new WorkerSitesAssetRouter(manifestJSON),
 *   ],
 * })
 * ```
 *
 * ## Resources
 *
 * - ["Bindings" via Cloudflare Docs](https://developers.cloudflare.com/workers/platform/bindings/)
 *
 * @packageDocumentation
 * @module Keywork#Router#Cloudflare
 *
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remarks Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */
/* eslint-disable header/header */

export * from './classes/mod.ts'
