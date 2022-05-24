import { KeyworkResourceAccessError } from '@keywork/utils'
import { StatusCodes } from 'http-status-codes'
import { PathMatch, PathPattern } from '../paths/common.js'
import { matchPath } from '../paths/matchPath.js'
import { isRequestLike, isURLLike } from './common.js'

/**
 * Performs pattern matching on a URL pathname and returns information about the match.
 *
 * @see https://reactrouter.com/docs/en/v6/api#matchpath
 *
 * @throws {KeyworkResourceAccessError}
 */
export function parsePathname<ExpectedParams extends {} | null>(
  pattern: PathPattern<string> | string,
  urlOrRequest: Pick<Request, 'url'> | string | URL
): PathMatch<ExpectedParams> {
  if (!urlOrRequest) {
    throw new KeyworkResourceAccessError(`URL or Request is not defined.`, StatusCodes.INTERNAL_SERVER_ERROR)
  }
  let url: URL

  if (typeof urlOrRequest === 'string') {
    url = new URL(urlOrRequest)
  } else if (isRequestLike(urlOrRequest)) {
    url = new URL(urlOrRequest.url)
  } else if (isURLLike(urlOrRequest)) {
    url = urlOrRequest
  } else {
    throw new KeyworkResourceAccessError(
      `Pathname could not be parsed from ${urlOrRequest}.`,
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
  const possibleMatch = matchPath<ExpectedParams, string>(pattern, url.pathname)

  if (!possibleMatch)
    throw new KeyworkResourceAccessError(
      `Path ${url.pathname} does not this route handler's expected pattern`,
      StatusCodes.BAD_REQUEST
    )

  return possibleMatch
}
