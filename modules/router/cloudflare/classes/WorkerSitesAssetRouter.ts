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

import { getAssetFromKV } from 'https://esm.sh/@cloudflare/kv-asset-handler@0.2.0'
import type { AssetManifestType } from 'https://esm.sh/@cloudflare/kv-asset-handler@0.2.0/dist/types'
import { KeyworkResourceError, Status } from '../../../errors/mod.ts'
import type { KVNamespace } from '../../../kv/cloudflare/mod.ts'
import { ErrorResponse } from '../../../http/response/mod.ts'
import { RouteRequestHandler } from '../../interfaces/RouteRequestHandler.ts'
import { KeyworkRouter } from '../../worker/mod.ts'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { CloudflarePagesAssetRouter } from './CloudflarePagesAssetRouter.ts'
/**
 * An asset environment binding available within Cloudflare Pages.
 *
 * This binding only exists in Cloudflare __Pages__.
 *
 * @see {CloudflarePagesAssetRouter} For use with Cloudflare Pages
 * @ignore
 */
export const AssetBindingAlias = 'ASSETS'

/**
 * An environment binding available within Worker Sites.
 * This is often used with the `@cloudflare/kv-asset-handler` package.
 *
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
export class WorkerSitesAssetRouter extends KeyworkRouter<WorkersSiteStaticContentBinding> {
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
  public onRequestGet: RouteRequestHandler<WorkersSiteStaticContentBinding> = (event) => {
    if (event.env.__STATIC_CONTENT) {
      return getAssetFromKV(event, {
        ASSET_NAMESPACE: event.env.__STATIC_CONTENT,
        ASSET_MANIFEST: this.assetManifest,
      })
    }

    return new ErrorResponse(Status.BadRequest)
  }
}

// Re-exported to avoid type-mismatching downstream.
export type { AssetManifestType }
