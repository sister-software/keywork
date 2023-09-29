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

import type { SSRDocument } from 'keywork/events/SSRDocument'
import type { HTTPMethod } from 'keywork/http'
import type { MiddlewareDeclarationLike } from 'keywork/router/MiddlewareDeclarationLike'
import type { ReactRendererOptions } from 'keywork/ssr'
import type { KeyworkLogLevel } from 'keywork/utils'

/**
 * Public endpoints to aid in debugging your app.
 * Available at `/keywork/*`
 * @ignore
 */
export interface RequestRouterDebugEndpoints {
  /**
   * `/keywork/routes`
   * JSON endpoint to display routes.
   */
  routes: boolean
}

export interface RequestRouterDebugOptions {
  /**
   * Whether debugging headers should be included.
   * @defaultValue `true`
   */
  includeHeaders?: boolean

  /**
   * Debug endpoints to enable.
   * @defaultValue true
   */
  endpoints?: RequestRouterDebugEndpoints | boolean
}

export interface RouteDebugEntrypoint {
  displayName: string
  kind: string
  httpMethod?: HTTPMethod
  urlPattern?: URLPattern
  entries: RouteDebugEntrypoint[]
}

/**
 * Options to configure the Worker Router.
 * @category Options
 */
export interface RequestRouterOptions {
  /**
   * A display name used for debugging and log messages.
   * @defaultValue `'Keywork Router'`
   */
  displayName?: string

  /**
   * Middleware to apply to the router during construction.
   * Middleware can also be applied via `RequestRouter#use`.
   */
  middleware?: Array<MiddlewareDeclarationLike>

  document?: SSRDocument
  react?: ReactRendererOptions
  debug?: RequestRouterDebugOptions
  /**
   * The log level to use for the router.
   *
   * @see {@linkcode KeyworkLogLevel}
   * @defaultValue 'Info'
   */
  logLevel?: KeyworkLogLevel
}
