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

import { AbstractKeyworkRouter, RouteRequestHandler } from 'keywork/requests'
import { WorkerEnvFetchBinding } from '../fetch.js'

/**
 * An environment binding available within Worker Pages.
 *
 * @remarks
 * This binding only exists in Cloudflare __Pages__.
 * For Worker Sites, use
 */
export interface WorkersPagesAssetsBinding {
  ASSETS: WorkerEnvFetchBinding
  __STATIC_CONTENT: undefined
}

/**
 * Handles incoming requests for static assets uploaded to Cloudflare KV.
 *
 * @beta This is under active development
 * @category {Static Asset Management}
 */
export class KeyworkAssetsRouter extends AbstractKeyworkRouter<WorkersPagesAssetsBinding> {
  onRequestGet: RouteRequestHandler<WorkersPagesAssetsBinding> = ({ env, request }) => {
    return env.ASSETS.fetch(request)
  }
}
