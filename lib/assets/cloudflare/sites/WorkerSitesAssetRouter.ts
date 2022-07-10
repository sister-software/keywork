/**
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

import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import type { AssetManifestType } from '@cloudflare/kv-asset-handler/dist/types'
import { Status } from 'deno/http/http_status'
import { KeyworkResourceError } from 'keywork/errors'
import type { KVNamespace } from 'keywork/kv'
import { ErrorResponse } from 'keywork/responses'
import { RouteRequestHandler, WorkerRouter } from 'keywork/routing/worker'

/**
 * An asset environment binding available within Cloudflare Pages.
 *
 * @remarks
 * This binding only exists in Cloudflare __Pages__.
 *
 * @see {CloudflarePagesAssetRouter} For use with Cloudflare Pages
 */
export const AssetBindingAlias = 'ASSETS'

/**
 * An environment binding available within Worker Sites.
 * This is often used with the `@cloudflare/kv-asset-handler` package.
 *
 * @remarks
 * This binding only exists in Worker __Sites__.
 * Cloudflare __Pages__ instead uses `env.ASSETS`
 *
 *
 * When using ESBuild, ensure that the virtual module `__STATIC_CONTENT_MANIFEST`
 * is marked as external:
 *
 * ```js
 * import {build} from 'esbuild'
 *
 * build({ external: ['__STATIC_CONTENT_MANIFEST']})
 * ```
 *
 * For usage with TypeScript, you'll need to define a module type as well:
 *
 * ```ts
 * // types/cloudflare-worker.d.ts
 * declare module '__STATIC_CONTENT_MANIFEST'
 * ```
 *
 * @see {@link https://developers.cloudflare.com/pages/platform/functions/#advanced-mode Cloudflare Worker Pages API}
 *
 * @category Asset Router
 */
export interface WorkersSiteStaticContentBinding {
  __STATIC_CONTENT: KVNamespace
}

/**
 * Handles incoming requests for static assets uploaded to Cloudflare KV.
 * @beta This is under active development
 * @category Asset Router
 * @see {CloudflarePagesAssetRouter}
 */
export class WorkerSitesAssetRouter extends WorkerRouter<WorkersSiteStaticContentBinding> {
  /**
   * Injected via:
   *
   * ```ts
   * import manifestJSON from '__STATIC_CONTENT_MANIFEST'
   * ```
   */
  protected assetManifest: AssetManifestType = {}

  constructor(rawAssetManifest: string) {
    super({ displayName: 'Worker Sites Assets' })

    try {
      this.assetManifest = JSON.parse(rawAssetManifest)
    } catch (error) {
      this.logger.error(error)
      this.logger.warn('Is this well-formed JSON?', rawAssetManifest)
      throw new KeyworkResourceError('An error occurred while parsing the asset manifest.')
    }

    this.get('*', this.onRequestGet)
  }
  public onRequestGet: RouteRequestHandler<WorkersSiteStaticContentBinding> = ({ env, request, waitUntil }) => {
    if (env.__STATIC_CONTENT) {
      return getAssetFromKV(
        {
          request,
          waitUntil,
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: this.assetManifest,
        }
      )
    }

    return new ErrorResponse(Status.BadRequest)
  }
}

// Re-exported to avoid type-mismatching downstream.
export type { AssetManifestType }
