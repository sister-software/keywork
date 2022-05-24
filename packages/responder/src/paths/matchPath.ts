import { Mutable, ParsedPathParams, PathMatch, PathPattern } from './common.js'

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/docs/en/v6/api#matchpath
 */
export function matchPath<ExpectedParams extends {} | null, Path extends string>(
  pattern: PathPattern<Path> | Path,
  pathname: string
): PathMatch<ExpectedParams> | null {
  if (typeof pattern === 'string') {
    pattern = { path: pattern, caseSensitive: false, end: true }
  }

  const [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end)

  const match = pathname.match(matcher)
  if (!match) return null

  const matchedPathname = match[0]
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, '$1')
  const captureGroups = match.slice(1)
  const params = paramNames.reduce<Mutable<ParsedPathParams>>((memo, paramName, index) => {
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === '*') {
      const splatValue = captureGroups[index] || ''
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, '$1')
    }

    memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || '', paramName)
    return memo
  }, {}) as ParsedPathParams<any>

  const pathMatch: PathMatch<ExpectedParams> = {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern,
  }

  return pathMatch
}

function compilePath(path: string, caseSensitive = false, end = true): [RegExp, string[]] {
  if (!(path === '*' || !path.endsWith('*') || path.endsWith('/*'))) {
    console.warn(
      `Route path "${path}" will be treated as if it were ` +
        `"${path.replace(/\*$/, '/*')}" because the \`*\` character must ` +
        `always follow a \`/\` in the pattern. To get rid of this warning, ` +
        `please change the route path to "${path.replace(/\*$/, '/*')}".`
    )
  }

  const paramNames: string[] = []
  let regexpSource =
    '^' +
    path
      .replace(/\/*\*?$/, '') // Ignore trailing / and /*, we'll handle it below
      .replace(/^\/*/, '/') // Make sure it has a leading /
      .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
      .replace(/:(\w+)/g, (_: string, paramName: string) => {
        paramNames.push(paramName)
        return '([^\\/]+)'
      })

  if (path.endsWith('*')) {
    paramNames.push('*')
    regexpSource +=
      path === '*' || path === '/*'
        ? '(.*)$' // Already matched the initial /, just match the rest
        : '(?:\\/(.+)|\\/*)$' // Don't include the / in params["*"]
  } else {
    regexpSource += end
      ? '\\/*$' // When matching to the end, ignore trailing slashes
      : // Otherwise, match a word boundary or a proceeding /. The word boundary restricts
        // parent routes to matching only their own words and nothing more, e.g. parent
        // route "/home" should not match "/home2".
        // Additionally, allow paths starting with `.`, `-`, `~`, and url-encoded entities,
        // but do not consume the character in the matched path so they can match against
        // nested paths.
        '(?:(?=[.~-]|%[0-9A-F]{2})|\\b|\\/|$)'
  }

  const matcher = new RegExp(regexpSource, caseSensitive ? undefined : 'i')

  return [matcher, paramNames]
}

function safelyDecodeURIComponent(value: string, paramName: string) {
  try {
    return decodeURIComponent(value)
  } catch (error) {
    console.warn(
      `The value for the URL param "${paramName}" will not be decoded because` +
        ` the string "${value}" is a malformed URL segment. This is probably` +
        ` due to a bad percent encoding (${error}).`
    )

    return value
  }
}
