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

import { KeyworkHTMLDocumentComponent, KeyworkProvidersComponent } from 'keywork/react/worker'
import { KeyworkSessionOptions } from '../../sessions/KeyworkSession.js'
import { KeyworkFetcher } from '../fetcher.js'
import type { WorkerRouter } from './WorkerRouter.js'

/**
 * Middleware declaration in the convenient shape of `Map`'s constructor parameters.
 *
 * @category Options
 * @typeParam PathPatternPrefix A path prefix defining where the middleware should be mounted. Combines with the given router's routes.
 */
export type MiddlewareDeclaration<PathPatternPrefix extends string = string> = readonly [
  PathPatternPrefix,
  WorkerRouter<any> | KeyworkFetcher<any>
]

/**
 * Options to configure the Worker Router.
 * @category Options
 */
export interface WorkerRouterOptions {
  /**
   * A display name used for debugging and log messages.
   * @defaultValue `'Keywork Router'`
   */
  displayName?: string
  /**
   * Middleware to apply to the router during construction.
   * Middleware can also be applied via `WorkerRouter#use`.
   */
  middleware?: Array<MiddlewareDeclarationLike>

  /**
   * Whether debugging headers should be included.
   * @defaultValue `true`
   */
  includeDebugHeaders?: boolean
  /**
   * A HTML Document React component which wraps the entire application.
   * Use this if you need to replace the default HTML Document.
   */
  DocumentComponent?: KeyworkHTMLDocumentComponent
  /**
   * A React component which wraps the SSR routes.
   * Use this if you need to inject a provider into the SSR pipeline.
   */
  Providers?: KeyworkProvidersComponent

  session?: KeyworkSessionOptions | boolean
}

/** @ignore */
export type MiddlewareDeclarationLike = WorkerRouter<any> | MiddlewareDeclaration

/**
 * Utility function for parsing middleware options.
 * @ignore
 * @category Type Cast
 */
export function isMiddlewareDeclarationOption(
  optionValue: MiddlewareDeclarationLike
): optionValue is MiddlewareDeclaration {
  return Array.isArray(optionValue)
}
