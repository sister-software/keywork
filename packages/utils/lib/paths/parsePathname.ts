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

import { KeyworkResourceError } from '@keywork/utils'
import { StatusCodes } from 'http-status-codes'
import { isRequestLike, isURLLike, PathMatch, PathPattern } from './common.js'
import { matchPath } from './matchPath.js'

/**
 * Performs pattern matching on a URL pathname and returns information about the match.
 *
 * @see {@link https://reactrouter.com/docs/en/v6/api#matchpath}
 *
 * @throws {@link @keywork/utils/KeyworkResourceError}
 * @category URL Parsing
 */
export function parsePathname<ExpectedParams extends {} | null>(
  pattern: PathPattern<string> | string,
  urlOrRequest: Pick<Request, 'url'> | string | URL
): PathMatch<ExpectedParams> {
  if (!urlOrRequest) {
    throw new KeyworkResourceError(`URL or Request is not defined.`, StatusCodes.INTERNAL_SERVER_ERROR)
  }
  let url: URL

  if (typeof urlOrRequest === 'string') {
    url = new URL(urlOrRequest)
  } else if (isRequestLike(urlOrRequest)) {
    url = new URL(urlOrRequest.url)
  } else if (isURLLike(urlOrRequest)) {
    url = urlOrRequest
  } else {
    throw new KeyworkResourceError(
      `Pathname could not be parsed from ${urlOrRequest}.`,
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
  const possibleMatch = matchPath<ExpectedParams, string>(pattern, url.pathname)

  if (!possibleMatch)
    throw new KeyworkResourceError(
      `Path ${url.pathname} does not this route handler's expected pattern`,
      StatusCodes.BAD_REQUEST
    )

  return possibleMatch
}
