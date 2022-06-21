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

import {
  KeyworkHTMLDocumentComponent,
  KeyworkProvidersComponent,
  renderStaticPropsAsComponentStream,
  renderStaticPropsAsJSON,
  SSRPropsLike,
} from 'keywork/react'
import { ErrorResponse, HTMLResponse } from 'keywork/responses'
import { KeyworkQueryParamKeys } from 'keywork/utilities'
import type { FC } from 'react'
import { AbstractKeyworkRouter } from './AbstractKeyworkRouter.js'
import { GetStaticProps, HTTPMethod, RouteRequestHandler } from './common.js'

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
 * @typeDef BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeDef StaticProps Optional static props returned by `getStaticProps`
 * @typeDef ParamKeys Optional string union of route path parameters. Only supported in Cloudflare Pages.
 * @typeDef Data Optional extra data to be passed to a route handler.
 *
 * @category Incoming Request Handlers
 * @public
 */
export abstract class KeyworkRouter<
  BoundAliases extends {} | null = null,
  StaticProps extends SSRPropsLike = {},
  ParamKeys extends string = any,
  Data extends Record<string, unknown> = Record<string, unknown>
> extends AbstractKeyworkRouter<BoundAliases, ParamKeys, Data> {
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
   * @category Routing
   * @public
   */
  public getStaticProps: GetStaticProps<BoundAliases, StaticProps, ParamKeys, Data> | undefined

  /**
   * @internal
   */
  protected _onRequestGetReactComponent: RouteRequestHandler<BoundAliases, ParamKeys, Data> = async (
    context
  ): Promise<HTMLResponse> => {
    const location = new URL(context.request.url)

    const onlySendStaticProps = location.searchParams.has(KeyworkQueryParamKeys.StaticProps)
    let staticProps = {} as NonNullable<StaticProps>

    if (!this.PageComponent) {
      return new ErrorResponse(500, 'Request handler missing method `PageComponent`')
    }

    if (this.getStaticProps) {
      try {
        staticProps = (await this.getStaticProps(context)) as NonNullable<StaticProps>
      } catch (error) {
        this.logger.error(error)
        return ErrorResponse.fromUnknownError(error)
      }
    }

    if (onlySendStaticProps) {
      return renderStaticPropsAsJSON(context.request, staticProps || {})
    }

    return renderStaticPropsAsComponentStream(
      context,
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
    return Boolean(this.PageComponent)
  }

  /**
   * Returns a specific handler for the given HTTP method.
   * @internal
   */
  protected override _getHandlerForMethod(method: HTTPMethod) {
    if (method === 'GET' && this._handlerPrefersReactRenderer()) {
      return this._onRequestGetReactComponent
    }

    return super._getHandlerForMethod(method)
  }
}
