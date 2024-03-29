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

import { createElement, isValidElement } from 'react'
import { KeyworkResourceError, Status, isWithinStatusCodeRange } from '../errors/index.js'
import type { IsomorphicFetchEvent } from '../events/index.js'
import { ErrorResponse, HTMLResponse, JSONResponse } from '../http/responses/index.js'
import { ReactRendererOptions, renderJSXToStream } from '../ssr/index.js'
import { PatternRouteComponentMap, isStaticPropsRequestURL } from '../uri/index.js'
import { isInstanceOfResponse } from './isInstanceOfResponse.js'

/**
 * @ignore
 */
export interface PageElementComponent<StaticProps extends {} | null = {}> extends React.ReactElement<StaticProps> {
  children?: React.ReactNode
}

/**
 * Either a full `Response`, or a more primitive value to be processed.
 * @public
 */
export type ResponseLike = Response | React.ReactElement | {} | null | undefined | Error | string

/**
 * Infers the appropriate Response constructor for the given `ResponseLike` body.
 *
 * While the {@link Keywork#Router.RequestRouter `RequestRouter`} automatically
 * converts returned values via `castToResponse`.
 *
 * @throws {KeyworkResourceError}
 * @category Type Cast
 * @public
 */
export async function castToResponse(
  event: IsomorphicFetchEvent<any, any, any>,
  responseLike: ResponseLike,
  reactRenderOptions?: ReactRendererOptions,
  routeComponentMap?: PatternRouteComponentMap
): Promise<Response> {
  if (isInstanceOfResponse(responseLike)) {
    return responseLike
  }

  if (responseLike instanceof Error) return new ErrorResponse(responseLike)

  if (responseLike instanceof ReadableStream) {
    throw new KeyworkResourceError(
      `Keywork cannot infer the 'Content-Type' for \`ReadableStream\`. Instead, wrap this value in a \`Response\``,
      Status.InternalServerError
    )
  }

  if (!responseLike) {
    return new Response(responseLike as any, { status: Status.NoContent })
  }

  if (typeof responseLike === 'string') {
    if (responseLike.startsWith('<!DOCTYPE')) {
      return new HTMLResponse(responseLike)
    }

    return new Response(responseLike)
  }

  if (typeof responseLike === 'number') {
    if (!isWithinStatusCodeRange(responseLike)) {
      return new ErrorResponse(
        Status.InternalServerError,
        `Numeric response value ${responseLike} is not a valid status code.`
      )
    }

    return new Response(undefined, { status: responseLike })
  }

  if (isStaticPropsRequestURL(event.request.url)) {
    const staticProps = isValidElement<PageElementComponent>(responseLike) ? responseLike.props : responseLike

    return new JSONResponse(staticProps)
  }

  if (isValidElement<PageElementComponent>(responseLike)) {
    const stream = await renderJSXToStream(event, responseLike, reactRenderOptions)
    return new HTMLResponse(stream)
  }

  const RouteComponent = routeComponentMap?.get(event.urlPattern.pathname)

  if (RouteComponent) {
    const stream = await renderJSXToStream(event, createElement(RouteComponent, responseLike), reactRenderOptions)
    return new HTMLResponse(stream)
  }

  if (typeof responseLike === 'object') {
    return new JSONResponse(responseLike)
  }

  throw new KeyworkResourceError(
    `Keywork could not infer the appropriate \`Response\` constructor for type ${typeof responseLike}. `,
    Status.InternalServerError
  )
}
