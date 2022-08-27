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

import { Status, STATUS_TEXT } from '../../errors/KeyworkResourceError.ts'
import {
  applyCredentialsHeader,
  applyExposeHeadersHeader,
  applyOriginHeaders,
  applyPreflightHeaders,
  CORSHeaderApplier,
  CORSOptions,
  createDefaultCORSOptions,
} from '../../http/mod.ts'
import { KeyworkRouter, KeyworkRouterOptions, RouteRequestHandler } from '../../router/mod.ts'
import HTTP from '../../__internal/http.ts'

export class CORSMiddleware extends KeyworkRouter {
  protected headerAppliers: readonly CORSHeaderApplier[] = [
    applyOriginHeaders,
    applyCredentialsHeader,
    applyExposeHeadersHeader,
    applyPreflightHeaders,
  ] as const

  public readonly corsOptions: CORSOptions

  constructor(corsOptions?: Partial<CORSOptions>, routerOptions?: KeyworkRouterOptions) {
    super(routerOptions)
    this.corsOptions = {
      ...createDefaultCORSOptions(),
      ...corsOptions,
    }

    this.all('*', this.applyCORSHeaders)
  }

  protected applyCORSHeaders: RouteRequestHandler = async (event, next) => {
    const originalResponse = await next()
    const { request } = event
    const isPreflight = request.method === 'OPTIONS'
    let response: globalThis.Response

    if (isPreflight || !originalResponse) {
      response = new HTTP.Response(null, {
        headers: originalResponse?.clone()?.headers,
        status: Status.NoContent,
        statusText: originalResponse?.statusText || STATUS_TEXT[Status.NoContent],
      })
    } else {
      response = originalResponse.clone()
    }

    for (const applyCORSHeader of this.headerAppliers) {
      await applyCORSHeader(request, response, this.corsOptions)
    }

    return response
  }
}
