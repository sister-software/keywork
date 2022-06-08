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

import { ErrorResponse, HTMLResponse, KeyworkQueryParamKeys } from '@keywork/utils'
import type { FC } from 'react'
import { KeyworkHTMLDocumentComponent, KeyworkProvidersComponent } from '../components/index.js'
import { SSRPropsLike } from '../ssr/index.js'
import { renderStaticPropsAsComponentStream, renderStaticPropsAsJSON } from '../ssr/rendering/staticProps.js'
import { PossiblePromise, _HTTPMethod } from './common.js'
import { IncomingRequestData } from './IncomingRequestData.js'
import { _KeyworkRequestHandlerBase } from './KeyworkRequestHandlerBase.js'

/**
 * An extendable base class for handling incoming requests from a Worker.
 *
 * In the "Module Worker" format, incoming HTTP events are handled by defining and exporting an object with method handlers corresponding to event names.
 *
 * To create a route handler, start by first extending the `KeyworkRequestHandler` class.
 * Your implementation must at least include a `onRequestGet` handler, or a method-agnostic `onRequest` handler.
 *
 * - Always attempt to handle runtime errors gracefully, and respond with `KeyworkResourceError` when necessary.
 *
 * @category Incoming Request Handlers
 * @public
 */
export abstract class KeyworkRequestHandler<
  BoundAliases extends {} | null = null,
  StaticProps extends SSRPropsLike = null
> extends _KeyworkRequestHandlerBase<BoundAliases> {
  /**
   * The React component to render for this specific page.
   */
  protected PageComponent?: FC<StaticProps>

  /**
   * A React component which wraps the SSR routes.
   * Use this if you need to inject a provider into the SSR pipeline.
   */
  protected Providers?: KeyworkProvidersComponent
  /**
   * A HTML Document React component which wraps the entire application.
   * Use this if you need to replace the default HTML Document.
   */
  protected DocumentComponent?: KeyworkHTMLDocumentComponent

  /**
   * A method used to fetch static props for rendering React apps in your worker.
   *
   * @example
   * ```ts
   * import { KeyworkRequestHandler, GetStaticPropsHandler } from 'keywork'
   * import { StaticTodoPageProps, TodoPage } from './TodoPage.tsx'
   *
   * export class TodoWorker extends KeyworkRequestHandler<null, StaticTodoPageProps> {
   *   // A URL path pattern...
   *   static readonly pattern = '/todos/:todoID/'
   *   // And our React component from earlier.
   *   PageComponent = TodoPage
   *
   *   async getStaticProps({ request }: IncomingRequestData): Promise<StaticTodoPageProps> {
   *     // Attempt to get our params from the request...
   *     const { params } = parsePathname<TodoRouteParams>(TodoWorker.pattern, request)
   *     // "Search" the database for a match...
   *     const todoItem = exampleTodos[params.todoID]
   *
   *     if (!todoItem) {
   *       return new ErrorResponse(`Todo with ID ${todoItem} does not exist`, 404)
   *     }
   *
   *     // Return the expected static props!
   *     return {
   *       todoItem,
   *     }
   *   }
   * }
   * ```
   *
   */
  public getStaticProps?: (data: IncomingRequestData<BoundAliases>) => PossiblePromise<StaticProps>

  /**
   * @internal
   */
  protected async _onRequestGetReactComponent(data: IncomingRequestData<BoundAliases>): Promise<HTMLResponse> {
    const { request, url: location } = data
    const onlySendStaticProps = location.searchParams.has(KeyworkQueryParamKeys.StaticProps)

    if (!this.getStaticProps) {
      return new ErrorResponse(500, 'Request handler missing method `getStaticProps`')
    }

    if (!this.PageComponent) {
      return new ErrorResponse(500, 'Request handler missing method `PageComponent`')
    }

    let staticProps: NonNullable<StaticProps>

    try {
      staticProps = ((await this.getStaticProps(data)) || {}) as NonNullable<StaticProps>
    } catch (error) {
      this.logger.error(error)
      return ErrorResponse.fromUnknownError(error)
    }

    if (onlySendStaticProps) {
      return renderStaticPropsAsJSON(request, staticProps || {})
    }

    return renderStaticPropsAsComponentStream(
      request,
      staticProps,
      this.PageComponent as any,
      this.DocumentComponent as any,
      this.Providers as any
    )
  }

  /**
   * @internal
   */
  protected _handlerPrefersReactRenderer(): boolean {
    return Boolean(this.getStaticProps && this.PageComponent)
  }

  /**
   * Returns a specific handler for the given HTTP method.
   * This is overridden to prefer `_onRequestGetReactComponent` when `getStaticProps` is defined.
   *
   * @internal
   */
  protected override _getHandlerForMethod(method: _HTTPMethod) {
    if (method === 'GET' && this._handlerPrefersReactRenderer()) {
      return this._onRequestGetReactComponent
    }

    return super._getHandlerForMethod(method)
  }
}
