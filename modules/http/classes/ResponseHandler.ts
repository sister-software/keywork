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

import { isValidElement } from 'https://esm.sh/react@18.2.0'
import { KeyworkResourceError, Status } from '../../errors/mod.ts'
import { KeyworkRenderOptions } from '../../react/mod.ts'
import { isInstanceOfResponse } from '../functions/isInstanceOfResponse.ts'
import type { ResponseConverter, ResponseLike, ResponseLikeMatch, ResponseLikeMatcher } from '../interfaces/mod.ts'
import { EmptyResponse } from './EmptyResponse.ts'
import { ErrorResponse } from './ErrorResponse.ts'
import { JSONResponse } from './JSONResponse.ts'

/**
 * @internal
 */
export type ResponseHandlerEntry = readonly [ResponseLikeMatch, ResponseLikeMatcher, ResponseConverter]

/**
 * @internal
 */
export const defaultResponseHandlerEntries: readonly ResponseHandlerEntry[] = [
  [
    //
    'Empty',
    (responseLike) => {
      // Note that null is an indication that the router should fallback to the next route.
      return responseLike !== null && responseLike === undefined
    },
    () => new EmptyResponse(),
  ],
  [
    //
    'Response',
    (responseLike) => isInstanceOfResponse(responseLike),
    (responseLike: Response) => responseLike,
  ],
  [
    //
    'ReactElement',
    (responseLike) => isValidElement(responseLike),
    HTMLResponse.fromResponseLike,
  ],
  [
    //
    'Error',
    (responseLike) => responseLike instanceof Error,
    ErrorResponse.fromResponseLike,
  ],
  [
    //
    'JSON',
    (responseLike) => typeof responseLike === 'object' && responseLike !== null,
    JSONResponse.fromResponseLike,
  ],
  [
    //
    'HTML',
    (responseLike) => typeof responseLike === 'string' && responseLike.startsWith('<!DOCTYPE html>'),
    HTMLResponse.fromResponseLike,
  ],
  [
    //
    'String',
    (responseLike) => typeof responseLike === 'string',
    (textContent: string) => new Response(textContent),
  ],
  [
    //
    'ReadableStream',
    (responseLike) => responseLike instanceof ReadableStream,
    () => {
      throw new KeyworkResourceError(
        `Keywork cannot infer the 'Content-Type' for \`ReadableStream\`. Instead, wrap this value in a \`Response\``,
        Status.InternalServerError
      )
    },
  ],
]

/**
 * Keywork's internal map of known of Response Converters.
 *
 * Entries may added to support the returning of new classes,
 * or be overridden, such as to provide custom error handling,
 *
 * @internal
 */
export class ResponseHandler {
  protected kindToMatcher = new Map<ResponseLikeMatch, ResponseLikeMatcher>()
  protected matcherToKind = new Map<ResponseLikeMatcher, ResponseLikeMatch>()
  protected kindToConverter = new Map<ResponseLikeMatch, ResponseConverter>()

  constructor(
    protected renderOptions: KeyworkRenderOptions,
    /** Optional override of built-in entries. */
    responseParserEntries: readonly ResponseHandlerEntry[] = defaultResponseHandlerEntries
  ) {
    for (const [kind, matcher, converter] of responseParserEntries) {
      this.addMatcher(kind, matcher)
      this.addConverter(kind, converter)
    }
  }

  /**
   * Infers the appropriate `Response` constructor for the given `ResponseLike` body.
   */
  public getResponseKind<R = ResponseLike>(responseLike: R): ResponseLikeMatch {
    for (const [responseKind, responseMatcher] of this.kindToMatcher) {
      if (responseMatcher(responseLike)) {
        return responseKind
      }
    }

    return 'Unknown'
  }

  /**
   * Parses a given `ResponseLike`, and converts it into a `Response` with the appropriate converter.
   */
  public convert(responseLike: ResponseLike): Response | Promise<Response> {
    const responseKind = this.getResponseKind(responseLike)
    const converter = this.kindToConverter.get(responseKind)

    if (!converter) {
      throw new KeyworkResourceError(
        `No response converter found for response kind "${responseKind}". Type "${typeof responseLike}" is not supported.`,
        Status.InternalServerError
      )
    }
    return converter(responseLike, this.renderOptions)
  }

  public addMatcher(kind: ResponseLikeMatch, matcher: ResponseLikeMatcher): void {
    this.kindToMatcher.set(kind, matcher)
    this.matcherToKind.set(matcher, kind)
  }

  public addConverter(kind: ResponseLikeMatch, converter: ResponseConverter): void {
    this.kindToConverter.set(kind, converter)
  }
}

const [ResponseHandlerContext, useResponseHandler] = createContextAndNamedHook<ResponseHandler>(
  undefined,
  'ResponseHandlerContext'
)
export { ResponseHandlerContext, useResponseHandler }
