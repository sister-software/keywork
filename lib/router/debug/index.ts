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

import { HTTPMethod } from 'keywork/platform/http'
import { CompiledPath } from 'keywork/uri'

/**
 * Public endpoints to aid in debugging your app.
 * Available at `/keywork/*`
 */
export interface WorkerRouterDebugEndpoints {
  /**
   * `/keywork/routes`
   * JSON endpoint to display routes.
   */
  routes: boolean
}

export interface WorkerRouterDebugOptions {
  /**
   * Whether debugging headers should be included.
   * @defaultValue `true`
   */
  includeHeaders?: boolean

  /**
   * Debug endpoints to enable.
   * @defaultValue true
   */
  endpoints?: WorkerRouterDebugEndpoints | boolean
}

export interface RouteDebugEntrypoint {
  displayName: string
  kind: string
  httpMethod?: HTTPMethod
  compiledPath?: CompiledPath
  entries: RouteDebugEntrypoint[]
}
