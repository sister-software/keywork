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

import { StatusCodes } from 'http-status-codes'
import { ErrorResponse } from 'keywork/responses'
import { KeyworkSession } from 'keywork/sessions'
import { PrefixedLogger } from 'keywork/utilities'
import {
  HTTPMethod,
  IncomingRequestContext,
  KeyworkPageFunctionData,
  KeyworkRouterLike,
  NormalizedHTTPMethod,
  RequestWithCFProperties,
  WorkerRequestHandler,
} from './common.js'
import { matchPath } from './paths/matchPath.js'
import { ParsedRoute, RouteMethodDeclaration, RouteRequestHandler } from './RouteRequestHandler.js'

/**
 * Used in place of the reference-sensitive `instanceof`
 * @see {isKeyworkRouterLike}
 * @ignore
 */
const $KeyworkRequestHandler = 'KeyworkRequestHandler'

const normalizeMethodVerb = new Map<HTTPMethod, NormalizedHTTPMethod>([
  ['GET', 'get'],
  ['POST', 'post'],
  ['PUT', 'put'],
  ['PATCH', 'patch'],
  ['DELETE', 'delete'],
  ['HEAD', 'head'],
  ['OPTIONS', 'options'],
  ['*', 'all'],
])

const normalizedMethodVerbs = Array.from(normalizeMethodVerb.values())

/**
 * An extendable base class for handling incoming requests from a Worker.
 *
 * @typeParam BoundAliases The bound aliases, usually defined in your wrangler.toml file.
 * @typeParam Data Optional extra data to be passed to a route handler.
 *
 * @ignore
 * @protected
 */
export class KeyworkRouter<
  BoundAliases extends {} | null = null,
  Data extends KeyworkPageFunctionData = KeyworkPageFunctionData
> implements KeyworkRouterLike<BoundAliases>
{
  routesByVerb = new Map<NormalizedHTTPMethod, ParsedRoute<BoundAliases, Data>[]>(
    normalizedMethodVerbs.map((normalizedVerb) => {
      return [normalizedVerb, []]
    })
  )

  /**
   * Given a normalized HTTP method verb, create a method handler.
   *
   * @remarks
   * Rather than define each normalized method declaration,
   * We iterate through a known set of method names to have a single implementation.
   *
   * This is mostly for internal use.
   */
  protected addHTTPMethodHandler = (
    normalizedVerb: NormalizedHTTPMethod,
    pathPattern: string,
    ...handlers: Array<RouteRequestHandler<BoundAliases, any, Data>>
  ) => {
    const parsedHandlersCollection = this.routesByVerb.get(normalizedVerb)!

    const parsedHandlers = handlers.map((handler): ParsedRoute<BoundAliases, Data> => {
      return {
        pathPattern,
        handler,
      }
    })

    parsedHandlersCollection.push(...parsedHandlers)

    return
  }

  //#region Route declaration methods

  /**
   * Defines a handler for incoming `GET` requests.
   * @public
   */
  public get!: {
    <ExpectedParams extends {} | null>(
      ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
    ): void
  }

  /**
   * Defines a handler for incoming `POST` requests.
   * @public
   */
  public post!: {
    <ExpectedParams extends {} | null>(
      ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
    ): void
  }

  /**
   * Defines a handler for incoming `PUT` requests.
   * @public
   */
  public put!: {
    <ExpectedParams extends {} | null>(
      ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
    ): void
  }

  /**
   * Defines a handler for incoming `PATCH` requests.
   * @public
   */
  public patch!: {
    <ExpectedParams extends {} | null>(
      ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
    ): void
  }

  /**
   * Defines a handler for incoming `DELETE` requests.
   * @public
   */
  public delete!: {
    <ExpectedParams extends {} | null>(
      ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
    ): void
  }

  /**
   * Defines a handler for incoming `HEAD` requests.
   * @public
   */
  public head!: {
    <ExpectedParams extends {} | null>(
      ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
    ): void
  }

  /**
   * Defines a handler for incoming `OPTIONS` requests.
   * @public
   */
  public options!: {
    <ExpectedParams extends {} | null>(
      ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
    ): void
  }

  /**
   * Defines a handler for incoming HTTP requests.
   *
   * @remarks
   * This will always be a **lower priority** than an explicitly defined method handler.

   * @public
   */
  public all!: {
    <ExpectedParams extends {} | null>(
      ...args: Parameters<RouteMethodDeclaration<BoundAliases, ExpectedParams, Data>>
    ): void
  }

  //#endregion

  //#region Router extension.

  public use(...routers: KeyworkRouter<BoundAliases>[]): void {
    for (const router of routers) {
      this.applyRouter(router)
    }
  }

  /**
   * Blends a given router into the current route map.
   * @ignore
   */
  protected applyRouter(router: KeyworkRouter<BoundAliases>): void {
    for (const [verb, routes] of router.routesByVerb.entries()) {
      for (const route of routes) {
        this.addHTTPMethodHandler(verb, route.pathPattern, route.handler)
      }
    }
  }

  //#endregion

  /**
   * A server-side logger.
   */
  public logger = new PrefixedLogger('Keywork Route Handler')

  //#endregion

  /**
   * Returns a collection of route handlers for the given HTTP method.
   *
   * @internal
   */
  protected _getParsedRoutesForMethod(normalizedMethodVerb: NormalizedHTTPMethod): ParsedRoute<BoundAliases, Data>[] {
    const verbs: readonly NormalizedHTTPMethod[] = [normalizedMethodVerb, 'all']

    const handlers = verbs.flatMap((verb) => this.routesByVerb.get(verb)!)

    return handlers
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
    (...args: Parameters<RouteRequestHandler<BoundAliases, any, Data>>): Promise<Response>
    (...args: Parameters<WorkerRequestHandler<BoundAliases>>): Promise<Response>
  } = async (...args: unknown[]): Promise<Response> => {
    // First, normalize the arguments between Cloudflare Pages and Worker Sites...
    let eventContext: IncomingRequestContext<BoundAliases, any, Data>

    if (args.length >= 3) {
      // Worker Site...
      const [request, env, executionContext] = args as Parameters<WorkerRequestHandler<BoundAliases>>

      eventContext = {
        request,
        env,
        waitUntil: executionContext.waitUntil,
        data: {} as Data,
        params: null,
        next: {} as any, // Defined below.
      }
    } else {
      // Args are already in a RouteRequestHandler shape.
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[eventContext] = args as Parameters<RouteRequestHandler<BoundAliases, any, Data>>
    }

    eventContext.data = {
      ...eventContext.data,
      session: new KeyworkSession(eventContext.request),
    }

    const requestURL = new URL(eventContext.request.url)

    // With our event context constructed, we can check for any defined methods...
    // If a method exists and routes are defined, it acts like middleware.
    const normalizedMethodVerb = normalizeMethodVerb.get(eventContext.request.method as HTTPMethod)
    const routes = normalizedMethodVerb ? this._getParsedRoutesForMethod(normalizedMethodVerb) : null

    if (!normalizedMethodVerb || !routes || !routes.length) {
      return new ErrorResponse(StatusCodes.NOT_IMPLEMENTED)
    }

    // Given the current URL, attempt to find a matching route handler...
    const matchedRoutes = routes.filter((route) => {
      return matchPath(route.pathPattern, requestURL.pathname)
    })

    let routeIndex = 0

    eventContext.next = async (input, requestInit) => {
      const matchedRoute = matchedRoutes[routeIndex]

      if (!matchedRoute) {
        if (routeIndex > 0) {
          return new ErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `\`eventContext.next()\` was called ${routeIndex + 1} times but only ${
              matchedRoutes.length
            } routes are defined for \`${requestURL.pathname}\``
          )
        }

        return new ErrorResponse(StatusCodes.NOT_FOUND, `No route matches \`${requestURL.pathname}\``)
      }

      if (input) {
        eventContext.request = new Request(input, requestInit) as RequestWithCFProperties
      }

      const response = await matchedRoute.handler({
        ...eventContext,
        next: (...args) => {
          routeIndex++
          return eventContext.next(...args)
        },
      })

      return response
    }

    try {
      return eventContext.next()
    } catch (_error) {
      this.logger.error(_error)
      this.logger.debug(eventContext)
      return ErrorResponse.fromUnknownError(_error, 'A server error occurred. Please try again later.')
    }
  };

  //#region Internal

  /** @ignore */
  readonly [$KeyworkRequestHandler] = true as boolean
  /** @ignore */
  static readonly [$KeyworkRequestHandler] = true as boolean

  //#endregion
}

/**
 * Checks if a given object is indeed a `KeyworkRouter`
 *
 * This fixes some weirdness where `instanceof` may get clobbered
 * by a user's ESBuild configuration.
 *
 * @internal
 * @ignore
 */
export function isKeyworkRouterLike<BoundAliases extends {} | null = null>(
  routerLike: unknown
): routerLike is KeyworkRouter<BoundAliases> {
  return Boolean(
    routerLike instanceof KeyworkRouter ||
      (routerLike && typeof routerLike === 'object' && $KeyworkRequestHandler in routerLike)
  )
}
