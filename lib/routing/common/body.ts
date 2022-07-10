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
import type { ReactRendererOptions } from 'keywork/react/common'
import { ErrorResponse, HTMLResponse, JSONResponse, JSXResponse } from 'keywork/responses'
import { isValidElement } from 'npm/react'

/**
 * Either a full `Response`, or a more primitive value to be processed.
 * @public
 */
export type ResponseLike = Response | React.ReactElement | {} | null | undefined | Error | string

/**
 * Infers the appropriate Response constructor for the given `ResponseLike` body.
 * @throws {KeyworkResourceError}
 * @public
 */
export function convertToResponse(responseLike: ResponseLike, reactRenderOptions?: ReactRendererOptions): Response {
  if (responseLike instanceof Response) return responseLike
  if (responseLike instanceof Error) return ErrorResponse.fromUnknownError(responseLike)

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
  }

  if (isValidElement(responseLike)) {
    return new JSXResponse(responseLike, reactRenderOptions)
  }

  if (typeof responseLike === 'object') {
    return new JSONResponse(responseLike)
  }

  throw new KeyworkResourceError(
    `Keywork could not infer the appropriate \`Response\` constructor for type ${typeof responseLike}. `,
    Status.InternalServerError
  )
}
