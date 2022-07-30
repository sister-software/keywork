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

import { KeyworkResourceError, Status } from 'keywork/errors'
import { PathMatch, PathPattern } from './common.ts'
import { isRequestLike, isURLLike, RequestLike } from './typeCasting.ts'
import { matchPath } from './matchPath.ts'

/**
 * Performs pattern matching on a URL pathname and returns information about the match.
 *
 * @see {@link https://reactrouter.com/docs/en/v6/api#matchpath}
 *
 * @throws {KeyworkResourceError}
 * @category Route
 * @category Path Parsing
 */
export function parsePathname<ExpectedParams extends {} | null>(
  pattern: PathPattern<string> | string,
  urlOrRequest: RequestLike | string | URL
): PathMatch<ExpectedParams> {
  if (!urlOrRequest) {
    throw new KeyworkResourceError(`URL or Request is not defined.`, Status.InternalServerError)
  }
  let url: URL

  if (typeof urlOrRequest === 'string') {
    url = new URL(urlOrRequest)
  } else if (isRequestLike(urlOrRequest)) {
    url = new URL(urlOrRequest.url)
  } else if (isURLLike(urlOrRequest)) {
    url = urlOrRequest
  } else {
    throw new KeyworkResourceError(`Pathname could not be parsed from ${urlOrRequest}.`, Status.InternalServerError)
  }
  const possibleMatch = matchPath<ExpectedParams, string>(pattern, url.pathname)

  if (!possibleMatch)
    throw new KeyworkResourceError(
      `Path ${url.pathname} does not this route handler's expected pattern`,
      Status.BadRequest
    )

  return possibleMatch
}
