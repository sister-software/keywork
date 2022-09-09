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
import React, { useMemo } from 'https://esm.sh/react@18.2.0'
import { useEnvironment, useFetchEvent, useLogger } from '../contexts/mod.ts'
import { useServerEffect } from '../contexts/ServerEffectContext.ts'
import { KeyworkResourceError } from '../errors/mod.ts'
import { cloneAsMutableResponse } from '../http/mod.ts'
import type { KVNamespace } from '../__internal/interfaces/kv.ts'
/**
 * An asset environment binding available within Cloudflare Pages.
 *
 * This binding only exists in Cloudflare __Pages__.
 *
 * See [`CloudflarePagesAssetRouter`](https://keywork.app/modules/middleware/classes/CloudflarePagesAssetRouter) For use with Cloudflare Pages
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
 * ```ts
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
 * @category Cloudflare Middleware
 */
export interface WorkersSiteStaticContentBinding {
  __STATIC_CONTENT: KVNamespace
}

export interface WorkerSitesAssetRouterProps {
  /**
   * Injected via:
   *
   * ```ts
   * import manifestJSON from '__STATIC_CONTENT_MANIFEST'
   * ```
   */
  rawAssetManifest: string
}

/**
 * Handles incoming requests for static assets uploaded to Cloudflare KV.
 * @beta This is under active development
 * @category Asset Router
 * @see {CloudflarePagesAssetRouter}
 */
export const WorkerSitesAssetRouter: React.FC<WorkerSitesAssetRouterProps> = ({ rawAssetManifest }) => {
  const logger = useLogger('Worker Sites Assets')
  const assetNamespace = useEnvironment<WorkersSiteStaticContentBinding>('__STATIC_CONTENT')
  const fetchEvent = useFetchEvent()
  const assetManifest = useMemo(() => {
    try {
      return JSON.parse(rawAssetManifest)
    } catch (error) {
      logger.error(error)
      logger.warn('Is this well-formed JSON?', rawAssetManifest)
      throw new KeyworkResourceError('An error occurred while parsing the asset manifest.')
    }
  }, [logger, rawAssetManifest])

  useServerEffect(
    async ({ setResponse }) => {
      const response = await getAssetFromKV(fetchEvent, {
        ASSET_NAMESPACE: assetNamespace,
        ASSET_MANIFEST: assetManifest,
      })

      setResponse(cloneAsMutableResponse(response))
    },
    [assetManifest, assetNamespace, fetchEvent]
  )
  return null
}

// Re-exported to avoid type-mismatching downstream.
export type { AssetManifestType }
