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

import { ParsedPathParams, PathMatch, PathPattern, _Mutable } from './common.ts'

/**
 * Converts a given `PathPattern` or `string` into object form.
 * @category Path Parsing
 */
export function normalizePathPattern<Path extends string | RegExp>(
  pattern: PathPattern<Path> | Path | RegExp,
  { caseSensitive = false, end = true } = {}
): PathPattern<Path> {
  if (typeof pattern === 'string' || pattern instanceof RegExp) {
    const normalized: PathPattern<Path> = {
      path: pattern as Path,
      caseSensitive,
      end,
    }

    return normalized
  }

  return pattern
}

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @category Path Parsing
 * @see https://reactrouter.com/docs/en/v6/api#matchpath
 */
export function matchPath<ExpectedParams extends {} | null, Path extends string>(
  patternLike: PathPattern<Path> | Path,
  pathname: string
): PathMatch<ExpectedParams> | null {
  const pattern = normalizePathPattern(patternLike)
  // TODO: Consider merging these arguments.
  const compiledPath = compilePath(pattern)

  return matchPathPrecompiled(compiledPath, pathname)
}

export function matchPathPrecompiled<ExpectedParams extends {} | null>(
  { matcher, paramNames, pattern }: CompiledPath,
  pathname: string
): PathMatch<ExpectedParams> | null {
  const match = pathname.match(matcher)
  if (!match) return null

  const matchedPathname = match[0]
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, '$1')
  const captureGroups = match.slice(1)
  const params = paramNames.reduce<_Mutable<ParsedPathParams>>((memo, paramName, index) => {
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

/**
 * @ignore
 */
export interface CompiledPath<Path extends string | RegExp = string> {
  matcher: RegExp
  paramNames: string[]
  pattern: PathPattern<Path>
}

/**
 * @ignore
 */
export function compilePath<Path extends string | RegExp>(pattern: PathPattern<Path>): CompiledPath<Path> {
  let matcher: RegExp
  const paramNames: string[] = []

  if (typeof pattern.path === 'string') {
    if (!(pattern.path === '*' || !pattern.path.endsWith('*') || pattern.path.endsWith('/*'))) {
      console.warn(
        `Route path "${pattern.path}" will be treated as if it were ` +
          `"${pattern.path.replace(/\*$/, '/*')}" because the \`*\` character must ` +
          `always follow a \`/\` in the pattern. To get rid of this warning, ` +
          `please change the route path to "${pattern.path.replace(/\*$/, '/*')}".`
      )
    }

    let regexpSource =
      '^' +
      pattern.path
        .replace(/\/*\*?$/, '') // Ignore trailing / and /*, we'll handle it below
        .replace(/^\/*/, '/') // Make sure it has a leading /
        .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
        .replace(/:(\w+)/g, (_: string, paramName: string) => {
          paramNames.push(paramName)
          return '([^\\/]+)'
        })

    if (pattern.path.endsWith('*')) {
      paramNames.push('*')
      regexpSource +=
        pattern.path === '*' || pattern.path === '/*'
          ? '(.*)$' // Already matched the initial /, just match the rest
          : '(?:\\/(.+)|\\/*)$' // Don't include the / in params["*"]
    } else {
      regexpSource += pattern.end
        ? '\\/*$' // When matching to the end, ignore trailing slashes
        : // Otherwise, match a word boundary or a proceeding /. The word boundary restricts
          // parent routes to matching only their own words and nothing more, e.g. parent
          // route "/home" should not match "/home2".
          // Additionally, allow paths starting with `.`, `-`, `~`, and url-encoded entities,
          // but do not consume the character in the matched path so they can match against
          // nested paths.
          '(?:(?=[.~-]|%[0-9A-F]{2})|\\b|\\/|$)'
    }

    matcher = new RegExp(regexpSource, pattern.caseSensitive ? undefined : 'i')
  } else {
    matcher = pattern.path
  }

  return {
    pattern,
    matcher,
    paramNames,
  }
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
