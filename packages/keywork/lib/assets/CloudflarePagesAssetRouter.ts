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

import { ServiceBindingRouter } from 'keywork/routing'
import { AssetBindingAliases } from './common.js'

/**
 * Handles incoming requests for static assets uploaded to Cloudflare Pages.
 *
 * @remarks
 * This binding only exists in Cloudflare __Pages__.
 *
 * @see {WorkerSitesAssetRouter} If you're using Worker Sites
 * @category Asset Router
 */
export class CloudflarePagesAssetRouter extends ServiceBindingRouter<AssetBindingAliases.CloudflarePages> {
  constructor() {
    super(AssetBindingAliases.CloudflarePages, {
      displayName: 'Cloudflare Pages Assets',
    })
  }
}