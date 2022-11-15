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

import type { KeyworkRenderOptions } from '../../react/mod.ts'

/**
 * Either a full `Response`, or a more primitive value to be processed.
 * @internal
 */
// export type ResponseLike = Response | React.ReactElement | {} | null | undefined | Error | string
export type ResponseLike = React.ReactElement | null | undefined | string

/**
 * A function that confirms whether a given `ResponseLike` can be matched to a `ResponseConverter`.
 *
 * @internal
 */
export type ResponseLikeMatcher<R = ResponseLike> = (responseLike: R) => boolean

/**
 * A function that converts a `ResponseLike` to a `Response`.
 * @internal
 */

export type ResponseConverter<R = ResponseLike> = (
  responseLike: R extends ResponseLike ? R : never,
  renderOptions: KeyworkRenderOptions
) => Response | Promise<Response>

/**
 * Matched `ResponseLike`.
 * @internal
 */
export type ResponseLikeMatch =
  | 'NextMiddleware'
  | 'Empty'
  | 'Response'
  | 'ReactElement'
  | 'Error'
  | 'JSON'
  | 'HTML'
  | 'String'
  | 'ReadableStream'
  | 'Unknown'
