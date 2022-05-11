import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { WorkersSiteStaticContentBinding } from './bindings.mjs'
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
