/**
 * An environment binding available within Worker Pages.
 *
 * @remark This binding only exists in Worker __Pages__.
 */
export interface WorkersPagesAssetsBinding {
  ASSETS: WorkerEnvFetchBinding
  __STATIC_CONTENT: undefined
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

import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { WorkerEnvFetchBinding } from './fetch.js'

// import manifestJSON from '__STATIC_CONTENT_MANIFEST'
// const assetManifest = JSON.parse(manifestJSON)

export class KeyworkAssetHandler {
  public async fetchStaticAsset(request: Request, env: WorkersSiteStaticContentBinding, ctx: ExecutionContext) {
    return getAssetFromKV(
      {
        request,
        waitUntil(promise) {
          return ctx.waitUntil(promise)
        },
      },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        // ASSET_MANIFEST: assetManifest,
      }
    )
  }
}
