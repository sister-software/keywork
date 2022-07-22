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

import { Status } from 'deno/http/http_status'
import { KeyworkResourceError } from 'keywork/errors'
import { ReactRendererOptions, renderJSXToStream } from 'keywork/react/common'
import { ErrorResponse } from './ErrorResponse.ts'
import { HTMLResponse } from './HTMLResponse.ts'
import { JSONResponse } from './JSONResponse.ts'
import { isValidElement } from 'react'
import HTTP from 'keywork/platform/http'
import Stream from 'keywork/platform/stream'

/**
 * Either a full `Response`, or a more primitive value to be processed.
 * @public
 */
export type ResponseLike = globalThis.Response | React.ReactElement | {} | null | undefined | Error | string

/**
 * Checks if the given object is an instance of `Response`
 * @param responsish An object that's possibly a `Response`
 * @category Type Cast
 */
export function isInstanceOfResponse(responsish: unknown): responsish is globalThis.Response {
  return Boolean(responsish instanceof globalThis.Response || responsish instanceof HTTP.Response)
}

/**
 * Infers the appropriate Response constructor for the given `ResponseLike` body.
 * @throws {KeyworkResourceError}
 * @public
 */
export async function castToResponse(
  responseLike: ResponseLike,
  reactRenderOptions?: ReactRendererOptions
): Promise<globalThis.Response> {
  if (isInstanceOfResponse(responseLike)) {
    return responseLike
  }

  if (responseLike instanceof Error) return ErrorResponse.fromUnknownError(responseLike)

  if (responseLike instanceof Stream.ReadableStream) {
    throw new KeyworkResourceError(
      `Keywork cannot infer the 'Content-Type' for \`ReadableStream\`. Instead, wrap this value in a \`Response\``,
      Status.InternalServerError
    )
  }

  if (!responseLike) {
    return new HTTP.Response(responseLike as any, { status: Status.NoContent })
  }

  if (typeof responseLike === 'string') {
    if (responseLike.startsWith('<!DOCTYPE')) {
      return new HTMLResponse(responseLike)
    }

    return new HTTP.Response(responseLike)
  }

  if (isValidElement(responseLike)) {
    const stream = await renderJSXToStream(responseLike, reactRenderOptions)
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
