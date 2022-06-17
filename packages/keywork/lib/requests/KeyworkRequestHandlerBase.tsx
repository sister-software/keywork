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

import { PathPattern } from 'keywork/paths'
import { ErrorResponse } from 'keywork/responses'
import { KeyworkSession } from 'keywork/sessions'
import { PrefixedLogger } from 'keywork/utilities'
import { HTTPMethod, KeyworkPageFunctionData, PossiblePromise, WorkerRequestHandler } from './common.js'

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
export abstract class _KeyworkRequestHandlerBase<
  BoundAliases extends {} | null = null,
  ParamKeys extends string = any,
  Data extends KeyworkPageFunctionData = KeyworkPageFunctionData
> {
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
  // NOTE: Each method is marked as initialized to prevent TypeScript
  // from autocompleting `undefined`

  /**
   * An incoming `GET` request handler.
   *
   * @public
   */
  public onRequestGet!: PagesFunction<BoundAliases, ParamKeys, Data>

  /**
   * An incoming `POST` request handler.
   *
   * @public
   */
  public onRequestPost!: PagesFunction<BoundAliases, ParamKeys, Data>

  /**
   * An incoming `PUT` request handler.
   *
   * @public
   */
  public onRequestPut!: PagesFunction<BoundAliases, ParamKeys, Data>

  /**
   * An incoming `PATCH` request handler.
   *
   * @public
   */
  public onRequestPatch!: PagesFunction<BoundAliases, ParamKeys, Data>

  /**
   * An incoming `DELETE` request handler.
   *
   * @public
   */
  public onRequestDelete!: PagesFunction<BoundAliases, ParamKeys, Data>

  /**
   * An incoming `HEAD` request handler.
   *
   * @public
   */
  public onRequestHead!: PagesFunction<BoundAliases, ParamKeys, Data>

  /**
   * An incoming `OPTIONS` request handler.
   *
   * @public
   */
  public onRequestOptions!: PagesFunction<BoundAliases, ParamKeys, Data>

  /**
   * An incoming request handler for all HTTP methods.
   *
   * @remarks
   * This will always be a **lower priority** than an explicitly defined method handler.
   *
   * @public
   */
  public onRequest!: PagesFunction<BoundAliases, ParamKeys, Data>

  //#endregion

  /**
   * @internal
   */
  protected _onInvalidRequest: PagesFunction<BoundAliases, ParamKeys, Data> = ({ request }) => {
    return new ErrorResponse(405, `Method ${request.method} was rejected.`)
  }

  /**
   * Returns a specific handler for the given HTTP method.
   *
   * @internal
   */
  protected _getHandlerForMethod(method: HTTPMethod): PagesFunction<BoundAliases, ParamKeys, Data> {
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
        return this.onRequest
    }
  }

  next: EventContext<BoundAliases, ParamKeys, Data>['next'] = async (input, init) => {
    if (!input || typeof input === 'string') return new Response(input, init)

    return fetch(input.clone())
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
    (...args: Parameters<PagesFunction<BoundAliases, ParamKeys, Data>>): PossiblePromise<Response>
    (...args: Parameters<WorkerRequestHandler<BoundAliases>>): PossiblePromise<Response>
  } = (...args: unknown[]): PossiblePromise<Response> => {
    let eventContext: EventContext<BoundAliases, ParamKeys, Data>

    if (args.length >= 3) {
      const [request, env, executionContext] = args as Parameters<WorkerRequestHandler<BoundAliases>>

      eventContext = {
        request,
        env: env as any,
        waitUntil: executionContext.waitUntil,
        data: {} as Data,
        params: {} as Params<ParamKeys>,
        functionPath: '',
        next: this.next,
      }
    } else {
      // Args are already in a PagesFunction shape.
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[eventContext] = args as Parameters<PagesFunction<BoundAliases, ParamKeys, Data>>
    }

    eventContext.data = {
      ...eventContext.data,
      session: new KeyworkSession(eventContext.request),
    }

    const handler = this._getHandlerForMethod(eventContext.request.method as HTTPMethod)

    try {
      if (!handler) return this._onInvalidRequest(eventContext)

      return handler.call(this, eventContext)
    } catch (_error) {
      this.logger.error(_error)
      this.logger.debug(eventContext)
      return ErrorResponse.fromUnknownError(_error, 'A server error occurred. Please try again later.')
    }
  }
}
