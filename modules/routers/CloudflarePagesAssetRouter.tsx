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

import React from 'https://esm.sh/react@18.2.0'
import { ServiceBindingRouter } from './ServiceBindingRouter.tsx'

/**
 * An asset environment binding available within Cloudflare Pages.
 *
 * This binding only exists in Cloudflare __Pages__.
 *
 * See [`WorkerSitesAssetRouter`](https://keywork.app/modules/middleware/classes/WorkerSitesAssetRouter) For use with Cloudflare Pages
 * @ignore
 */
export const CloudflarePagesBindingAlias = 'ASSETS'

/**
 * Handles incoming requests for static assets uploaded to Cloudflare Pages.
 *
 * This binding only exists in Cloudflare __Pages__.
 *
 * @see {WorkerSitesAssetRouter} If you're using Worker Sites
 *
 * @category Cloudflare Middleware
 */
export const CloudflarePagesAssetRouter: React.FC = () => {
  return <ServiceBindingRouter alias={CloudflarePagesBindingAlias} />
}
