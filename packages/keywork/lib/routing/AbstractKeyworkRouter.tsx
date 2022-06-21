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

import { matchPath, PathPattern } from 'keywork/paths'
import { ErrorResponse } from 'keywork/responses'
import { KeyworkSession } from 'keywork/sessions'
import { PrefixedLogger } from 'keywork/utilities'
import {
  HTTPMethod,
  KeyworkPageFunctionData,
  PossiblePromise,
  RequestWithCFProperties,
  RouteRequestHandler,
  WorkerRequestHandler,
} from './common.js'

/**
 * @ignore
 */
const $KeyworkRequestHandler = Symbol('KeyworkRequestHandler')

/**
 * An extendable base class for handling incoming requests from a Worker.
 *
 * @typeDef BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeDef StaticProps Optional static props returned by `getStaticProps`
 * @typeDef ParamKeys Optional string union of route path parameters. Only supported in Cloudflare Pages.
 * @typeDef Data Optional extra data to be passed to a route handler.
 *
 * @ignore
 * @protected
 */
export abstract class AbstractKeyworkRouter<
  BoundAliases extends {} | null = null,
  ParamKeys extends string = any,
  Data extends KeyworkPageFunctionData = KeyworkPageFunctionData
> {
  [$KeyworkRequestHandler] = true

  /**
   * A `path-to-regexp` style pattern.
   *
   * @see {@link https://www.npmjs.com/package/path-to-regexp NPM Package}
   */
  static pattern: PathPattern<string> | string = '*'

  /**
   * @deprecated This property should be defined as a static member.
   * Did you mean `static pattern = '/:foo/:bar/:baz'`
   */
  protected readonly pattern = null as never

  /**
   * A server-side logger.
   */
  public logger = new PrefixedLogger('Keywork Route Handler')

  //#region Request method handlers

  /**
   * An incoming `GET` request handler.
   *
   * @public
   */
  public onRequestGet: RouteRequestHandler<BoundAliases, ParamKeys, Data> | undefined

  /**
   * An incoming `POST` request handler.
   *
   * @public
   */
  public onRequestPost: RouteRequestHandler<BoundAliases, ParamKeys, Data> | undefined

  /**
   * An incoming `PUT` request handler.
   *
   * @public
   */
  public onRequestPut: RouteRequestHandler<BoundAliases, ParamKeys, Data> | undefined

  /**
   * An incoming `PATCH` request handler.
   *
   * @public
   */
  public onRequestPatch: RouteRequestHandler<BoundAliases, ParamKeys, Data> | undefined

  /**
   * An incoming `DELETE` request handler.
   *
   * @public
   */
  public onRequestDelete: RouteRequestHandler<BoundAliases, ParamKeys, Data> | undefined

  /**
   * An incoming `HEAD` request handler.
   *
   * @public
   */
  public onRequestHead: RouteRequestHandler<BoundAliases, ParamKeys, Data> | undefined

  /**
   * An incoming `OPTIONS` request handler.
   *
   * @public
   */
  public onRequestOptions: RouteRequestHandler<BoundAliases, ParamKeys, Data> | undefined

  /**
   * An incoming request handler for all HTTP methods.
   *
   * @remarks
   * This will always be a **lower priority** than an explicitly defined method handler.
   *
   * @public
   */
  public onRequest: RouteRequestHandler<BoundAliases, ParamKeys, Data> | undefined

  //#endregion

  /**
   * @internal
   */
  protected _onInvalidRequest: RouteRequestHandler<BoundAliases, ParamKeys, Data> = ({ request }) => {
    return new ErrorResponse(405, `Method ${request.method} was rejected.`)
  }

  /**
   * Returns a specific handler for the given HTTP method.
   *
   * @internal
   */
  protected _getHandlerForMethod(method: HTTPMethod): RouteRequestHandler<BoundAliases, ParamKeys, Data> | undefined {
    switch (method) {
      case 'GET':
        return this.onRequestGet
      case 'POST':
        return this.onRequestPost
      case 'PUT':
        return this.onRequestPut
      case 'PATCH':
        return this.onRequestPatch
      case 'DELETE':
        return this.onRequestDelete
      case 'HEAD':
        return this.onRequestHead
      case 'OPTIONS':
        return this.onRequestOptions
      default:
        return undefined
    }
  }

  protected _nextStub: EventContext<BoundAliases, ParamKeys, Data>['next'] = async (request, requestInit) => {
    if (!request || typeof request === 'string') {
      return new Response(request, requestInit)
    }

    return fetch(request.clone())
  }

  /**
   * The Worker's primary incoming fetch handler.
   *
   * @remarks
   * This delegates to a method-specfic handler you define, such as `onGetRequest`.
   * Generally, `KeyworkRequestHandler#fetch` should not be used within your app.
   * This is instead automatically called by the Worker runtime when an incoming request is received.
   *
   * @public
   */
  fetch: {
    (...args: Parameters<RouteRequestHandler<BoundAliases, ParamKeys, Data>>): PossiblePromise<Response>
    (...args: Parameters<WorkerRequestHandler<BoundAliases>>): PossiblePromise<Response>
  } = (...args: unknown[]): PossiblePromise<Response> => {
    // First, normalize the arguments between Cloudflare Pages and Worker Sites...
    let eventContext: Omit<EventContext<BoundAliases, ParamKeys, Data>, 'passThroughOnException'>

    if (args.length >= 3) {
      // Worker Site...
      const [request, env, executionContext] = args as Parameters<WorkerRequestHandler<BoundAliases>>

      eventContext = {
        request,
        env: env as any,
        waitUntil: executionContext.waitUntil,
        data: {} as Data,
        params: {} as Params<ParamKeys>,
        functionPath: '',
        next: this._nextStub,
      }
    } else {
      // Args are already in a RouteRequestHandler shape.
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[eventContext] = args as Parameters<RouteRequestHandler<BoundAliases, ParamKeys, Data>>
    }

    eventContext.data = {
      ...eventContext.data,
      session: new KeyworkSession(eventContext.request),
    }

    const url = new URL(eventContext.request.url)
    const router = this.matchRoute(url)

    if (router) {
      eventContext.next = async (input, requestInit) => {
        const request = (input ? new Request(input, requestInit) : eventContext.request) as RequestWithCFProperties

        return router.fetch(request, eventContext.env, eventContext)
      }
    }

    // With our event context constructed, we can check for any defined methods...
    // If a method exists and routes are defined, it acts like middleware.
    const handler = this._getHandlerForMethod(eventContext.request.method as HTTPMethod) || this.onRequest

    try {
      if (!handler) return this._onInvalidRequest(eventContext)

      return handler.call(this, eventContext)
    } catch (_error) {
      this.logger.error(_error)
      this.logger.debug(eventContext)
      return ErrorResponse.fromUnknownError(_error, 'A server error occurred. Please try again later.')
    }
  }

  protected routePatternToHandler: Map<string, RouterLike<BoundAliases>>

  constructor(routePatterns?: Array<[string, RouterLike<BoundAliases>]>) {
    this.routePatternToHandler = new Map(routePatterns)
  }

  public matchRoute(location: URL): RouterLike<BoundAliases> | null {
    const patternMatch = Array.from(this.routePatternToHandler.keys()).find((pattern) => {
      return matchPath(pattern, location.pathname)
    })

    const routeHandler = this.routePatternToHandler.get(patternMatch || '')

    if (!routeHandler) return null

    return routeHandler
  }
}

/**
 *
 * @internal
 * @ignore
 */
export function isKeyworkRouterLike<BoundAliases extends {} | null = null>(
  routerLike: unknown
): routerLike is AbstractKeyworkRouter<BoundAliases> {
  return Boolean(
    routerLike instanceof AbstractKeyworkRouter ||
      (routerLike && typeof routerLike === 'object' && $KeyworkRequestHandler in routerLike)
  )
}

/**
 * Either a router or an env binding with a fetcher.
 */
export type RouterLike<BoundAliases extends {} | null = null> =
  | AbstractKeyworkRouter<BoundAliases, any, any>
  | { fetch: WorkerRequestHandler<BoundAliases> }
