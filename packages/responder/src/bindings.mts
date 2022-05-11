/**
 * An environment binding within a worker that has a `fetch` method.
 * This usually is related to static assets uploaded to Cloudflare KV via Wrangler's Worker Sites.
 */
export type WorkerEnvFetchBinding = {
  fetch: typeof fetch
}

/**
 * An environment binding available within Worker Sites.
 * This is often used with the `@cloudflare/kv-asset-handler` package.
 *
 * @remark This binding only exists in Worker __Sites__.
 * Worker __Pages__ instead uses `env.ASSETS`
 * @see https://developers.cloudflare.com/pages/platform/functions/#advanced-mode
 *
 * @remark When using ESBuild, ensure that the virtual module `__STATIC_CONTENT_MANIFEST`
 * is marked as external. e.g.
 * ```js
 * import {build} from 'esbuild'
 *
 * build({ external: ['__STATIC_CONTENT_MANIFEST']})
 * ```
 */
export interface WorkersSiteStaticContentBinding {
  __STATIC_CONTENT: KVNamespace
  ASSETS: undefined
}

/**
 * An environment binding available within Worker Pages.
 *
 * @remark This binding only exists in Worker __Pages__.
 */
export interface WorkersPagesAssetsBinding {
  ASSETS: WorkerEnvFetchBinding
  __STATIC_CONTENT: undefined
}

export type EnvironmentBindingKinds = WorkerEnvFetchBinding | KVNamespace | DurableObjectNamespace

export interface EnvironmentBindingLike {
  [bindingName: string]: EnvironmentBindingKinds
}

export type CommonWorkerEnvironmentBindings<BoundAliases extends EnvironmentBindingLike = {}> = (
  | WorkersSiteStaticContentBinding
  | WorkersPagesAssetsBinding
) &
  BoundAliases
