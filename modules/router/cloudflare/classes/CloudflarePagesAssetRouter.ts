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

import { ServiceBindingRouter } from './ServiceBindingRouter.ts'

/**
 * An asset environment binding available within Cloudflare Pages.
 *
 * This binding only exists in Cloudflare __Pages__.
 *
 * See {@link Keywork#Router#Cloudflare.WorkerSitesAssetRouter `WorkerSitesAssetRouter`} For use with Cloudflare Pages
 * @ignore
 */
export const CloudflarePagesBindingAlias = 'ASSETS'

/**
 * Handles incoming requests for static assets uploaded to Cloudflare Pages.
 *
 * This binding only exists in Cloudflare __Pages__.
 *
 * @see {WorkerSitesAssetRouter} If you're using Worker Sites
 * @category Asset Router
 */
export class CloudflarePagesAssetRouter extends ServiceBindingRouter<typeof CloudflarePagesBindingAlias> {
  constructor() {
    super(CloudflarePagesBindingAlias, {
      displayName: 'Cloudflare Pages Assets',
    })
  }
}
