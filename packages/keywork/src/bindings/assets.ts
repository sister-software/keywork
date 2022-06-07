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

/**
 * An environment binding available within Worker Pages.
 *
 * @remarks This binding only exists in Worker __Pages__.
 */
export interface WorkersPagesAssetsBinding {
  ASSETS: WorkerEnvFetchBinding
  __STATIC_CONTENT: undefined
}

/**
 * An environment binding available within Worker Sites.
 * This is often used with the `@cloudflare/kv-asset-handler` package.
 *
 * @remarks This binding only exists in Worker __Sites__.
 * Worker __Pages__ instead uses `env.ASSETS`
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
 * @see {@link https://developers.cloudflare.com/pages/platform/functions/#advanced-mode Cloudflare Worker Pages API}
 */
export interface WorkersSiteStaticContentBinding {
  __STATIC_CONTENT: KVNamespace
  ASSETS: undefined
}

import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import type { AssetManifestType } from '@cloudflare/kv-asset-handler/dist/types'
import { KeyworkResourceError } from '@keywork/utils'
import { IncomingRequestData } from '../requests/common.js'
import { KeyworkRequestHandler } from '../requests/KeyworkRequestHandler.js'
import { WorkerEnvFetchBinding } from './fetch.js'

// import manifestJSON from '__STATIC_CONTENT_MANIFEST'

/**
 * Handles incoming requests for static assets uploaded to Cloudflare KV.
 * @beta This is under active development
 * @category {Static Asset Management}
 */
export class KeyworkAssetHandler extends KeyworkRequestHandler<WorkersSiteStaticContentBinding> {
  protected assetManifest: AssetManifestType
  constructor(rawAssetManifest: string) {
    super()

    try {
      this.assetManifest = JSON.parse(rawAssetManifest)
    } catch (error) {
      this.logger.error(error)
      this.logger.warn('Is this well-formed JSON?', rawAssetManifest)
      throw new KeyworkResourceError('An error occurred while parsing the asset manifest.')
    }
  }
  onRequestGet = ({ env, request, context }: IncomingRequestData<WorkersSiteStaticContentBinding>) => {
    return getAssetFromKV(
      {
        request,
        waitUntil(promise) {
          return context.waitUntil(promise)
        },
      },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: this.assetManifest,
      }
    )
  }
}

export type { AssetManifestType }
